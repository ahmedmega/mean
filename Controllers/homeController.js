
(function (homeController) {

    var data = require("../data");
    homeController.init = function (app) {

        app.get("/", function (req, res) {
            //res.send("<h1> Hello  </h1>");
            //res.render("pug/index",{title:"Express + Pug"});
            //res.render("ejs/index",{title:"Express + ejs"});

            data.getNoteCategories(function (err, result) {
                res.render("index", {
                    title: "Express + vash.",
                    error: err,
                    categories: result,
                    newCatError: req.flash("newCatName")
                });
            });
        });


        app.post("/newCategory", function (req, res) {
            var categoryName = req.body.categoryName;
            data.createNewCategory(categoryName, function (err) {
                if (err) {
                    // Handle Error
                    console.log(err);
                    req.flash("newCatName", err);
                    res.redirect("/");
                } else {
                    res.redirect("/notes/" + categoryName);
                }
            });
        });
    };

})(module.exports);