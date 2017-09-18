'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('app:route/stats');

const Stats = require('../model/stats');

const router = module.exports = new Router();

router.post('api/stats', jsonParser, function (req, res, next) {
  debug('POST /api/stats');
  Stats.createStats(req.body)
    .then(stat => res.json(stat))
    .catch(next);
});
