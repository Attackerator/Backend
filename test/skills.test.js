'use strict';

const app = require('../server');
const request = require('supertest')(app);
const helper = require('./test-helper');

const { createUser } = require('../model/user');
const Character = require('../model/character');
const Skill = require('../model/skills');
const { createSkill } = require('../model/skills');

const { expect } = require('chai');
const debug = require('debug')('app:test/skills');

require('../lib/mongoose-connect');

const exampleSkill = {
  name: 'underwater basket weaving',
  bonus: 3,
  stat: 'dexterity'
};

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
        exampleSkill.userId = this.testUser._id;
        exampleSkill.characterId = this.testCharacter._id;
        return createSkill(exampleSkill)
          .then(skill => this.testSkill = skill)
          .then(updatedSkills => {
            return Character.findByIdAndUpdate(this.testCharacter._id,{$push: {skills: updatedSkills}},{new: true});
          });
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
    describe('PUT /api/skill/:skillId',function(){
      beforeEach(function(){
        return helper.addSkill(this.testCharacter._id,this.testUser._id)
          .then(skill => {
            debug('Test Skill',skill);
            this.testSkill = skill;
          });
      });
      afterEach(function(){
        delete this.testSkill;

        return helper.kill();
      });
      it('should return updated skill',function(){
        return request.put(`/api/skill/${this.testSkill._id}`)
          .set({Authorization: `Bearer ${this.testToken}`})
          .send({name: 'updatedSkill',bonus: 4})
          .expect(200)
          .expect(res => {
            expect(res.body.name).to.equal('updatedSkill');
            expect(res.body.bonus).to.equal(4);
            expect(res.body.stat).to.equal('dexterity');
          });
      });
      it('should return 401 for invalid user',function(){
        return request.put(`/api/skill/${this.testSkill._id}`)
          .set({Authorization: `Bearer ${this.hackerToken}`})
          .expect(401);
      });
    });
    describe.only('DELETE /api/skill/:skillId',function(){
      beforeEach(function(){
        return request.post(`/api/skill/${this.testCharacter._id}`)
          .set({Authorization: `Bearer ${this.testToken}`})
          .send(helper.skill)
          .then(res => {
            debug(res.body);
            this.testSkill = res.body;
          });
      });
      afterEach(function(){
        delete this.testSkill;

        return helper.kill();
      });
      it('should return the deleted skill', function(){
        return request.delete(`/api/skill/${this.testSkill._id}`)
          .set({Authorization: `Bearer ${this.testToken}`})
          .expect(204)
          .then(() => {
            return Skill.findById(this.testSkill._id)
              .then(deleted => {
                expect(deleted).to.be.null;
              });
          });
      });
      it('should return 401 for invalid user',function(){
        return request.delete(`/api/skill/${this.testSkill._id}`)
          .set({Authorization: `Bearer ${this.hackerToken}`})
          .expect(401);
      });
      it('should delete the skill from character',function(){
        return request.delete(`/api/skill/${this.testSkill._id}`)
          .set({Authorization: `Bearer ${this.testToken}`})
          .expect(204)
          .then(() => {
            return Character.findById(this.testCharacter._id)
              .then(character => expect(character.skills).to.not.include(this.testSkill._id.toString()));
          });
      });
    });
  });
});
