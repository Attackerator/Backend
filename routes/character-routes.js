'use strict';

const Router = require('express');
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('app:routes/character');

const { createCharacter } = require('../model/character');

const router = module.exports = new Router();

router.post('/api/character',jsonParser,(req,res,next) => {
  debug(`POST /api/character`);
/*
  createCharacter({
    ...req.body,
    user: req.user._id
  })
    .save()
    .then(character => res.json(character))
    .catch(next);

    */
});
