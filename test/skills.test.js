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
    return createUser(helper.hacker)
      .then(hacker => this.hacker = hacker)
      .then(hacker => hacker.generateToken())
      .then(token => this.hackerToken = token);
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
    describe('POST /api/skill/:characterid',function(){
      it('should return a saved skill',function(){
        return request.post(`/api/skill/${this.testCharacter._id}`)
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

    describe('GET /api/skill/:skillId',function(){
      beforeEach(function(){
        return createSkill(helper.skill,this.testUser._id,this.testCharacter._id)
          .then(skill => this.testSkill = skill)
          .then(updatedSkills => {
            return Character.findByIdAndUpdate(this.testCharacter._id,{$push: {skills: updatedSkills}},{new: true});
          })
          .then(character => debug(character));
      });
      afterEach(function(){
        delete this.testSkill;

        return helper.kill();
      });

      it('should return a skill',function(){
        return request.get(`/api/skill/${this.testSkill._id}`)
          .set({Authorization: `Bearer ${this.testToken}`})
          .expect(200)
          .expect(res => {
            expect(res.body.name).to.equal('underwater basket weaving');
            expect(res.body.bonus).to.deep.equal(3);
            expect(res.body.stat).to.equal('dexterity');
            expect(res.body.userId.toString()).to.equal(this.testUser._id.toString());
            expect(res.body.characterId).to.equal(this.testCharacter._id.toString());
          });
      });
      it('should return 401 for invalid user',function(){
        return request.get(`/api/skill/${this.testSkill._id}`)
          .set({Authorization: `Bearer ${this.hackerToken}`})
          .expect(401);
      });
    });
  });
});
