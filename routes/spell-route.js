'use strict';

const Router = require('express');
const jsonParser = require('body-parser').json();
const debug = require('debug')('app:routes/spell');

const { createSpell } = require('../model/spells');

const router = module.exports = new Router();

router.post('/api/spell',jsonParser,(req,res,next) => {
  debug(`POST /api/spell`);
  debug(req.body);

  createSpell({
    ...req.body
  })
    .then(spell => res.json(spell))
    .catch(next);
});
