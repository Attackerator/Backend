'use strict';

const app = require('../server');
const request = require('supertest')(app);
const { expect } = require('chai');
const debug = require('debug')('app:test/stats-routes');

require('../lib/mongoose-connect');
const helper = require('./test-helper');
const User = require('../model/user');
const Character = require('../model/character');
const Stats = require('../model/stats');

const exampleStats = {
  strength: 8,
  dexterity: 8,
  constitution: 8,
  intelligence: 8,
  charisma: 8,
  wisdom: 8,
};

describe('stats routes', function() {
  beforeEach(function () {
    return User.createUser(helper.user)
      .then(user => this.testUser = user)
      .then(user => user.generateToken())
      .then(token => this.testToken = token);
  });
  beforeEach(function(){
    return User.createUser(helper.hacker)
      .then(hacker => this.hacker = hacker)
      .then(hacker => hacker.generateToken())
      .then(token => this.hackerToken = token);
  });
  beforeEach(function () {
    helper.character.userId = this.testUser._id;
    return Character.createCharacter(helper.character)
      .then(character => {
        this.testCharacter = character;
      });
  });
  describe('POST /api/stats', function() {
    describe('with a valid body', function() {

      afterEach(function () {
        return helper.kill();
      });

      it('should return stats', function () {
        return request
          .post(`/api/stats/${this.testCharacter._id}`)
          .set({'Authorization': `Bearer ${this.testToken}`})
          .send({ strength: 3})
          .expect(200)
          .expect(res => {
            expect(res.body.strength).to.equal(3);
          });
      });
    });
  });

  describe('GET /api/stats/:id', function() {
    beforeEach(function() {
      exampleStats.userId = this.testUser._id;
      exampleStats.characterId = this.testCharacter._id;
      return Stats.createStats(exampleStats)
        .then(stats => this.testStats = stats)
        .then(updatedStats => {
          return Character.findByIdAndUpdate(this.testCharacter._id,{$push: {stats: updatedStats}},{new: true});
        })
        .then(character => debug(character));
    });
    afterEach(function() {
      delete this.testStats;

      return helper.kill();
    });

    it('should return a stat', function() {
      return request
        .get(`/api/stats/${this.testStats._id}`)
        .set({Authorization: `Bearer ${this.testToken}`})
        .expect(200)
        .expect(res => {
          expect(res.body.strength).to.deep.equal(8);
        });
    });

    it('should return 401 for invalid user',function() {
      return request
        .get(`/api/stats/${this.testStats._id}`)
        .set({Authorization: `Bearer ${this.hackerToken}`})
        .expect(401);
    });
  });
  describe('PUT /api/stats/:id', function() {
    beforeEach(function() {
      exampleStats.userId = this.testUser._id;
      exampleStats.characterId = this.testCharacter._id;
      return Stats.createStats(exampleStats)
        .then(stats => this.testStats = stats)
        .then(updatedStats => {
          return Character.findByIdAndUpdate(this.testCharacter._id,{$push: {stats: updatedStats}},{new: true});
        })
        .then(character => debug(character));
    });
    afterEach(function() {
      delete this.testStats;

      return helper.kill();
    });

    it('should return updated stats', function() {
      return request
        .put(`/api/stats/${this.testStats._id}`)
        .set({Authorization: `Bearer ${this.testToken}`})
        .send({
          strength: 3,
          dexterity: 3,
          constitution: 3,
          intelligence: 3,
          charisma: 3,
          wisdom: 3,})
        .expect(200)
        .expect(res => {
          expect(res.body.strength).to.equal(3);
          expect(res.body.dexterity).to.equal(3);
          expect(res.body.constitution).to.equal(3);
          expect(res.body.intelligence).to.equal(3);
          expect(res.body.charisma).to.equal(3);
          expect(res.body.wisdom).to.equal(3);
        });
    });

    it('should return 400 with invalid body', function() {
      return request
        .put(`/api/stats/${this.testStats._id}`)
        .set({ 'Authorization': `Bearer ${this.testToken}`})
        .send()
        .expect(400);
    });

    it('should return 401 for invalid user',function(){
      debug('this is the token',this.hackerToken);
      return request
        .put(`/api/stats/${this.testStats._id}`)
        .set({'Authorization': `Bearer ${this.hackerToken}`})
        .expect(401);
    });
  });

  describe('DELETE /api/stats/:id',function(){
    beforeEach(function() {
      exampleStats.userId = this.testUser._id;
      exampleStats.characterId = this.testCharacter._id;
      return Stats.createStats(exampleStats)
        .then(stats => this.testStats = stats)
        .then(updatedStats => {
          return Character.findByIdAndUpdate(this.testCharacter._id,{$push: {stats: updatedStats}},{new: true});
        })
        .then(character => debug(character));
    });
    afterEach(function() {
      return helper.kill();
    });
    it('should return the deleted stats',function(){
      return request
        .delete(`/api/stats/${this.testStats._id}`)
        .set({ 'Authorization': `Bearer ${this.testToken}`})
        .expect(204)
        .then(res => {
          Stats.findById(res.body._id)
            .then(deleted => expect(deleted).to.be.null);
        });
    });
    it('should return 401 for invalid user',function(){
      debug('this is the token',this.hackerToken);
      return request
        .delete(`/api/stats/${this.testStats._id}`)
        .set({'Authorization': `Bearer ${this.hackerToken}`})
        .expect(401);
    });
  });
});
