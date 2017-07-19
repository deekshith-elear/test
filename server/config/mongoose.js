/**
 * Created by abhisheks on 6/27/2017.
 */
import {mongo} from 'mongodb';
var MongoClient = require('mongodb').MongoClient;
import {environment} from '../config/env-variables.js'
var url = environment.mongooseURL;

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  db.collection("testDBConnection", function(err, res) {
    if (err) throw err;
    console.log("DB is connected !!");
    db.close();
  });
});
