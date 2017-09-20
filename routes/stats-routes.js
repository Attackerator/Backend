'use strict';

const Router = require('express');
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('app:routes/stats-routes');

const Stats = require('../model/stats');
const Character = require('../model/character');

const router = module.exports = new Router();

router.post('/api/stats/:characterId', jsonParser, function (req, res, next) {
  debug('POST /api/stats/:characterId');

  Character.findById(req.params.characterId)
    .then(character => {
      debug(character);
      req.body.userId = req.user._id;
      req.body.characterId = req.params.characterId;
      return Stats.createStats(req.body)
        .then(stats => {
          debug(stats);
          character.stats.push(stats._id);
          character.save();
          res.json(stats);
        });
    })
    .catch(next);
});

router.get('/api/stats/:id', jsonParser, function(req, res, next) {
  debug('GET /api/stats/:id');

  Stats.findById(req.params.id)
    .then(stats => {
      if(stats.userId.toString() !== req.user._id.toString()) {
        debug(`permission denied for ${req.user._id} (owner: ${stats.userId})`);
        return next(createError(401, 'permission denied'));
      }
      res.json(stats);
    })
    .catch(next);
});
