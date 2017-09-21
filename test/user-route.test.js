'use strict';

const app = require('../server');
const request = require('supertest')(app);
const debug = require('debug')('app:test/user-route');

const User = require('../model/user');
const Character = require('../model/character');
const Stats = require('../model/stats');
const Skills = require('../model/skills');
const Saves = require('../model/save');
const Spells = require('../model/spells');
const Attacks = require('../model/attack');
const helper = require('../test/test-helper');
require('../lib/mongoose-connect');
const { expect } = require('chai');

const exampleUser = {
  username: 'example'
  ,password: 'password!'
  ,email: 'example@example.com'
};
const missingPassUser = {
  username: 'example'
  ,email: 'example@example.com'
};
const missingUserUser = {
  password: 'password!'
  ,email: 'example@example.com'
};
const exampleCharacter = {
  name: 'dustinyschild'
};

describe('user routes', function(){
  afterEach(function(){
    return helper.kill();
  });
  describe('GET /api/signin', function(){
    var nUser;
    beforeEach(function() {
      return User.createUser(exampleUser).then(user => nUser = user);
    });
    it('should return JWT when you sign in', function (){
      debug(nUser);
      return request
        .get('/api/signin')
        .auth(exampleUser.username, exampleUser.password)
        .expect(200)
        .expect(res => {
          debug(res.text);
          expect(res.text.substring(0, 36)).to.equal('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');//this is algorithm and type for jwt
        });
    });
  });
  describe('POST /api/user', function(){
    describe('valid request', function(){
      it('should succeed algorithm and type for jwt in the response', function(){
        return request
          .post('/api/user')
          .send(exampleUser)
          .expect(200)
          .expect(res => {
            debug(res.text);
            expect(res.text.substring(0, 36)).to.equal('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');//this is algorithm and type for jwt
          });
      });
    });
    describe('with missing body', function(){
      it('should return a 400 error', function(){
        return request
          .post('/api/user')
          .expect(400);
      });
    });

    describe('with missing password', function() {
      it('should return a 400 error for missing password', function(){
        return request
          .post('/api/user')
          .send(missingPassUser)
          .expect(400);
      });
    });

    describe('with missing username', function() {
      it('should return a 400 error for missing password', function(){
        return request
          .post('/api/user')
          .send(missingUserUser)
          .expect(400);
      });
    });

    describe('with invalid body', function(){
      it('should return a 400 error', function(){
        return request
          .post('/api/user')
          .send('totally not JSON at all bro!')
          .expect(400);
      });
    });
  });

  describe.only('PUT /api/user/:id', function() {
    beforeEach(function(){
      return User.createUser(helper.user)
        .then(user => this.testUser = user)
        .then(user => user.generateToken())
        .then(token => this.testToken = token);
    });
    beforeEach(function(){
      return User.createUser(helper.hacker)
        .then(hacker => this.hacker = hacker)
        .then(hacker => hacker.generateToken())
        .then(token => this.hackerToken = token);
    });

    it('should return an updated user', function() {
      return request
        .put(`/api/user/${this.testUser._id}`)
        .set({Authorization: `Bearer ${this.testToken}`})
        .send({
          username: 'blah',
          password: 'blah',
        })
        .expect(200)
        .expect(res => {
          expect(res.body.username).to.equal('blah');
          expect(res.body.password).to.not.equal('$2a$10$mQGcrO3v95Psb1jhnKpql.k16fx5Q6Mn3CBwUunYVANZox7bHMxFC');
        });
    });
    it('should return 401 for invalid user',function(){
      debug('this is the token',this.hackerToken);
      return request
        .put(`/api/user/${this.testUser._id}`)
        .set({'Authorization': `Bearer ${this.hackerToken}`})
        .expect(401);
    });
  });

  describe.only('DELETE /api/user/:id',function(){
    beforeEach(function(){
      return User.createUser(helper.user)
        .then(user => this.testUser = user)
        .then(user => user.generateToken())
        .then(token => this.testToken = token);
    });
    beforeEach(function(){
      return User.createUser(helper.hacker)
        .then(hacker => this.hacker = hacker)
        .then(hacker => hacker.generateToken())
        .then(token => this.hackerToken = token);
    });
    beforeEach(function (){
      exampleCharacter.userId = this.testUser._id;
      return Character.createCharacter(exampleCharacter)
        .then(character => this.testCharacter = character);
    });
    beforeEach(function(){
      return helper.addSpell(this.testCharacter.id,this.testUser._id);
    });
    beforeEach(function(){
      return helper.addSkill(this.testCharacter.id,this.testUser._id);
    });
    beforeEach(function(){
      return helper.addStat(this.testCharacter.id,this.testUser._id);
    });
    beforeEach(function(){
      return helper.addSave(this.testCharacter.id,this.testUser._id);
    });
    beforeEach(function(){
      return helper.addAttack(this.testCharacter.id,this.testUser._id);
    });

    it('should return 204',function(){
      return request.delete(`/api/user/${this.testUser._id}`)
        .set({ 'Authorization': `Bearer ${this.testToken}`})
        .expect(204)
        .then(res => {
          return User.findById(res.body._id)
            .then(deleted => {
              debug('deleted user', deleted);
              expect(deleted).to.be.null;
            });
        })
        .then(() => {
          return Character.find({userId : this.testUser._id})
            .then(deleted => {
              debug('deleted', deleted);
              expect(deleted.length).to.equal(0);
            });
        })
        .then(() => {
          return Stats.find({userId : this.testUser._id})
            .then(deleted => {
              debug('deleted', deleted);
              expect(deleted.length).to.equal(0);
            });
        })
        .then(() => {
          return Skills.find({userId : this.testUser._id})
            .then(deleted => {
              debug('deleted', deleted);
              expect(deleted.length).to.equal(0);
            });
        })
        .then(() => {
          return Saves.find({userId : this.testUser._id})
            .then(deleted => {
              debug('deleted', deleted);
              expect(deleted.length).to.equal(0);
            });
        })
        .then(() => {
          return Stats.find({userId : this.testUser._id})
            .then(deleted => {
              debug('deleted', deleted);
              expect(deleted.length).to.equal(0);
            });
        })
        .then(() => {
          return Spells.find({userId : this.testUser._id})
            .then(deleted => {
              debug('deleted', deleted);
              expect(deleted.length).to.equal(0);
            });
        })
        .then(() => {
          return Attacks.find({userId : this.testUser._id})
            .then(deleted => {
              debug('deleted', deleted);
              expect(deleted.length).to.equal(0);
            });
        });
    });
    it('should return 401 for invalid user',function(){
      debug('this is the token',this.hackerToken);
      return request.delete(`/api/user/${this.testUser._id}`)
        .set({'Authorization': `Bearer ${this.hackerToken}`})
        .expect(401);
    });
  });
});
