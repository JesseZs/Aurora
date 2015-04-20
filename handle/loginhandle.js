var define = require('../define');

function loginhandle(){
  this.handles = {};
  this.handles['login'] = this.login;
}
loginhandle.prototype = {
  get:function(params, response){
    //response.writeHead(200,{'Content-Type': 'text/plain'});
    //response.write("render login view, perfecting...");
    //response.end();
    this.post(params,response);
  },
  post:function(params, response){
    //console.log(params);
    var result = {};
    var flag = {};
    try{
      //response.writeHead(200,{'Content-Type': 'text/plain'});
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

  login:function(data,response,callback,ud){
    var params = JSON.parse(data);
    //console.log(data);
    //console.log(params);
    var res = {};
    res.params = params;
    var user_table = require('../core/mongo').mongo.table('user');
    var user = user_table.find({'user_id': params.user_id,'user_password':params.user_password}).toArray(function(err,items){
      if(items.length>0){
        var auth_token = items[0]._id;
        response.cookie(define.auth_cookie_name,auth_token, {path: '/', maxAge: define.auth_cookie_age});
        console.log(items[0]);
        res.result = 0;
        res.user = {'user_id':items[0].user_id,'user_name':items[0].user_name};
      }
      else{
        res.result = 1;
        res.data = "user id and password are not matched!~";
      }
      callback(res,response,ud);
    }.bind(this));
    
  },

}

exports.handle = new loginhandle();
