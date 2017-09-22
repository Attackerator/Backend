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
        return Promise.reject(createError(401, 'permission denied'));
      }
      debug(skill);
      return res.json(skill);
    })
    .catch(next);
});

router.put('/api/skill/:skillId',jsonParser,function(req,res,next){
  debug(`/api/skill/${req.params.skillId}`);
  debug(req.body);
  return Skill.findById(req.params.skillId)
    .then(skill => {
      if(!skill) return res.sendStatus(404);
      if (skill.userId.toString() !== req.user._id.toString()) {
        debug(`permission denied for ${req.user._id} (owner: ${skill.userId})`);
        return Promise.reject(createError(401, 'permission denied'));
      }
      if(Object.keys(req.body).length === 0) return Promise.reject(createError(400, 'Invalid or missing body'));

      for (var attr in Skill.schema.paths){
        if((attr !== '_id') && (attr !== '__v')){
          if (req.body[attr] !== undefined)
            skill[attr] = req.body[attr];
        }
      }
      skill.save()
        .then(skill => {
          debug(skill);
          res.json(skill);
        });
    })
    .catch(next);
});

router.delete(`/api/skill/:skillId`,function(req,res,next){
  debug(`/api/skill/${req.params.skillId}`);

  return Skill.findById(req.params.skillId)
    .then(skill => {
      if(!skill) return Promise.reject(createError(404, 'Skill not found'));

      if(req.user._id.toString() !== skill.userId.toString())
        return Promise.reject(createError(401,'Invalid userId'));

      Character.findByIdAndUpdate(skill.characterId,{ $pull: { skills: skill._id }},{ new: true })
        .then(character => {
          debug(character);
          skill.remove({});
          res.sendStatus(204);
        });
    })
    .catch(next);
});
