'use strict';

const Router = require('express');
const jsonParser = require('body-parser').json();
const debug = require('debug')('app:routes/stats-routes');

const Stats = require('../model/stats');
const Character = require('../model/character');

const router = module.exports = new Router();

router.post('/api/stats/:characterId', jsonParser, function (req, res, next) {
  debug('POST /api/stats/:characterId');

  Character.findById(req.params.characterId)
    .then(character => {
      debug(character);
      return Stats.createStats(req.body, req.user._id, character._id)
        .then(stats => {
          debug(stats);
          character.stats.push(stats._id);
          res.json(stats);
          return character.stats;
        })
        .then(stats => {
          Character.findbyIdAndUpdate(req.params.characterId, { stats },{ runValidators: true});
        });
    })
    .catch(next);
});
