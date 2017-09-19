'use strict';

const app = require('../server');
const request = require('supertest')(app);
const { expect } = require('chai');
const debug = require('debug')('app:test/save');
require('../lib/mongoose-connect');
const helper = require('./test-helper');
const User = require('../model/user.js');
const Character = require('../model/character.js');

describe('Save Routes',function(){
  beforeEach(function () {
    return User.createUser(helper.user)
      .then(user => this.testUser = user)
      .then(user => user.generateToken())
      .then(token => this.testToken = token);
  });
  beforeEach(function () {
    Character.createCharacter(helper.character)
      .then(character => {
        this.character = character;
        return this.character;
      });
  });
  afterEach(function(){
    return helper.kill();
  });
  describe('POST /api/save',function(){
    it('should return 200 if it saves a new save',function(){
      return request.post(`/api/${this.character._id}/save`)
        .send(helper.save)
        .set({'Authorization': `Bearer ${this.testToken}`})
        .expect(200)
        .expect(res => {
          debug(res.body.name);
          expect(res.body.name).to.equal('Donkey Fart');
          expect(res.body.description).to.not.be.null;
        });
    });
    it('should return 400 if no body is provided',function(){
      return request.post(`/api/${this.character._id}/save`)
        .send()
        .set({'Authorization': `Bearer ${this.testToken}`})
        .expect(400);
    });
  });
});
