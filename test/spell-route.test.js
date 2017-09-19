'use strict';

const app = require('../server');
const request = require('supertest')(app);
const { expect } = require('chai');
const debug = require('debug')('app:test/spell');
require('../lib/mongoose-connect');
const helper = require('./test-helper');
const User = require('../model/user.js');

describe('Spell Routes',function(){
  beforeEach(function () {
    return User.createUser(helper.user)
      .then(user => this.testUser = user)
      .then(user => user.generateToken())
      .then(token => this.testToken = token);
  });
  afterEach(function(){
    return helper.kill();
  });
  describe('POST /api/spell',function(){
    it('should return 200 if it saves a new spell',function(){
      return request.post(`/api/spell`)
        .send(helper.spell)
        .set({'Authorization': `Bearer ${this.testToken}`})
        .expect(200)
        .expect(res => {
          debug(res.body.name);
          expect(res.body.name).to.equal('Donkey Fart');
          expect(res.body.description).to.not.be.null;
        });
    });
    it('should return 400 if no body is provided',function(){
      return request.post('/api/spell')
        .send()
        .set({'Authorization': `Bearer ${this.testToken}`})
        .expect(400);
    });
  });
});
