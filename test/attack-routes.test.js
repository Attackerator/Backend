'use strict';

const app = require('../server');
const request = require('supertest')(app);
const { expect } = require('chai');

require('../lib/mongoose-connect');

const Attack = require('../model/attack');

describe('attack routes', function() {
  describe('POST /api/attack', function() {
    after(function () {
      return Attack.remove({});
    });

    it('should return an attack with ', function () {
      return request
        .post('/api/attack')
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
        });
    });

    it('should return 400 with invalid body', function () {
      return request
        .post('/api/attack')
        .send()
        .expect(400);
    });
  });
});
