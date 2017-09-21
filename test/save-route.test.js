'use strict';

const app = require('../server');
const request = require('supertest')(app);
const { expect } = require('chai');
const debug = require('debug')('app:test/save');
require('../lib/mongoose-connect');
const helper = require('./test-helper');
const User = require('../model/user.js');
const Character = require('../model/character.js');
const { createSave } = require('../model/save');

describe('Save Routes',function(){
  beforeEach(function () {
    return User.createUser(helper.user)
      .then(user => this.testUser = user)
      .then(user => user.generateToken())
      .then(token => this.testToken = token);
  });
  beforeEach(function () {
    return User.createUser({ username: 'imposter2', email: 'imposter2@example.com', password: 'hack' })
      .then(hacker => this.hacker = hacker)
      .then(hacker => hacker.generateToken())
      .then(hackerToken => this.hackerToken = hackerToken);
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
  describe('GET /api/save/:id', function () {
    describe('invalid id', function () {
      it('should return 404', function () {
        return request
          .get('/api/save/missing')
          .set({
            'Authorization': `Bearer ${this.testToken}`,
          })
          .expect(404);
      });
    });
    describe('missing id', function () {
      it('should return 404', function () {
        return request
          .get('/api/save/deadcodedeadcodedeadcode')
          .set({
            'Authorization': `Bearer ${this.testToken}`,
          })
          .expect(404);
      });
    });
    describe('valid id', function () {
      beforeEach(function(){
        helper.save.characterId = this.character._id;
        helper.save.userId = this.testUser._id;
        return createSave(helper.save)
          .then(save => this.testSave = save);
      });
      afterEach(function() {
        return helper.kill();
      });
      it('should return a save', function () {
        return request
          .get(`/api/save/${this.testSave._id}`)
          .set({
            'Authorization': `Bearer ${this.testToken}`,
          })
          .expect(200)
          .expect(res => {
            expect(res.body.type).to.equal(helper.save.type);
            expect(res.body).to.have.property('stat', helper.save.stat);
          });
      });
      describe(`someone else's save`, function () {
        beforeEach(function () {
          return User.createUser({ username: 'imposter2', email: 'imposter2@example.com', password: 'hack' })
            .then(hacker => this.hacker = hacker)
            .then(hacker => hacker.generateToken())
            .then(hackerToken => this.hackerToken = hackerToken);
        });
        it('should return 401', function () {
          return request
            .get(`/api/save/${this.testSave._id}`)
            .set({
              Authorization: `Bearer ${this.hackerToken}`,
            })
            .expect(401);
        });
      });
    });
  });
  describe.only('PUT and DELETE: ',function(){
    beforeEach(function(){
      helper.save.characterId = this.character._id;
      helper.save.userId = this.testUser._id;
      return createSave(helper.save)
        .then(save => this.testSave = save);
    });
    afterEach(function() {
      return helper.kill();
    });
    describe('PUT /api/save/:id',function(){
      it('should return an updated save',function(){
        return request.put(`/api/save/${this.testSave._id}`)
          .set({ Authorization: `Bearer ${this.testToken}`})
          .send({ type: 'newType'})
          .expect(200)
          .expect(res => {
            expect(res.body.type).to.equal('newType');
            expect(res.body.bonus).to.equal(this.testSave.bonus);
          });
      });
      it('should return 400 for an invalid body',function(){
        return request.put(`/api/save/${this.testSave._id}`)
          .set({ Authorization: `Bearer ${this.testToken}`})
          .send()
          .expect(400);
      });
      it('should return 401 for invalid user',function(){
        return request.put(`/api/save/${this.testSave._id}`)
          .set({ Authorization: `Bearer ${this.hackerToken}`})
          .send({ type: 'newType'})
          .expect(401);
      });
      it('should return 404 for invalid save is not found',function(){
        return request.put(`/api/save/deadcodedeadcodedeadcode`)
          .set({ Authorization: `Bearer ${this.hackerToken}`})
          .send({ type: 'newType'})
          .expect(404);
      });
    });
  });
});
