'use strict';

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mongoose = require('mongoose');
const createError = require('http-errors');
const debug = require('debug')('app:model/user');
const jwt = require('jsonwebtoken');

const Schema = mongoose.Schema;

const userSchema = Schema({
  username: {type: String,required: true, unique: true}
  ,email: {type: String, required: true, unique: true}
  ,password: {type: String}
  ,findHash: {type: String, unique: true}
});

userSchema.methods.generatePasswordHash = function (password){
  debug('generatePasswordHash');
  return new Promise ((resolve,reject) => {
    if(!password){
      return reject(createError(400, 'password required'));
    }
    bcrypt.hash(password,10,(err,hash) => {
      if (err) return reject(err);
      this.password = hash;
      return resolve(this);
    });
  });
};

module.exports = mongoose.models.user || mongoose.model('user', userSchema);
