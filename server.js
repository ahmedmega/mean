
var http = require("http");
var express = require("express");
var app = express();

//var ejsEngine = require("ejs-locals");

////set up the view engine
//app.set("view engine","pug"); // pug view engine

//app.engine("ejs",ejsEngine);//support master pages
//app.set("view engine","ejs");// ejs view engine

app.set("view engine","vash"); // vash view engine

app.get("/",function(req, res){
    //res.send("<h1> Hello  </h1>");
    //res.render("pug/index",{title:"Express + Pug"});
    //res.render("ejs/index",{title:"Express + ejs"});
    res.render("index",{title:"Express + vash"});
});

app.get("/api/users",function(req,res){
    res.set("Content-Type","application/json");
    res.send({name:"ahmed", age:33});
});

var server = http.createServer(app);

server.listen(3000);
