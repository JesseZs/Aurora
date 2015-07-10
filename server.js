var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.id')(http);

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var define = require('./define');
var mongo = require('./core/mongo');

module.exports = function(){

  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(bodyParser.uilencoded({extended:true}));

  app.use(express.static(path.join(__dirname, 'static')));

  require('./route')(app);

  http.listen(define.port | 8891, function(){
    console.log("server["+define.port+"] has started...");
  });
  server.on('close', function(){
    mongo.mongo.close();
  });

  io.on('connection', function(socket){
  });
};


