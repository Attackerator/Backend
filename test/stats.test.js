'use strict';

const Stats = require('../model/stats');
const { expect } = require('chai');

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
      return Stats.createStats(testBody)
        .save()
        .then(saved => {
          expect(saved.strength).to.deep.equal(4);
          expect(saved.dexterity).to.deep.equal(5);
          expect(saved.constitution).to.deep.equal(7);
          expect(saved.intelligence).to.deep.equal(23);
          expect(saved.charisma).to.deep.equal(2);
          expect(saved.wisdom).to.deep.equal(3);


        });
    });
  });
});
