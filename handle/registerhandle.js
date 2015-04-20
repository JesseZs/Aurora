
function registerhandle(){
  this.handles = {};
  this.handles['register'] = this.register;
}
registerhandle.prototype = {
  get : function(params, response){
    //response.writeHead(200,{'Content-Type': 'text/plain'});
    //response.write("render register view, perfecting...");
    //response.end();
    this.post(params,response);
  },
  
  post:function(params, response){
    var result = {};
    var flag = {};
    try{
      response.writeHead(200,{'Content-Type': 'text/plain'});
      for(key in params){
        if(this.handles[key]){
          flag[key] = false;
          this.handles[key](params[key],response,function(res,response,ud){
            result[ud.key] = res;
            flag[ud.key] = true;
            this.responsehandle(flag,params,result,response);
          }.bind(this),{'key':key});
        }
      }
      //response.end(JSON.stringify(result));
    }catch(ex){
      console.log(ex);
      response.writeHead(500,{'Content-Type': 'text/plain'});
      response.end();
    }
  },
  
  responsehandle:function(flag,params,result,response){
    for(var key in params){
      if(flag[key]) continue;
      else return;
    }
    console.log(result);
    response.end(JSON.stringify(result));

  },

  register:function(data, response,callback,ud){
    var params = JSON.parse(data);
    var res ={};
    res.params = params;
    var user_table = require('../core/mongo').mongo.table('user');
    if(params.user_id && params.user_name && params.user_password){
      user_table.find({'user_id':params.user_id}).toArray(function(err,items){
        if(items.length>0){
          res.result = 1;
          res.data = "id has existed!~";
          callback(res,response,ud);
        }
        else{
          user_table.insert([{'user_id':params.user_id,
                        'user_password':params.user_password,
                        'user_name':params.user_name}],{'safe':true},function(err,result){
            res.result = 0;
            callback(res,response,ud);
          });
        }
      });
    }
    else{
      res.result = 2;
      res.data = "id,name,password must be required!~";
      callback(res,response,ud);
    }
  },

}

exports.handle = new registerhandle();
