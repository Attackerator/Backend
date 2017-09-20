'use strict';

const app = require('../server');
const request = require('supertest')(app);
const { expect } = require('chai');
const debug = require('debug')('app:test/spell');
require('../lib/mongoose-connect');
const helper = require('./test-helper');
const User = require('../model/user.js');
const Character = require('../model/character.js');

describe('Spell Routes',function(){
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
  describe('POST /api/spell',function(){
    it('should return 200 if it saves a new spell',function(){
      return request.post(`/api/spell/${this.character._id}`)
        .send(helper.spell)
        .set({'Authorization': `Bearer ${this.testToken}`})
        .expect(200)
        .expect(res => {
          debug(res.body.name);
          expect(res.body.name).to.equal('Donkey Fart');
          expect(res.body.description).to.not.be.null;
        });
    });
    it('should return 400 if no body is provided',function(){
      return request.post(`/api/spell/${this.character._id}`)
        .send()
        .set({'Authorization': `Bearer ${this.testToken}`})
        .expect(400);
    });
  });
  describe('Routes',function(){
    describe('POST /api/spell',function(){
      it('should return a saved spell',function(){
        return request.post(`/api/spell/${this.character._id}`)
          .set({Authorization: `Bearer ${this.testToken}`})
          .send(helper.spell)
          .expect(200)
          .expect(saved => {
            expect(saved.body.name).to.equal('Donkey Fart');
            expect(saved.body.damageBonus).to.deep.equal(7);
            expect(saved.body.stat).to.equal('wisdom');
          });
      });
    });
  });
});
