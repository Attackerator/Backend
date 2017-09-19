'use strict';

const app = require('../server');
const request = require('supertest')(app);
const { expect } = require('chai');

require('../lib/mongoose-connect');

const helper = require('./test-helper');
const User = require('../model/user.js');

describe('attack routes', function() {
  describe('POST /api/attack', function() {
    beforeEach(function () {
      return User.createUser(helper.user)
        .then(user => this.testUser = user)
        .then(user => user.generateToken())
        .then(token => this.testToken = token);
    });

    afterEach(function () {
      return helper.kill();
    });

    it('should return an attack with ', function () {
      return request
        .post('/api/attack')
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
        .post('/api/attack')
        .set({'Authorization': `Bearer ${this.testToken}`})
        .send()
        .expect(400);
    });
  });
});
