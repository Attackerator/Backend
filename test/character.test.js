'use strict';

const app = require('../server');
const request = require('supertest')(app);
const debug = require('debug')('app:test/character');

const User = require('../model/user');
const Character = require('../model/character');

const exampleCharacter = {
  name: 'dustinyschild'
};

describe('Character Routes',function(){
  describe('POST /api/character',function(){
    beforeEach(function(){
      User.createUser({
        username:'username',
        password:'password',
        email:'example@example.com',
      });
    });
    afterEach(function(){
      return Promise.all([
        User.remove({})
      ]);
    });
    it('should return 200 if it saves a new character',function(){
      return request.post('/api/character')
        .set({Authorization: `Bearer ${this.testToken}`})
        .send(exampleCharacter)
        .expect(200)
        .expect(res => {
          expect(res.body.name).to.equal('dustinyschild');
        });
    });
  });
});
