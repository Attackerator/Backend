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
