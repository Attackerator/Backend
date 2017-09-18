'use strict';

const app = require('../server');
const request = require('supertest')(app);
const { expect } = require('chai');
const debug = require('debug')('app:test/character');
require('../lib/mongoose-connect');

const User = require('../model/user');

const exampleCharacter = {
  name: 'dustinyschild'
};

describe('Character Routes',function(){
  describe('POST /api/character',function(){
    beforeEach(function(){
      return User.createUser({
        username:'username',
        password:'password',
        email:'example@example.com',
      }).then(user => {
        debug(user);
      });
    });
    afterEach(function(){
      return User.remove({});
    });
    it('should return 200 if it saves a new character',function(){
      return request.post(`/api/character`)
        .send(exampleCharacter)
        .expect(200)
        .expect(res => {
          expect(res.body.name).to.equal('dustinyschild');
        });
    });
    it('should return 401 if no body is provided',function(){
      return request.post('/api/character')
        .send()
        .expect(400);
    });
  });
});
