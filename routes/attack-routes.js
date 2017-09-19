'use strict';

const Router = require('express');
const jsonParser = require('body-parser').json();
const debug = require('debug')('app:routes/attack-routes');

const Attack = require('../model/attack');
const Character = require('../model/character');

const router = module.exports = new Router();

router.post('/api/attack:characterId', jsonParser, function (req, res, next) {
  debug('POST /api/attack');

  Character.findbyId(req.params.characterId)
    .then(character => {
      this.character = character;
      return this.character;
    })
    .then(character => {
      Attack.createAttack(req.body, req.user._id, character._id)
        .then(skill => {
          character.attacks.push(skill._id);
          this.skill = skill;
          res.json(this);
        });
    })
    .catch(next);
});
