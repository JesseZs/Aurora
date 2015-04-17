var http = require('http');
var url = require('url');
var querystring = require('querystring');

var define = require('./define');
var route = require('./route');
var mongo = require('./core/mongo');

var handleMap = route.handleMap;

function start(){
  function onRequest(request,response){
    request.setEncoding('utf-8');
    var requestdata = '';
    request.on('data', function(datachunk){
      requestdata += datachunk;
    });
    request.on('end', function(){
      var _url = url.parse(request.url);
      var pathname = _url.pathname;
      var params = querystring.parse(requestdata);
      if(request.method == "GET") params = _url.query;
      var handle = handleMap[pathname];
      var method = request.method.toLowerCase();
      var hasresponse = false;
      
      if( handle && handle[method]){
        console.log("---request---path["+pathname+"] method["+method+"]---");
        handle[method](params,response);
      }
      else{
        console.log("unrecognized handle... path["+pathname+"] method["+method+"]");
        response.writeHead(404, {'Content-Type': 'text/plain'});
        response.write('404 Not found!~');
        response.end();
      }
    });
  }
  
  var server = http.createServer(onRequest);
  server.listen(define.port, function(){
    console.log("server["+define.port+"] has started...");
  });
  server.on('close', function(){
    mongo.mongo.close();
  });
}

function registerHandle(pathname,handle){
  if(pathname in handleMap) throw "handle["+pathname+"] has registered!~";return;
  console.log("register..."+pathname);
  handleMap[pathname] = handle;
}

exports.start = start;
exports.registerHandle = registerHandle;
