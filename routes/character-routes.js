'use strict';

const Router = require('express');
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('app:routes/character');

const { createCharacter } = require('../model/character');

const router = module.exports = new Router();

router.post('/api/character',jsonParser,(req,res,next) => {
  debug(`POST /api/character`);
  debug(req.body);

  if (!req.body.hasOwnProperty('name')) res.sendStatus(401);

  createCharacter({
    ...req.body
  })
    .save()
    .then(character => res.json(character))
    .catch(next);
});
