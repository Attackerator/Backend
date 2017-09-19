'use strict';

const Router = require('express');
const jsonParser = require('body-parser').json();
const debug = require('debug')('app:routes/spell');


const { createSpell } = require('../model/spells');

const router = module.exports = new Router();

router.post('/api/spell:characterID',jsonParser,(req,res,next) => {
  debug(`POST /api/spell/${req.params.id}`);
  debug(req.body);

  createSpell({
    ...req.body,
    characterId: req.character._id
  })
    .then(spell => res.json(spell))
    .catch(next);
});
