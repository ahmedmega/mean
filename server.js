
var http = require("http");
var express = require("express");
var app = express();

//var ejsEngine = require("ejs-locals");
var controllers = require("./controllers");

////set up the view engine
//app.set("view engine","pug"); // pug view engine

//app.engine("ejs",ejsEngine);//support master pages
//app.set("view engine","ejs");// ejs view engine

app.set("view engine","vash"); // vash view engine

//set the public static resource folder
app.use(express.static(__dirname + "/public"));

//Map the routes
controllers.init(app);

app.get("/api/users",function(req,res){
    res.set("Content-Type","application/json");
    res.send({name:"ahmed", age:33});
});

var server = http.createServer(app);

server.listen(3000);
