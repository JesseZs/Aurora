var define = require('../define');
var account = require('../controller/account');

function loginhandle(){
  this.handles = {};
  this.handles['login'] = this.login;
}
loginhandle.prototype = {
  get:function(params, response){
    response.writeHead(200,{'Content-Type': 'text/plain'});
    response.write("render login view, perfecting...");
    response.write(JSON.stringify(params));
    response.end();
    //this.post(params,response);
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
    account.verify_login(params.user_id,params.user_password,function(isSuccess,result){
      /*if(isSuccess){
        response.cookie(define.auth_cookie_name,auth_token, {path: '/', maxAge: define.auth_token_age});
      }*/
      result.params = params;
      callback(result,response,ud);
    }.bind(this));
    
  },

}

exports.handle = new loginhandle();
