var http = require('http');
var url = require('url');
var querystring = require('querystring');

var express = require('express');
var cookieParser = require('cookie-parser');

var define = require('./define');
var route = require('./route');
var mongo = require('./core/mongo');

var handleMap = route.handleMap;

function start(){
  function onRequest(request,response,next){
    request.setEncoding('utf-8');
    var requestdata = '';
    request.on('data', function(datachunk){
      requestdata += datachunk;
    });
    request.on('end', function(){
      var _url = url.parse(request.url);
      var pathname = _url.pathname;
      if(request.method == "GET") requestdata = _url.query;
      var params = querystring.parse(requestdata);
      //if(request.method == "GET") params = _url.query;
      var handle = handleMap[pathname];
      var method = request.method.toLowerCase();
      var hasresponse = false;
      
      if( handle && handle[method]){
        console.log("---request---path["+pathname+"] method["+method+"]---");
        handle[method](params,response,request.cookies[define.auth_cookie_name]);
      }
      else{
        console.log("unrecognized handle... path["+pathname+"] method["+method+"]");
        response.writeHead(404, {'Content-Type': 'text/plain'});
        response.write('404 Not found!~');
        response.end();
      }
    });
  }
  
  var app = express();
  app.use(cookieParser());
  var server = http.createServer(app);
  app.use(onRequest);
  server.listen(define.port | 8891, function(){
    console.log("server["+define.port+"] has started...");
  });
  server.on('close', function(){
    mongo.mongo.close();
  });
}

exports.start = start;

