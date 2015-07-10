var account = require('../controller/account');

function register(){
  this.handles = {};
  this.handles['register'] = this.register;
  this.handles['verifyid'] = this.verifyid;
}
register.prototype = {
  get : function(params, response){
    response.writeHead(200,{'Content-Type': 'text/plain'});
    response.write("render register view, perfecting...");
    response.write(JSON.stringify(params));
    response.end();
    //this.post(params,response);
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
    account.register(params,function(res){
      res.params = params;
      callback(res,response,ud);
    }.bind(this));

  },
  
  verifyid:function(data, response,callback,ud){
    var params = JSON.parse(data);
    account.verify_id(params['user_id'],function(isDo,res){
      callback(res,response,ud);
    }.bind(this));
  },

}

exports = new register();
