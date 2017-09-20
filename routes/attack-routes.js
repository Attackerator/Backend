'use strict';

const Router = require('express');
const jsonParser = require('body-parser').json();
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
          character.save;
          res.json(attack);
        });
    })
    .catch(next);
});
