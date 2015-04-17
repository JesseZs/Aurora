
var handleMap = {}

handleMap['/'] = require('./handle/mainhandle').handle;
handleMap['/register'] = require('./handle/registerhandle').handle;
handleMap['/login'] = require('./handle/loginhandle').handle;
handleMap['/chat'] = require('./handle/chathandle').handle;

exports.handleMap = handleMap;
