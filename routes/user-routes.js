'use strict';

const jsonParser = require('body-parser').json();
const debug = require('debug')('app:route/user');
const Router = require('express').Router;
const createError = require('http-errors');

const User = require('../model/user');
const Character = require('../model/character');
const Stats = require('../model/stats');
const Attacks = require('../model/attack');
const Spells = require('../model/spells');
const Skills = require('../model/skills');
const Saves = require('../model/save');

const basicAuth = require('../lib/basic-auth-middleware');
const bearerAuth = require('../lib/bearer-auth-middleware');

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

router.put('/api/user/:id', jsonParser, bearerAuth, function(req, res, next) {
  debug('PUT /api/user/:id');

  User.findById(req.params.id)
    .then(user => {
      debug('req.body', req.body);
      debug('user', user);
      if(user._id.toString() !== req.user._id.toString()) {
        debug(`permission denied for ${req.user._id} (owner: ${user._id})`);
        return Promise.reject(createError(401, 'permission denied'));
      }
      if(Object.keys(req.body).length === 0) {
        return Promise.reject(createError(400, 'Invalid or missing body'));
      }
      for (var attr in User.schema.paths){
        if ((attr !== '_id') && attr !== '__v'){
          if (req.body[attr] !== undefined){
            if(req.body.password) {
              user.password = user.generatePasswordHash(req.body.password);
            }
            user[attr] = req.body[attr];
          }
        }
      }
      user.save()
        .then(user => res.json(user));
    })
    .catch(next);
});

router.delete('/api/user/:id',bearerAuth, function(req, res, next) {
  debug('DELETE /api/user/:id');

  User.findById(req.params.id)
    .then(user => {
      debug('req.body', req.body);
      debug('user', user);
      if (!user) return res.sendStatus(404);
      if(user._id.toString() !== req.user._id.toString()) {
        debug(`permission denied for ${req.user._id} (owner: ${user._id})`);
        return Promise.reject(createError(401, 'permission denied'));
      }
      Promise.all ([
        Character.remove({userId: user._id}).exec(),
        Skills.remove({userId: user._id}).exec(),
        Stats.remove({userId: user._id}).exec(),
        Saves.remove({userId: user._id}).exec(),
        Spells.remove({userId: user._id}).exec(),
        Attacks.remove({userId: user._id}).exec(),
      ]).then(user.remove())
        .then(res.sendStatus(204));
    })
    .catch(next);
});
