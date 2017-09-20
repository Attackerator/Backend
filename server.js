'use strict';

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const debug = require('debug')('app:server');

require('dotenv').load();

const app = express();

app.use(morgan('dev'));
app.use(cors());

app.use(require('./routes/user-routes'));

// Authentication, sets req.user
app.use('/api/*', require('./lib/bearer-auth-middleware'));

app.use(require('./routes/stats-routes'));
app.use(require('./routes/character-routes'));
app.use(require('./routes/attack-routes'));
app.use(require('./routes/spell-route'));
app.use(require('./routes/skill-routes'));

app.use(require('./lib/error-middleware.js'));

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
