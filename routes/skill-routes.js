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
      return Skill.createSkill(req.body,req.user._id,character._id)
        .then(skill => {
          debug(skill);
          character.skills.push(skill._id);
          res.json(skill);
          return character.skills;
        })
        .then(skills => {
          Character.findByIdAndUpdate(req.params.characterId,{ skills },{ runValidators: true});
        });
    })
    .catch(next);
});
/*
router.get('/api/:characterId/skills',function(req,res,next){
  debug(`/api/${req.params.characterId}/skills`);

  Character.findById(req.params.characterId)
    .then(character => {
      debug(character);
      let skills = character.skills.map(skill => {
        let skillObj = Skill.findById(skill._id).populate();
        debug(skillObj);
        return skillObj;
      });
      res.json(skills);
    })
    .catch(next);
});
*/
