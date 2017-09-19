'use strict';

const Router = require('express');
const jsonParser = require('body-parser').json();
const debug = require('debug')('app:routes/stats-routes');

const Stats = require('../model/stats');
const Character = require('../model/character');

const router = module.exports = new Router();

router.post('/api/stats:characterId', jsonParser, function (req, res, next) {
  debug('POST /api/stats');

  Character.findbyId(req.params.characterId)
    .then(character => {
      this.character = character;
      return this.character;
    })
    .then(character => {
      Stats.createstats(req.body, req.user._id, character._id)
        .then(stats => {
          character.stats.push(stats._id);
          this.stats = stats;
          res.json(this);
        });
    })
    .catch(next);
});
