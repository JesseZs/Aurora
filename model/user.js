var mongo = require('../core/mongo')

var userSchema = new mongo.schema({
  username   : {type : String},
  password   : {type : String}
  nickname   : {type : String},
  age        : {type : Number},
  createtime : {type : Date, default: Date.now},
  updatetime : {type : Date, default: Date.now},
});

userModel = mongo.db.model('mongoose', userSchema)

function user(){
}

user.prototype = {
}

user.find_user = function(_id){
  userModel.find({'_id':_id}, {}, {}, function(error, result){
    if(error){
      console.log(error);
    }
    else{
      return ;
    }
  });
}

model.exports = user;


