'use strict';

const app = require('../server');
const request = require('supertest')(app);
const helper = require('./test-helper');
const { expect } = require('chai');
const debug = require('debug')('app:test/skills');

require('../lib/mongoose-connect');


describe('Skills',function(){
  describe('Create Skill',function(){
    it('should create a skill',function(){
      return helper.skill
        .then(saved => {
          expect(saved.name).to.deep.equal('underwater basket weaving');
          expect(saved.bonus).to.deep.equal(3);
          expect(saved.stat).to.deep.equal('dexterity');
        });
    });
  });
  describe('Routes',function(){
    beforeEach(function(){
      return helper.user
        .then(user => {
          this.testUser = user;
        });
    });
    beforeEach(function(){
      helper.character
        .then(character => {
          this.testCharacter = character;
          debug('TEST HELPERS: ',this);
        });
    });
    afterEach(function(){
      delete this.testUser;
      delete this.testCharacter;

      return helper.kill();
    });
    describe('POST /api/skill/:characterid',function(){
      it('should return a saved skill',function(){
        return request.post(`/api/skill/${this.characterid}`)
          .send(helper.skill)
          .expect(200)
          .expect(saved => {
            expect(saved.name).to.deep.equal('underwater basket weaving');
            expect(saved.bonus).to.deep.equal(3);
            expect(saved.stat).to.deep.equal('dexterity');
          });
      });
    });
  });
});
