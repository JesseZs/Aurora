
var mongodb = require('mongodb').MongoClient;
var define = require('../define');

function mongoutils(){
  this._db = null;
}

mongoutils.prototype = {
  init:function(){
    mongodb.connect(define.dburl, function(err,_db_){
      console.log("----------mongodb------------connected-----------");
      if(err) console.log(err);
      else{
        this._db = _db_;
      }
    }.bind(this));
  },
  get db(){
    //console.log(this._db);
    return this._db;
  },
  table:function(name){
    return this._db.collection(name);
  },
  close:function(){
    console.log("-----------mongodb-----------close-------------");
    if(this.conn) this.conn.close();
  },  
}

this.mongo = new mongoutils();
this.mongo.init();
