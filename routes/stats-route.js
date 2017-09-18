'use strict';

const Router = require('express');
const jsonParser = require('body-parser').json();
const debug = require('debug')('app:routes/stats-route');

const Stats = require('../model/stats');

const router = module.exports = new Router();

router.post('/api/stats', jsonParser, function (req, res, next) {
  debug('POST /api/stats');
  Stats.createStats(req.body)
    .save()
    .then(stat => res.json(stat))
    .catch(next);
});
