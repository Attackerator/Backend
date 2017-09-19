'use strict';

const Router = require('express');
const jsonParser = require('body-parser').json();
const debug = require('debug')('app:routes/spell');

const Character = require('../model/character');
const Spell = require('../model/spells');

const router = module.exports = new Router();

router.post('/api/:characterId/spell',jsonParser,(req,res,next) => {
  debug(`/api/${req.params.characterId}/spell`);
  Character.findById(req.params.characterId)
    .then(character => {
      this.character = character;
      return this.character;
    })
    .then(character => {
      Spell.createSpell(req.body,req.userId._id,req.characterId._id)
        .then(spell => {
          character.spells.push(spell._id);
          this.spell = spell;
          res.json(this);
        });
    })
    .catch(next);
});
