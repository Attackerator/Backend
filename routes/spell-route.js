'use strict';

const Router = require('express');
const jsonParser = require('body-parser').json();
const debug = require('debug')('app:routes/spell');

const Character = require('../model/character');
const Spell = require('../model/spells');

const router = module.exports = new Router();

router.post('/api/spell/:characterId',jsonParser,(req,res,next) => {
  debug(`/api/spell/${req.params.characterId}`);
  Character.findById(req.params.characterId)
    .then(character => {
      req.body.characterId = character._id;
      req.body.userId = req.user._id;
      return Spell.createSpell(req.body)
        .then(spell => {
          character.spells.push(spell._id);
          character.save();
          res.json(spell);
        });
    })
    .catch(next);
});
