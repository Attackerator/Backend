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
    return Character.createCharacter(helper.character)
      .then(character => {
        this.character = character;
        debug(this.character._id);
        return this.character;
      });
  });
  afterEach(function(){
    return helper.kill();
  });
  describe('POST /api/save',function(){
    it('should return 200 if it saves a new save',function(){
      debug(this.character._id);
      debug(helper.save);
      return request.post(`/api/save/${this.character._id}`)
        .set({'Authorization': `Bearer ${this.testToken}`})
        .send(helper.save)
        .expect(200)
        .expect(res => {
          debug(res.body.type);
          expect(res.body.type).to.equal('fortitude');
          expect(res.body.stat).to.equal('constitution');
        });
    });
    it('should return 400 if no body is provided',function(){
      return request.post(`/api/save/${this.character._id}`)
        .set({'Authorization': `Bearer ${this.testToken}`})
        .expect(400);
    });
  });
});
