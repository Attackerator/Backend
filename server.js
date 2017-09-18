'use strict';

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const debug = require('debug')('app:server');

require('dotenv').load();

const app = express();

app.use(morgan('dev'));
app.use(cors());

<<<<<<< HEAD
app.use(require('./routes/stats-route'));
app.use(require('./routes/character-routes'));
=======
app.use(require('./routes/user-routes'));
>>>>>>> POST to /api/user working with valid request

const PORT = process.env.PORT;
if (!module.parent){
  if (!PORT){
    throw new Error('Forgot to specify PORT');
  }
  app.listen(PORT,function(){
    debug(`Listening on PORT ${PORT}`);
  });
}

module.exports = app;
