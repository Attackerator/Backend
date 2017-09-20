'use strict';

const app = require('../server');
const request = require('supertest')(app);
const { expect } = require('chai');
const debug = require('debug')('app:test/character');
require('../lib/mongoose-connect');
const helper = require('./test-helper');

const User = require('../model/user');
const Character = require('../model/character');

const exampleCharacter = {
  name: 'dustinyschild'
};

describe('Character Routes',function(){
  beforeEach(function(){
    return User.createUser(helper.user)
      .then(user => this.testUser = user)
      .then(user => user.generateToken())
      .then(token => this.testToken = token);
  });
  afterEach(function(){
    return helper.kill();
  });
  describe.only('GET /api/character/:id', function(){
    beforeEach(function (){
      exampleCharacter.userId = this.testUser._id;
      return Character.createCharacter(exampleCharacter)
        .then(character => this.testCharacter = character);
    });
    it('should return a character maybe probably?', function(){
      helper.addSpell(this.testCharacter.id,this.testUser._id);
      //helper.addSpell(this.testCharacter.id,this.testUser._id);
      ///helper.addSpell(this.testCharacter.id,this.testUser._id);
      return request
        .get(`/api/character/${this.testCharacter.id}`)
        .set({'Authorization': `Bearer ${this.testToken}`})
        .expect(200)
        .expect(res => {
          debug(res.body);
          expect(res.body.name).to.equal(exampleCharacter.name);
        });
    });
  });
  describe('POST /api/character',function(){
    it('should return 200 if it saves a new character',function(){
      return request.post(`/api/character`)
        .send(exampleCharacter)
        .set({'Authorization': `Bearer ${this.testToken}`})
        .expect(200)
        .expect(res => {
          debug(res.body.name);
          expect(res.body.name).to.equal('dustinyschild');
        });
    });
    it('should return 401 if no body is provided',function(){
      return request.post('/api/character')
        .send()
        .set({'Authorization': `Bearer ${this.testToken}`})
        .expect(400);
    });
    //TODO: add validation checks for Auth headers
  });
});
