// auth/index.js
(function (auth) {

  var data = require("../data");
  var hasher = require("./hasher");
  var configAuth = require('./oAuth');

  var passport = require("passport");
  var localStrategy = require("passport-local").Strategy;
  var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

  function userVerify(username, password, next) {
    data.getUser(username, function (err, user) {
      if (!err && user) {
        var testHash = hasher.computeHash(password, user.salt);
        if (testHash === user.passwordHash) {
          next(null, user);
          return;
        } 
      }
      next(null, false, { message: "Invalid Credentials." });
    });
  }

  auth.ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) { 
      next();
    } else {
      res.redirect("/login");
    }
  };

  auth.ensureApiAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) { 
      next();
    } else {
      res.send(401, "Not authorized");
    }
  };

  auth.init = function (app) {

    // setup passport authentication
    passport.use(new localStrategy(userVerify));
    passport.serializeUser(function (user, next) {
      next(null, user.username);
    });
    passport.deserializeUser(function (key, next) {
      data.getUser(key, function (err, user) {
        if (err || !user) {
          next(null, false, { message: "Could not find user" });
        } else {
          next(null, user);
        }
      });
    });
    app.use(passport.initialize());
    app.use(passport.session());

    app.get("/login", function (req, res) {
      res.render("login", { title: "Login to The Board", message: req.flash("loginError") });
    });

    app.post("/login", function (req, res, next) {
      var authFunction = passport.authenticate("local", function (err, user, info) {
        if (err) {
          next(err);
        } else {
          req.logIn(user, function (err) {
            if (err) {
              next(err);
            } else {
              res.redirect("/");
            }
          });
        }
      });
      authFunction(req, res, next);
    });

    app.get("/register", function (req, res) {
      res.render("register", { title: "Register for The Board", message: req.flash("registrationError") });
    });

    app.post("/register", function (req, res) {

      var salt = hasher.createSalt();

      var user = {
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        passwordHash: hasher.computeHash(req.body.password, salt),
        salt: salt 
      };

      data.addUser(user, function (err) {
        if (err) {
          req.flash("registrationError", "Could not save user to database.");
          res.redirect("/register");
        } else {
          res.redirect("/login");
        }
      });
    });

  };

 auth.initGoogleOAuth = function (app) {

    // // setup passport authentication
    //passport.use(new localStrategy(userVerify));

    passport.use(new GoogleStrategy({

        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,

    },
    function(token, refreshToken, profile, done) {
      console.log('token');
        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function() {
            console.log('nextTick');
            // try to find the user based on their google id
            data.getUserGoogle({ username : profile.id }, function(err, user) {
              console.log('getUserGoogle');
                if (err)
                    return done(err);

                if (user) {

                    // if a user is found, log them in
                    return done(null, user);
                } else {

                  var newUser = {
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    username: profile.id,
                    passwordHash: '',
                    salt: '',
                    source:'Google',
                    google: {
                      // set all of the relevant information
                      id    : profile.id,
                      token : token,
                      name  : profile.displayName,
                      email : profile.emails[0].value, // pull the first email 
                    }
                  };

                    data.addUser(newUser, function (err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });

                }
            });
        });

    })
    );

    passport.serializeUser(function (user, next) {
      console.log('serializeUser');
      console.log(user);
      next(null, user.username);
    });
    passport.deserializeUser(function (key, next) {
      console.log('deserializeUser');
      console.log(key);
      data.getUser(key, function (err, user) {
        if (err || !user) {
          next(null, false, { message: "Could not find user" });
        } else {
          next(null, user);
        }
      });
    });
    app.use(passport.initialize());
    app.use(passport.session());

    // send to google to do the authentication
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    
    // the callback after google has authenticated the user
    app.get('/auth/google/callback',    
            passport.authenticate('google', {
                    successRedirect : '/profile',
                    failureRedirect : '/'
            }));


    // route for showing the profile page
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // route for logging out
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    
    // route middleware to make sure a user is logged in
    function isLoggedIn(req, res, next) {

      // if user is authenticated in the session, carry on
      if (req.isAuthenticated())
        return next();

      // if they aren't redirect them to the home page
      res.redirect('/');
    }

    app.get("/login", function (req, res) {
      res.render("login", { title: "Login to The Board", message: req.flash("loginError") });
    });

    app.post("/login", function (req, res, next) {
      var authFunction = passport.authenticate("local", function (err, user, info) {
        if (err) {
          next(err);
        } else {
          req.logIn(user, function (err) {
            if (err) {
              next(err);
            } else {
              res.redirect("/");
            }
          });
        }
      });
      authFunction(req, res, next);
    });




  };





})(module.exports);