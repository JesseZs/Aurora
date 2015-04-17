
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
  login:function(data,response){
    var params = JSON.parse(data);
    //console.log(data);
    //console.log(params);
    var res = {};
    res.params = params;
    var user_table = require('../core/mongo').mongo.table('user');
    var user = user_table.find({'user_id': params.user_id});

    if(user && user.user_password === params.user_password){
      //response.cookie('aurora_login',auth_token, {path: '/', maxAge: 1000*60*60*24*7});
      res.result = 0;
      res.user = {'user_id':user.user_id,'user_name':user.user_name,'user_password':user.user_password};
    }
    else{
      res.result = 1;
      res.data = "user id and password are not matched!~";
    }
    return res;
  },

}

exports.handle = new loginhandle();
