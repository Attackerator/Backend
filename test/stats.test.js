'use strict';

const debug = require('debug')('app:test/user.test');
const Stats = require('../model/stats');
const { expect } = require('chai');

const helper = require('./test-helper')

require('../lib/mongoose-connect');

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
      return Stats.createStats(helper.testStats)
        .save()
        .then(saved => {
          expect(saved.strength).to.deep.equal(3);
          expect(saved.dexterity).to.deep.equal(3);
          expect(saved.constitution).to.deep.equal(3);
          expect(saved.intelligence).to.deep.equal(3);
          expect(saved.charisma).to.deep.equal(3);
          expect(saved.wisdom).to.deep.equal(3);


        });
    });
  });
});
