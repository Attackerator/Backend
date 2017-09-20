'use strict';

const Router = require('express');
const jsonParser = require('body-parser').json();
const debug = require('debug')('app:routes/character');
const createError = require('http-errors');

const Character = require('../model/character');

const router = module.exports = new Router();


router.get('/api/character/:id', (req,res,next) =>{
  debug(`GET /api/character/${req.params.id}`);

  Character.findById(req.params.id)
    .populate('stats')
    .populate('skills')
    .populate('spells')
    .populate('saves')
    .populate('attacks')
    .then(character => {
      if (!character)
        return res.sendStatus(404);

      if (character.userId.toString() !== req.user._id.toString()) {
        debug(`permission denied for ${req.user._id} (owner: ${character.userID})`);
        return next(createError(401, 'permission denied'));
      }

      res.json(character);
    })
    .catch(next);
});

router.post('/api/character',jsonParser,(req,res,next) => {
  debug(`POST /api/character`);
  req.body.userId = req.user._id;
  return Character.createCharacter({
    ...req.body
  })
    .then(character => res.json(character))
    .catch(next);
});
