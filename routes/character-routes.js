'use strict';

const Router = require('express');
const jsonParser = require('body-parser').json();
const debug = require('debug')('app:routes/character');

const { createCharacter } = require('../model/character');

const router = module.exports = new Router();

router.post('/api/character',jsonParser,(req,res,next) => {
  debug(`POST /api/character`);
  req.body.userId = req.user._id;
  return createCharacter(req.body)
    .then(character => res.json(character))
    .catch(next);
});
