'use strict';

const Router = require('express');
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const Skill = require('../model/skills');
const Character = require('../model/character');
const debug = require('debug')('app:routes/skill');

const router = module.exports = new Router();

router.post('/api/skill/:characterId',jsonParser,(req,res,next) => {
  req.body.userId = req.user._id;
  req.body.characterId = req.params.characterId;
  debug(`/api/skill/${req.params.characterId}`);
  Character.findById(req.params.characterId)
    .then(character => {
      return Skill.createSkill(req.body)
        .then(skill => {
          debug(skill);
          character.skills.push(skill._id);
          res.json(skill);
          character.save();
        });
    })
    .catch(next);
});

router.get('/api/skill/:skillId',function(req,res,next){
  debug(`/api/skill/${req.params.skillId}`);

  return Skill.findById(req.params.skillId)
    .then(skill => {
      if (skill.userId.toString() !== req.user._id.toString()) {
        debug(`permission denied for ${req.user._id} (owner: ${skill.userId})`);
        return next(createError(401, 'permission denied'));
      }
      debug(skill);
      return res.json(skill);
    });
});

router.put('/api/skill/:skillId',jsonParser,function(req,res,next){
  debug(`/api/skill/${req.params.skillId}`);
  debug(req.body);
  return Skill.findByIdAndUpdate(req.params.skillId,req.body,{ new: true })
    .then(updatedSkill => {
      if (updatedSkill.userId.toString() !== req.user._id.toString()) {
        debug(`permission denied for ${req.user._id} (owner: ${updatedSkill.userId})`);
        return Promise.reject(createError(401, 'permission denied'));
      }
      debug(updatedSkill);
      res.json(updatedSkill);
    })
    .catch(next);
});

router.delete(`/api/skill/:skillId`,function(req,res,next){
  debug(`/api/skill/${req.params.skillId}`);

  return Skill.findByIdAndRemove(req.params.skillId)
    .then(skill => {
      debug('deleted',skill);
      res.json(skill);
    })
    .catch(result => {
      next(createError(400, 'Delete failed'));
      debug(result);
    });
});
