var crypto = require('crypto');
var define = require('../define');

var _user_table = null;

function getUserTable(){
  if(!_user_table) _user_table = require('../core/mongo').mongo.table('user');
  return _user_table;
}

this.verify_id = function(user_id,callback){
  var res = {'result':0};
  var idreg = /[0-9a-zA-Z_]{3}@[0-9a-zA-Z]{2}.[a-zA-Z]+/i;
  if(!idreg.test(user_id)){
    res.result = 1002;
    res.data = "id must be email";
    callback(false,res);
    return;
  }
  var user_table = getUserTable();
  user_table.find({'user_id':user_id}).toArray(function(err,items){
    if(items.length>0){
      res.result = 1001;
      res.data = "id has been used";
      callback(false,res);
    }
    else{
      callback(true,res);
    }
  }.bind(this));
}

this.verify_login = function(id,password,callback){
  var res = {};
  var user_table = getUserTable();
  var user = user_table.find({'user_id': id}).toArray(function(err,items){
    if(items.length>0){
       if(items[0].user_password === password){
         getToken([items[0]._id,items[0].user_id,items[0].user_password],function(auth_token){
           res.result = 0;
           res.user = {'user_id':items[0].user_id,'user_name':items[0].user_name};
           res.token = auth_token;
           callback(true,res);
         }.bind(this));
       }
       else{
         res.result = 1007;
         res.data = "user id is not existed!~";
         callback(false,res);
       }
     }
     else{
       res.result = 1004;
       res.data = "user id and password are not matched!~";
       callback(false,res);
     }
     
   }.bind(this));
}

this.register = function(params,callback){
  if(params.user_id && params.user_name && params.user_password){ 
    this.verify_id(params.user_id,function(isDo,res){
      if(isDo){
        var user_table = getUserTable();
        user_table.insert([{'user_id':params.user_id,
                      'user_password':params.user_password,
                      'user_name':params.user_name}],{'safe':true},function(err,result){
          res.result = 0;
          callback(res);
        });
      }
      else{
        callback(res);
      }
    }.bind(this));
  }
  else{
    var res = {};
    res.result = 1005;
    res.data = "id,name,password must be required!~";
    callback(res);
  }
}

function encrypt(str,secret){
  var cipher = crypto.createCipher('aes192', secret);
  var enc = cipher.update(str,'utf8','hex');
  enc += cipher.final('hex');
  return enc;
}

function decrypt(str,secret){
  var decipher = crypto.createDecipher('aes192', secret);
  var dec = decipher.update(str,'hex','utf8');
  dec += decipher.final('utf8');
  return dec;
}

function getToken(params,callback){
  params.push(new Date().getTime());
  var token = encrypt(params.join('_'),define.token_secret);
  if(typeof callback == 'function') callback(token);
  else return token;
}

this.verify_token = function(token,callback){
  var res = {"result":0};
  if(!token){
    res.result = 1006;
    res.data = "no token";
    callback(false,res);
  }
  var token_de = decrypt(token,define.token_secret);
  var params = token_de.split('_');
  console.log(params);
  if( params[-1] - new Date().getTime() > define.auth_token_age ){
    res.result = 1006;
    res.data = "token is timeout";
    callback(false,res);
  }
  try{
    var user_table = getUserTable();
    var user = user_table.find({'user_id': params[1],'user_password':params[2]}).toArray(function(err,items){
      if(items.length > 0 && items[0]._id == params[0]){
        res.result = 0;
        callback(true,res);
      }
      else{
        res.result = 1006;
        res.data = "error token";
        callback(false,res);
      }
    }.bind(this));
  }
  catch(ex){
    console.log(ex);
    res.result = 1006;
    res.data = "token exception"
    callback(false,res);
  }
}


