'use strict';

const app = require('../server');
const request = require('supertest')(app);
const { expect } = require('chai');
const debug = require('debug')('app:test/stats-routes');

require('../lib/mongoose-connect');
const helper = require('./test-helper');
const User = require('../model/user');
const Character = require('../model/character');
const { createStats } = require('../model/stats');

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
      return createStats(exampleStats)
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
      return request.get(`/api/stats/${this.testStats._id}`)
        .set({Authorization: `Bearer ${this.hackerToken}`})
        .expect(401);
    });
  });
});
