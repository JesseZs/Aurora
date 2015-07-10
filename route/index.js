var url = require('url');
var querystring = require('querystring');

var handleMap = {}

handleMap['/'] = require('./main');
handleMap['/register'] = require('./register');
handleMap['/login'] = require('./login');

module.exports = function(app){
  app.use(function(req, res, next){
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
  });
};
