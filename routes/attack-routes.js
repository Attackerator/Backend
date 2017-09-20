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
      return Attack.createAttack(req.body, req.user._id, character._id)
        .then(attack => {
          debug(attack);
          character.attack.push(attack._id);
          res.json(attack);
          return character.attacks;
        })
        .then(skills => {
          Character.findbyIdAndUpdate(req.params.characterId, { skills}, { runValidators: true});
        });
    })
    .catch(next);
});
