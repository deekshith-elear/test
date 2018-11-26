// <!-- /*==========================================================================*/
// /*********************************************************************************/
// /**
//  * @fileOverview Security view - File for generic logger
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

var winston = require('winston');
winston.emitErrs = true;

var logger = new winston.Logger({
  transports: [
    new winston.transports.File({
      level: 'info',
      filename: './logs/all-logs.log',
      handleExceptions: true,
      json: true,
      maxsize: 5242880, //5MB
      maxFiles: 5,
      colorize: false
    }),
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true
    })
  ],
  exitOnError: false
});

module.exports = logger;
module.exports.stream = {
  write: function(message, encoding){
    logger.info(message);
  }
};