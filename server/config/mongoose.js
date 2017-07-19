/**
 * Created by abhisheks on 6/27/2017.
 */
<!-- /*==========================================================================*/
/*********************************************************************************/
/**
 * @fileOverview Security view - File to setup MongoDb
 * @author Ashish Bajaj, ashish@elear.solutions
 * @copyright Copyright (c) 2016 Elear Solutions Tech Private Limited. All rights
 * reserved.
 * @license To any person (the "Recipient") obtaining a copy of this software and
 * associated documentation files (the "Software"):
 *
 * All information contained in or disclosed by this software is confidential
 * and proprietary information of Elear Solutions Tech Private Limited and all
 * rights therein are expressly reserved. By accepting this material the
 * recipient agrees that this material and the information contained therein is
 * held in confidence and in trust and will NOT be used, copied, modified,
 * merged, published, distributed, sublicensed, reproduced in whole or in part,
 * nor its contents revealed in any manner to others without the express
 * written permission of Elear Solutions Tech Private Limited.
 */
/*********************************************************************************/
/*===============================================================================*/ -->
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
