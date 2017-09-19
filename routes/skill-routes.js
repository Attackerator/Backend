'use strict';

const Router = require('express');
const jsonParser = require('body-parser').json();
const Skill = require('../model/skills');
const Character = require('../model/character');
const debug = require('debug')('app:routes/skill');

const router = module.exports = new Router();

router.post('/api/:characterId/skill',jsonParser,(req,res,next) => {
  debug(`/api/skill/${req.params.characterId}`);

  Character.findById(req.params.characterId)
    .then(character => {
      Skill.createSkill(req.body,req.user._id,character._id)
        .then(skill => {
          debug(skill);
          character.skills.push(skill._id);
          res.json(skill);
        });
    })
    .catch(next);
});
