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

userSchema.methods.comparePasswordHash = function (password){
  debug('comparePasswordHash');
  return new Promise((resolve,reject) => {
    bcrypt.compare(password, this.password, (err,valid) => {
      if(err) return reject(err);
      if(!valid) return reject(createError(401, 'username/password mismatch'));
      resolve(this);
    });
  });
};

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

userSchema.methods.generateFindHash = function (){
  debug('generateFindHash');
  return new Promise((resolve, reject) => {
    this.findHash = crypto.randomBytes(32).toString('hex');
    this.save()
      .then(() => resolve(this))
      .catch(err => {
        return reject(err);
      });
  });
};

userSchema.methods.generateToken = function (){
  debug('generateToken');
  return new Promise ((resolve, reject) =>{
    this.generateFindHash()
      .then(obj => resolve(jwt.sign({token: obj.findHash }, process.env.APP_SECRET)))
      .catch(reject);
  });
};

const User = module.exports = mongoose.models.user || mongoose.model('user', userSchema);

User.createUser = function(body) {
  debug('createUser', body);

  const { password, ..._user } = body;
  return new User(_user)
    .generatePasswordHash(password)
    .then(user => {
      console.log(user);
      return user;
    })
    .then(user => user.save());

};
