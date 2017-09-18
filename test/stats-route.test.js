'use strict';

const app = require('../server');
const request = require('supertest')(app);
const { expect } = require('chai');

const Stats = require('../model/stats');

describe('stats routes', function() {
  describe('POST /api/note', function() {
    describe('with a valid body', function() {
      after(function () {
        return Stats.remove({});
      });

      it('should return stats', function () {
        return request
          .post('/api/stats')
          .send({ strength: 3})
          .expect(200)
          .expect(res => {
            expect(res.body.strength).to.equal(3);
            expect(res.body.charisma).to.not.be.undefined;
          });
      });
    });
  });
});
