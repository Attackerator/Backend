'use strict';

const Router = require('express');
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('app:routes/spell');

const { createSpell } = require('../model/spells');

const router = module.exports = new Router();

router.post('/api/spell',jsonParser,(req,res,next) => {
  debug(`POST /api/spell`);
  debug(req.body);

  if (!req.body.hasOwnProperty('name')){
    return next(createError(400, 'name required'));
  }
  createSpell({
    ...req.body
  })
    .then(spell => res.json(spell))
    .catch(next);
});
