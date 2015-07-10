//var mongodb = require('mongodb').MongoClient;

var mongoose = require('mongoose');
var define = require('../define');

function mongoutils(){
  this._db = null;
}

mongoutils.prototype = {
  init:function(){
    this._db = mongoose.createConnection(define.dburl);
    this._db.on('error', function(error){
        console.log(error);
    });
    console.log("----------mongodb------------connected-----------");
    return this;
  },

  get db(){
    return this._db;
  },

  get schema(){
    return mongoose.Schema;
  },
  
  close:function(){
    this._db.close();
    console.log("-----------mongodb-----------close-------------");
  },  
}

module.exports = (new mongoutils()).init();


