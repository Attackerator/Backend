'use strict';

const debug = require('debug')('app:test/user.test');
const Stats = require('../model/stats');
const { expect } = require('chai');

const testBody = {
  strength: 4,
  dexterity: 5,
  constitution: 7,
  intelligence: 23,
  charisma: 2,
  wisdom: 3
};

describe('stats creation', function() {
  describe('create stats', function() {
    it('should return stats', function() {
      Stats.createStats(testBody)
        .then(res => {
          expect(res).to.deep.equal(testBody);
          debug(res);
        });
    });
  });
});
