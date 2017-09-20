'use strict';

const app = require('../server');
const request = require('supertest')(app);
const helper = require('./test-helper');

const { createUser } = require('../model/user');
const Character = require('../model/character');
const { createSkill } = require('../model/skills');

const { expect } = require('chai');
const debug = require('debug')('app:test/skills');

require('../lib/mongoose-connect');


describe('Skills',function(){
  beforeEach(function () {
    return createUser(helper.user)
      .then(user => this.testUser = user)
      .then(user => user.generateToken())
      .then(token => this.testToken = token);
  });
  beforeEach(function(){
    return Character.createCharacter(helper.character,this.testUser._id)
      .then(character => {
        this.testCharacter = character;
        debug(character);
      });
  });
  afterEach(function(){
    return helper.kill();
  });
  describe('Create Skill',function(){
    it('should create a skill',function(){
      return createSkill(helper.skill,this.testUser._id,this.testCharacter._id)
        .then(saved => {
          expect(saved.name).to.deep.equal('underwater basket weaving');
          expect(saved.bonus).to.deep.equal(3);
          expect(saved.stat).to.deep.equal('dexterity');
        });
    });
  });
  describe('Routes',function(){
    describe('POST /api/:characterid/skill',function(){
      it('should return a saved skill',function(){
        return request.post(`/api/${this.testCharacter._id}/skill`)
          .set({Authorization: `Bearer ${this.testToken}`})
          .send(helper.skill)
          .expect(200)
          .expect(saved => {
            expect(saved.body.name).to.equal('underwater basket weaving');
            expect(saved.body.bonus).to.deep.equal(3);
            expect(saved.body.stat).to.equal('dexterity');
          });
      });
    });
    /*
    describe('GET /api/:characterid/skills',function(){
      beforeEach(function(){
        createSkill(helper.skill,this.testUser._id,this.testCharacter._id)
          .then(skill => this.testSkill = skill)
          .then(skill => {
            let skills = [];
            skills.push(skill);
            return skills;
          })
          .then(updatedSkills => {
            return Character.findByIdAndUpdate(this.testCharacter._id,{ skills: updatedSkills }, { runValidators: true });
          });
      });
      afterEach(function(){
        delete this.testSkill;

        return helper.kill();
      });

      it('should return a skill for character',function(){
        return request.get(`/api/${this.testCharacter._id}/skills`)
          .set({Authorization: `Bearer ${this.testToken}`})
          .expect(200)
          .expect(res => {
            expect(res.body.name).to.equal('underwater basket weaving');
            expect(res.body.bonus).to.deep.equal(3);
            expect(res.body.stat).to.equal('dexterity');
            expect(res.body.userId).to.equal(this.testUser._id);
            expect(res.body.characterId).to.equal(this.testCharacter._id);
          });
      });
    });
    */
  });
});
