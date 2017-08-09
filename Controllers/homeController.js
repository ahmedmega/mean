
(function (homeController) {

    var data = require("../data");
    homeController.init = function (app) {

        app.get("/", function (req, res) {
            //res.send("<h1> Hello  </h1>");
            //res.render("pug/index",{title:"Express + Pug"});
            //res.render("ejs/index",{title:"Express + ejs"});
            
            data.getNoteCategories(function(err,result){
                res.render("index", { title: "Express + vash." , error:err,categories:result});
            });            
        });
    };

})(module.exports);