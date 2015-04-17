var server = require('../server');

function chathandle(){
}

chathandle.prototype = {
  get:function(request, response){
    response.writeHead(200,{'Content-Type': 'text/plain'});
    response.write("chat");
    response.end();
  },
}

exports.handle = new chathandle();
