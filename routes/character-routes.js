'use strict';

const Router = require('express');
const jsonParser = require('body-parser').json();
const debug = require('debug')('app:routes/character');
const createError = require('http-errors');

const Character = require('../model/character');
const Stats = require('../model/stats');
const Attacks = require('../model/attack');
const Spells = require('../model/spells');
const Skills = require('../model/skills');
const Saves = require('../model/save');

const router = module.exports = new Router();


router.get('/api/character/:id', (req,res,next) =>{
  debug(`GET /api/character/${req.params.id}`);

  Character.findById(req.params.id)
    .populate('stats')
    .populate('skills')
    .populate('spells')
    .populate('saves')
    .populate('attack')
    .then(character => {
      debug(character);
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

router.get('/api/characters',(req,res,next) => {
  debug('/api/characters with userId: ',req.user._id);

  Character.find({userId: req.user._id})
    .then(characters => {
      let responseArray = characters.map(character => {
        return {name: character.name, userId: character.userId};
      });
      debug(responseArray);
      res.json(responseArray);
    })
    .catch(next);
});

router.post('/api/character',jsonParser,(req,res,next) => {
  debug(`POST /api/character`);
  req.body.userId = req.user._id;
  Character.createCharacter({
    ...req.body
  })
    .then(character => res.json(character))
    .catch(next);
});

router.put('/api/character/:id', jsonParser, function(req, res, next) {
  debug('PUT /api/character/:id');

  Character.findById(req.params.id)
    .then(character => {
      debug('req.body', req.body);
      debug('character', character);
      if(character.userId.toString() !== req.user._id.toString()) {
        debug(`permission denied for ${req.user._id} (owner: ${character.userId})`);
        return Promise.reject(createError(401, 'permission denied'));
      }
      if(Object.keys(req.body).length === 0) {
        return Promise.reject(createError(400, 'Invalid or missing body'));
      }
      for (var attr in Character.schema.paths){
        if ((attr !== '_id') && attr !== '__v'){
          if (req.body[attr] !== undefined){
            character[attr] = req.body[attr];
          }
        }
      }
      character.save()
        .then(character => res.json(character));
    })
    .catch(next);
});

router.delete('/api/character/:id', jsonParser, function(req, res, next) {
  debug('DELETE /api/character/:id');

  Character.findById(req.params.id)
    .then(character => {
      debug('req.body', req.body);
      debug('character', character);
      if (!character) return res.sendStatus(404);
      if(character.userId.toString() !== req.user._id.toString()) {
        debug(`permission denied for ${req.user._id} (owner: ${character.userId})`);
        return Promise.reject(createError(401, 'permission denied'));
      }
      Promise.all ([
        Skills.remove({characterId: character._id}).exec(),
        Stats.remove({characterId: character._id}).exec(),
        Saves.remove({characterId: character._id}).exec(),
        Spells.remove({characterId: character._id}).exec(),
        Attacks.remove({characterId: character._id}).exec(),
      ]).then(character.remove())
        .then(res.sendStatus(204));
    })
    .catch(next);
});
