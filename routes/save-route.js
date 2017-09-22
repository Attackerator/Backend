'use strict';

const Router = require('express');
const jsonParser = require('body-parser').json();
const debug = require('debug')('app:routes/save');

const Character = require('../model/character');
const Save = require('../model/save');
const createError = require('http-errors');

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
          character.save();
          res.json(save);
        });
    })
    .catch(next);
});

router.get('/api/save/:id', (req, res, next) => {
  debug(`GET /api/save/${req.params.id}`);

  Save.findById(req.params.id)
    .then(save => {
      if (save.userId.toString() !== req.user._id.toString()) {
        debug(`permission denied for ${req.user._id} (owner: ${save.userID})`);
        return Promise.reject(createError(401, 'permission denied'));
      }
      res.json(save);
    })
    .catch(next);
});

router.put(`/api/save/:id`,jsonParser,(req,res,next) => {
  debug(`PUT /api/save/${req.params.id}`);

  Save.findById(req.params.id)
    .then(save => {
      debug('HITTING HERE',save);
      if (!save) return Promise.reject(createError(404,'Save not found'));

      if (save.userId.toString() !== req.user._id.toString()) {
        debug(`permission denied for ${req.user._id} (owner: ${save.userID})`);
        return Promise.reject(createError(401, 'permission denied'));
      }
      if (Object.keys(req.body).length === 0)
        return Promise.reject(createError(400, 'Invalid or missing body'));

      for (var attr in Save.schema.paths){
        debug(attr);
        if ((attr !== '_id') && attr !== '__v'){
          if (req.body[attr] !== undefined){
            save[attr] = req.body[attr];
          }
        }
      }
      save.save()
        .then(save => res.json(save));
    })
    .catch(next);
});

router.delete(`/api/save/:id`,function(req,res,next){
  debug(`/api/save/${req.params.id}`);

  Save.findById(req.params.id)
    .then(save => {
      if (!save) return Promise.reject(createError(404, 'Save not found'));

      if (save.userId.toString() !== req.user._id.toString()) {
        debug(`permission denied for ${req.user._id} (owner: ${save.userID})`);
        return Promise.reject(createError(401, 'permission denied'));
      }
      Character.findByIdAndUpdate(save.characterId,{ $pull: {saves: save._id}},{new: true})
        .then(character => {
          debug(character);
          save.remove({});
          res.sendStatus(204);
        });
    })
    .catch(next);
});
