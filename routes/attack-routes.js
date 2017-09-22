'use strict';

const Router = require('express');
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('app:routes/attack-routes');

const Attack = require('../model/attack');
const Character = require('../model/character');

const router = module.exports = new Router();

router.post('/api/attack/:characterId', jsonParser, function (req, res, next) {
  debug('POST /api/attack/:characterId');

  Character.findById(req.params.characterId)
    .then(character => {
      debug(character);
      req.body.characterId = character._id;
      req.body.userId = req.user._id;
      return Attack.createAttack(req.body)
        .then(attack => {
          debug(attack);
          character.attack.push(attack._id);
          character.save();
          res.json(attack);
        });
    })
    .catch(next);
});

router.get('/api/attack/:id', jsonParser, function(req, res, next) {
  debug('GET /api/attack/:id');

  Attack.findById(req.params.id)
    .then(attack => {
      if(attack.userId.toString() !== req.user._id.toString()) {
        debug(`permission denied for ${req.user._id} (ower: ${attack.userId})`);
        return Promise.reject(createError(401, 'permission denied'));
      }
      res.json(attack);
    })
    .catch(next);
});

router.put('/api/attack/:id', jsonParser, function(req, res, next) {
  debug('PUT /api/attack/:id');

  Attack.findById(req.params.id)
    .then(attack => {
      debug('req.body', req.body);
      debug('stats', attack);
      if(attack.userId.toString() !== req.user._id.toString()) {
        debug(`permission denied for ${req.user._id} (owner: ${attack.userId})`);
        return Promise.reject(createError(401, 'permission denied'));
      }
      if(Object.keys(req.body).length === 0) {
        return Promise.reject(createError(400, 'Invalid or missing body'));
      }
      for (var attr in Attack.schema.paths){
        if ((attr !== '_id') && attr !== '__v'){
          if (req.body[attr] !== undefined){
            attack[attr] = req.body[attr];
          }
        }
      }
      attack.save()
        .then(attack => res.json(attack));
    })
    .catch(next);
});

router.delete(`/api/attack/:id`,function(req,res,next){
  debug(`/api/attack/${req.params.id}`);
  Attack.findById(req.params.id)
    .then(attack => {
      debug(attack);
      if (!attack) return res.sendStatus(404);
      if (attack.userId.toString() !== req.user._id.toString()) {
        debug(`permission denied for ${req.user._id} (owner: ${attack.userID})`);
        return Promise.reject(createError(401, 'permission denied'));
      }
      return Character.findByIdAndUpdate(attack.characterId,{ $pull: {attack: attack._id}},{ new: true })
        .then(character=> {
          debug(character);
          attack.remove({});
          res.sendStatus(204);
        });
    })
    .catch(next);
});
