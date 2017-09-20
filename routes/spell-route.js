'use strict';

const Router = require('express');
const jsonParser = require('body-parser').json();
const debug = require('debug')('app:routes/spell');

const Character = require('../model/character');
const Spell = require('../model/spells');
const createError = require('http-errors');

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

router.get('/api/save/:id', (req, res, next) => {
  debug(`GET /api/save/${req.params.id}`);

  Spell.findById(req.params.id)
    .then(spell => {
      if (spell.userID.toString() !== req.user._id.toString()) {
        debug(`permission denied for ${req.user._id} (owner: ${spell.userID})`);
        return next(createError(401, 'permission denied'));
      }
      res.json(spell);
    })
    .catch(next);
});
