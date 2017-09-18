'use strict';

const jsonParser = require('body-parser').json();
const debug = require('debug')('app:route/auth');
const Router = require('express').Router;

const basicAuth = require('../lib/basic-auth-middleware');

const User = require('../model/user');

const router = module.exports = new Router();
