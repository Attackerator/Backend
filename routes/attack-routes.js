'use strict';

const Router = require('express');
const jsonParser = require('body-parser').json();
const debug = require('debug')('app:routes/attack-routes');

const Attack = require('../model/attack');

const router = module.exports = new Router();

router.post('/api/attack', jsonParser, function (req, res, next) {
  debug('POST /api/attack');
  Attack.createAttack(req.body)
  .then(attack => res.json(attack))
  .catch(next);
});
