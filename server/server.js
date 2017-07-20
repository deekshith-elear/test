/**
 * Created by abhisheks on 6/19/2017.
 */

// Get dependencies
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
//Through Babel convering ES6 to ES5.
import shrinkRay from 'shrink-ray';
import errorHandler from 'errorhandler';
import lusca from 'lusca';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import path from 'path';
import {environment} from './config/env-variables.js'
import './config/mongoose.js';
// Get our API routes
const api = require('./routes/routes.js');

const app = express();
console.log("let's Test !! Can I change ");
// Parsers for POST data
app.use(shrinkRay());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());
app.use(cookieParser());
// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

// Set our api routes
app.use('/api', api);
//Need to set according to environment.
app.use(lusca({
  csrf: {
    angular: true
  },
  xframe: 'SAMEORIGIN',
  hsts: {
    maxAge: 31536000, //1 year, in seconds
    includeSubDomains: true,
    preload: true
  },
  xssProtection: true
}));
//Need to set according to environment.
app.use(errorHandler()); // Error handler - has to be last
// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || environment.nodeServer;
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));
