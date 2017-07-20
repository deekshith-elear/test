// //Temporary File to create passport-local startegy.
// <!-- /*==========================================================================*/
// /*********************************************************************************/
// /**
//  * @fileOverview Security view - Temp file to test local login
//  * @author Ashish Bajaj, ashish@elear.solutions
//  * @copyright Copyright (c) 2016 Elear Solutions Tech Private Limited. All rights
//  * reserved.
//  * @license To any person (the "Recipient") obtaining a copy of this software and
//  * associated documentation files (the "Software"):
//  *
//  * All information contained in or disclosed by this software is confidential
//  * and proprietary information of Elear Solutions Tech Private Limited and all
//  * rights therein are expressly reserved. By accepting this material the
//  * recipient agrees that this material and the information contained therein is
//  * held in confidence and in trust and will NOT be used, copied, modified,
//  * merged, published, distributed, sublicensed, reproduced in whole or in part,
//  * nor its contents revealed in any manner to others without the express
//  * written permission of Elear Solutions Tech Private Limited.
//  */
// /*********************************************************************************/
// /*===============================================================================*/ -->

var express         = require('express'),
  app             = express(),
  passport        = require('passport'),
  LocalStrategy   = require('passport-local').Strategy,
  bodyParser      = require('body-parser'),
  session         = require('express-session');
var cookieParser = require('cookie-parser');
app.use(cookieParser());

// hardcoded users, ideally the users should be stored in a database
var users = [{"id":111, "username":"amy", "password":"amyspassword"}];

// passport needs ability to serialize and unserialize users out of session
passport.serializeUser(function (user, done) {
  done(null, users[0].id);
});
passport.deserializeUser(function (id, done) {
  done(null, users[0]);
});

// passport local strategy for local-login, local refers to this app
passport.use('local-login', new LocalStrategy(
  function (username, password, done) {
    console.log("Hey -- "+username+" "+password);
    if (username === users[0].username && password === users[0].password) {
      return done(null, users[0]);
    } else {
      return done(null, false, {"message": "User not found."});
    }
  })
);

// body-parser for retrieving form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// initialize passposrt and and session for persistent login sessions
app.use(session({
  secret: "tHiSiSasEcRetStr",
  resave: true,
  saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.sendStatus(401);
}

app.get("/", function (req, res) {
  res.send("Hello!");
});

// api endpoints for login, content and logout
app.get("/login", function (req, res) {
  res.send("<p>Please login!</p><form method='post' action='/login'><input type='text' name='username'/><input type='password' name='password'/><button type='submit' value='submit'>Submit</buttom></form>");
});
app.post("/login",
  passport.authenticate("local-login", { failureRedirect: "/"}),
  function (req, res) {
    res.redirect("/content");
  });
app.get("/content", isLoggedIn, function (req, res) {
  res.send("Congratulations! you've successfully logged in.");
});
app.get("/logout", function (req, res) {
  req.logout();
  res.send("logout success!");
});

// launch the app
app.listen(3030);
console.log("App running at localhost:3030");
