'use strict';

const app = require('../server');
const request = require('supertest')(app);
const { expect } = require('chai');
const debug = require('debug')('app:test/spell');
require('../lib/mongoose-connect');
const helper = require('./test-helper');
const User = require('../model/user.js');
const Character = require('../model/character.js');
const { createSpell } = require('../model/spells');

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
  describe('GET /api/spell/:id', function () {
    describe('invalid id', function () {
      it('should return 404', function () {
        return request
          .get('/api/spell/missing')
          .set({
            'Authorization': `Bearer ${this.testToken}`,
          })
          .expect(404);
      });
    });
    describe('missing id', function () {
      it('should return 404', function () {
        return request
          .get('/api/spell/deadcodedeadcodedeadcode')
          .set({
            'Authorization': `Bearer ${this.testToken}`,
          })
          .expect(404);
      });
    });
    describe('valid id', function () {
      beforeEach(function(){
        helper.spell.characterId = this.character._id;
        helper.spell.userId = this.testUser._id;
        return createSpell(helper.spell)
          .then(spell => this.testSpell = spell);
      });
      afterEach(function() {
        return helper.kill();
      });
      it('should return a spell', function () {
        return request
          .get(`/api/spell/${this.testSpell._id}`)
          .set({
            'Authorization': `Bearer ${this.testToken}`,
          })
          .expect(200)
          .expect(res => {
            expect(res.body.name).to.equal(helper.spell.name);
            expect(res.body).to.have.property('stat', helper.spell.stat);
          });
      });
      describe(`someone else's spell`, function () {
        beforeEach(function () {
          return User.createUser({ username: 'imposter2', email: 'imposter2@example.com', password: 'hack' })
            .then(hacker => this.hacker = hacker)
            .then(hacker => hacker.generateToken())
            .then(hackerToken => this.hackerToken = hackerToken);
        });
        it('should return 401', function () {
          return request
            .get(`/api/spell/${this.testSpell._id}`)
            .set({
              Authorization: `Bearer ${this.hackerToken}`,
            })
            .expect(401);
        });
      });
    });
  });
  describe.only('PUT /api/spell/:id',function(){
    beforeEach(function(){
      helper.spell.characterId = this.character._id;
      helper.spell.userId = this.testUser._id;
      return createSpell(helper.spell)
        .then(spell => this.testSpell = spell);
    });
    afterEach(function() {
      return helper.kill();
    });
    it('should return the updated spell',function(){
      return request.put(`/api/spell/${this.testSpell._id}`)
        .set({
          'Authorization': `Bearer ${this.testToken}`,
        })
        .send({
          name: 'updatedSpell',
          stat: 'strength'
        })
        .expect(200)
        .expect(res => {
          expect(res.body.name).to.equal('updatedSpell');
          expect(res.body.stat).to.equal('strength');
        });
    });
  });
});
