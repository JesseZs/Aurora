var define = require('../define');
var account = require('../controller/account');

function majorhandle(){
  this.handles = {};
  this.handles['uploadwifi'] = this.uploadwifi;
}
majorhandle.prototype = {
  get:function(params, response){
    response.writeHead(200,{'Content-Type': 'text/plain'});
    response.write("render major view, perfecting...");
    response.write(JSON.stringify(params));
    response.end();
    //this.post(params,response);
  },
  post:function(params, response){
    var result = {};
    var flag = {};
    try{
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

  uploadwifi:function(data,response,callback,ud){
    var params = JSON.parse(data);
    account.verify_token(params.token,function(isGo,res){
      res.params = params;
      if(!isGo){
        callback(res,response,ud);
      }
      else{
        res.data = "token verify success!~ other are developing...";
        callback(res,response,ud);
      }

    }.bind(this));
  },

}

exports.handle = new majorhandle();
