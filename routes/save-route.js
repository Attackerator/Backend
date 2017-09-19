'use strict';

const Router = require('express');
const jsonParser = require('body-parser').json();
const debug = require('debug')('app:routes/save');

const Character = require('../model/character');
const Save = require('../model/save');

const router = module.exports = new Router();

router.post('/api/save/:characterId',jsonParser,(req,res,next) => {
  debug(`/api/save/${req.params.characterId}`);
  debug(req.body);

  Character.findById(req.params.characterId)
    .then(character => {
      req.body.characterId = character._id;
      req.body.userId = req.user._id;
      return Save.createSave(req.body)
        .then(save => {
          character.saves.push(save._id);
          res.json(save);
        });
    })
    .catch(next);
});
