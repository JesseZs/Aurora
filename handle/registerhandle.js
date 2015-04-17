
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
    //console.log(params);
    var result = {};
    try{
      response.writeHead(200,{'Content-Type': 'text/plain'});
      for(key in params){
        if(this.handles[key]) result[key] = this.handles[key](params[key],response);
      }
      response.end(JSON.stringify(result));
    }catch(ex){
      console.log(ex);
      response.writeHead(500,{'Content-Type': 'text/plain'});
      response.end();
    }
  },

  register:function(data, response){
    var params = JSON.parse(data);
    //console.log(data);
    //console.log(params);
    var res ={};
    res.params = params;
    var user_table = require('../core/mongo').mongo.table('user');
    if(params.user_id && params.user_name && params.user_password){
      if(user_table.find({'user_id':params.user_id})){
        res.result = 1;
        res.data = "id has existed!~";
      }
      else{
        user_table.insert({'user_id':params.user_id,
                      'user_password':params.user_password,
                      'user_name':params.user_name});
        res.result = 0;
      }
      
    }
    else{
      res.result = 2;
      res.data = "id,name,password must be required!~";
    }
    return res;
  },

}

exports.handle = new registerhandle();
