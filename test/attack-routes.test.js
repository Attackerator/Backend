'use strict';

const app = require('../server');
const request = require('supertest')(app);
const { expect } = require('chai');
const debug = require('debug')('app:test/attack-routes');

require('../lib/mongoose-connect');

const helper = require('./test-helper');
const User = require('../model/user.js');
const Character = require('../model/character.js');
const { createAttack } = require('../model/attack');

const exampleAttack = {
  name: 'test',
  stat: 'strength',
  damageType: 'blunt',
  diceType: 3,
  diceCount: 3,
  description: 'does a thing',
  toHitBonus: 2,
  damageBonus: 2
};

describe('attack routes', function() {
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
  describe('POST /api/attack', function() {
    afterEach(function () {
      return helper.kill();
    });

    it('should return an attack with ', function () {
      return request
        .post(`/api/attack/${this.testCharacter._id}`)
        .set({'Authorization': `Bearer ${this.testToken}`})
        .send({
          name: 'test',
          stat: 'strength',
          damageType: 'blunt',
          diceType: 3,
          diceCount: 3,
          description: 'does a thing',
          toHitBonus: 2,
          damageBonus: 2
        })
        .expect(200)
        .expect(res => {
          expect(res.body.name).to.equal('test');
          expect(res.body.stat).to.equal('strength');
          expect(res.body.damageType).to.equal('blunt');
          expect(res.body.diceType).to.equal(3);
          expect(res.body.diceCount).to.equal(3);
          expect(res.body.description).to.equal('does a thing');
          expect(res.body.toHitBonus).to.equal(2);
          expect(res.body.damageBonus).to.equal(2);
        });
    });

    it('should return 400 with invalid body', function () {
      return request
        .post(`/api/attack/${this.testCharacter._id}`)
        .set({'Authorization': `Bearer ${this.testToken}`})
        .send()
        .expect(400);
    });
  });
  describe('GET /api/stats/:id', function() {
    beforeEach(function() {
      exampleAttack.userId = this.testUser._id;
      exampleAttack.characterId = this.testCharacter._id;
      return createAttack(exampleAttack)
        .then(attack => this.testStats = attack)
        .then(updatedAttack => {
          return Character.findByIdAndUpdate(this.testCharacter._id,{$push: {attack: updatedAttack}},{new: true});
        })
        .then(character => debug(character));
    });
    afterEach(function() {
      delete this.testAttack;

      return helper.kill();
    });

    it('should return a attack', function() {
      return request
        .get(`/api/attack/${this.testStats._id}`)
        .set({Authorization: `Bearer ${this.testToken}`})
        .expect(200)
        .expect(res => {
          expect(res.body.name).to.equal('test');
          expect(res.body.stat).to.equal('strength');
          expect(res.body.damageType).to.equal('blunt');
          expect(res.body.diceType).to.equal(3);
          expect(res.body.diceCount).to.equal(3);
          expect(res.body.description).to.equal('does a thing');
          expect(res.body.toHitBonus).to.equal(2);
          expect(res.body.damageBonus).to.equal(2);
        });
    });

    it('should return 401 for invalid user',function() {
      return request.get(`/api/attack/${this.testStats._id}`)
        .set({Authorization: `Bearer ${this.hackerToken}`})
        .expect(401);
    });
  });

  describe('PUT /api/attack/:id', function() {
    beforeEach(function() {
      exampleAttack.userId = this.testUser._id;
      exampleAttack.characterId = this.testCharacter._id;
      return createAttack(exampleAttack)
        .then(attack => this.testAttack = attack)
        .then(updatedAttack => {
          return Character.findByIdAndUpdate(this.testCharacter._id,{$push: {attack: updatedAttack}},{new: true});
        })
        .then(character => debug(character));
    });
    afterEach(function() {
      delete this.testAttack;

      return helper.kill();
    });

    it('should return updated attack', function() {
      return request
        .put(`/api/attack/${this.testAttack._id}`)
        .set({Authorization: `Bearer ${this.testToken}`})
        .send({
          name: 'test2',
          stat: 'strength2',
          damageType: 'blunt2',
          diceType: 2,
          diceCount: 2,
          description: 'does a thing2',
          toHitBonus: 2,
          damageBonus: 2})
        .expect(200)
        .expect(res => {
          expect(res.body.name).to.equal('test2');
          expect(res.body.stat).to.equal('strength2');
          expect(res.body.damageType).to.equal('blunt2');
          expect(res.body.diceType).to.equal(2);
          expect(res.body.diceCount).to.equal(2);
          expect(res.body.description).to.equal('does a thing2');
          expect(res.body.toHitBonus).to.equal(2);
          expect(res.body.damageBonus).to.equal(2);
        });
    });
  });

});
