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
        return next(createError(401, 'permission denied'));
      }
      res.json(attack);
    })
    .catch(next);
});
