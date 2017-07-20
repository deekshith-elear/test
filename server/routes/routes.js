// <!-- /*==========================================================================*/
// /*********************************************************************************/
// /**
//  * @fileOverview Security view - File for all the routes
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

// File Containing All Routes ..
// You can delete all the routes and put your routes...
const express = require('express');
const router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
// declare axios for making http requests
import {axios} from 'axios';
const API = 'https://jsonplaceholder.typicode.com';
mongoose.connect('mongodb://localhost:27017/MyDatabase');
var Schema = mongoose.Schema;
var UserDetail = new Schema({
  username: String,
  password: String
}, {
  collection: 'userInfo'
});
var UserDetails = mongoose.model('userInfo', UserDetail);
/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works Abhishek!');
});
router.get('/me', (req, res) => {
  res.send('Hello World ! I am Anton !!');
});

// Get all posts
router.get('/posts', (req, res) => {
  // Get posts from the mock api
  // This should ideally be replaced with a service that connects to MongoDB
  axios.get(`${API}/posts`)
  .then(posts => {
  res.status(200).json(posts.data);
})
.catch(error => {
  res.status(500).send(error)
});
});


//app passport function
router.put('/log',
  passport.authenticate('local', {
    successRedirect: 'http://localhost:3000/api/loginSuccess',
    failureRedirect: 'http://localhost:3000/api/loginFailure'
  })
);


router.get('/loginFailure', function(req, res, next) {
  res.send('Failed to authenticate');
});
router.post('/login', function(req, res, next) {
  res.send('Failed to Once');
});
router.get('/loginSuccess', function(req, res, next) {
  res.send('Successfully authenticated');
});

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log("Hello 2");
    UserDetails.findOne({ username: username }, function (err, user) {
      console.log("Hello 1");
      if (err) { console.log("Hello 3"); return done(err); }
      if (!user) { console.log("Hello 4"); return done(null, false); }
      if (!user.verifyPassword(password)) { console.log("Hello 5"); return done(null, false); }
      return done(null, user);
    });
  }
));

module.exports = router;
