
(function (controllers) {

    var homeController = require("./homeController");
    var noteController = require("./notesController");

    controllers.init = function (app) {
        homeController.init(app);
        noteController.init(app);
    };

})(module.exports);