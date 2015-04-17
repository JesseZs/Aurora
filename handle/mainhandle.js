
var server = require('../server');

function mainhandle(){
}

mainhandle.prototype = {
  get : function(params, response){
    response.writeHead(200,{'Content-Type': 'text/plain'});
    response.write("hello world!~");
    response.end();
  },
}

exports.handle = new mainhandle();
