'use strict';

const Router = require('express');
const jsonParser = require('body-parser').json();
const debug = require('debug')('app:routes/save');

const Character = require('../model/character');
const Save = require('../model/save');

const router = module.exports = new Router();

router.post('/api/:characterId/save',jsonParser,(req,res,next) => {
  debug(`/api/save/${req.params.characterId}`);
  Character.findById(req.params.characterId)
    .then(character => {
      this.character = character;
      return this.character;
    })
    .then(character => {
      Save.createSave(req.body,req.user._id,character._id)
        .then(save => {
          character.saves.push(save._id);
          this.save = save;
          res.json(this);
        });
    })
    .catch(next);
});
