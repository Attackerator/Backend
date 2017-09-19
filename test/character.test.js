'use strict';

const app = require('../server');
const request = require('supertest')(app);
const { expect } = require('chai');
const debug = require('debug')('app:test/character');
require('../lib/mongoose-connect');
const helper = require('./test-helper');

const User = require('../model/user');

const exampleCharacter = {
  name: 'dustinyschild'
};

describe('Character Routes',function(){
  describe('POST /api/character',function(){
    beforeEach(function(){
      return User.createUser(helper.user)
        .then(user => this.testUser = user)
        .then(user => user.generateToken())
        .then(token => this.testToken = token);
    });
    afterEach(function(){
      return User.remove({});
    });
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
