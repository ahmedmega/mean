
var http = require("http");

var server = http.createServer(function(req,res){ 
    res.write("<div> Hello </div>")
    res.end("test w"); 
});

server.listen(3000);
