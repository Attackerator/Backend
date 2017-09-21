'use strict';

const jsonParser = require('body-parser').json();
const debug = require('debug')('app:route/user');
const Router = require('express').Router;

const User = require('../model/user');

const basicAuth = require('../lib/basic-auth-middleware');

const router = module.exports = new Router();

router.get('/api/signin', basicAuth, function(req,res,next){
  debug('GET /api/signin');

  User.findOne({username: req.auth.username})
    .then(user => user.comparePasswordHash(req.auth.password))
    .then(user => user.generateToken())
    .then(token => res.send(token))
    .catch(next);
});

router.post('/api/user', jsonParser, function (req,res,next){
  debug('POST /api/user');

  let body = JSON.parse(JSON.stringify(req.body));

  debug('BODY', body);

  User.createUser(body)
    .then(user => user.generateToken())
    .then(token => {
      return token;
    })
    .then(token => res.send(token))
    .catch(next);
});
