(function (data) {

    var seedData = require('./seedData');
    var database = require("./database");
    data.getNoteCategories = function (next) {
        //next(null, seedData.initialNotes);
        database.getDb(function (err, db) {
            if (err) {
                next(err, null);
            } else {
                db.notes.find().toArray(function (err, result) {
                    if (err) {
                        next(err, null);
                    } else {
                        next(null, result);
                    }
                });
            }
        });
    };


  data.addNote = function(categoryName,noteToInsert,next){

     database.getDb(function (err, db) {
            if (err) {
                next(err);
            } else {
                db.notes.update({name:categoryName},{ $push : {notes:noteToInsert}},next);
            }
        });
  };

  data.createNewCategory = function (categoryName, next) {
    database.getDb(function (err, db) {
      if (err) {
        next(err);
      } else {
        db.notes.find({ name: categoryName }).count(function (err, count) {

          if (err) {
            next(err);
          } else {

            if (count != 0) {
              next("Category already exists");
            } else {
              var cat = {
                name: categoryName,
                notes: []
              };
              db.notes.insert(cat, function (err) {
                if (err) {
                  next(err);
                } else {
                  next(null);
                }
              });
            }
          }
        });
      }
    });
  };

  data.getNotes = function(categoryName,next){

     database.getDb(function (err, db) {
            if (err) {
                next(err);
            } else {
                db.notes.findOne({name:categoryName},next);
            }
        });
  };
    
    function seedDatabase() {
        database.getDb(function (err, db) {
            if (err) {
                console.log("Failed to seed database" + err);
            } else {
                db.notes.count(function (err, count) {
                    if (err) {
                        console.log("Failed to retrieve database count");
                    } else {
                        if (count == 0) {
                            console.log("seeding database");

                            seedData.initialNotes.forEach(function (item) {
                                db.notes.insert(item, function (err) {
                                    if (err) console.log("Failed To insert Note into database");
                                });
                            });
                        }
                        else {
                            console.log("Database already seeded");

                        }
                    }
                });
            }
        });
    };

    seedDatabase();
})(module.exports);