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

  if (!req.body.hasOwnProperty('name')){
    next(createError(400));
    res.sendStatus(400);
  }
  createCharacter({
    ...req.body
  })
    .then(character => res.json(character))
    .catch(next);
});
