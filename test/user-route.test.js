'use strict';

const app = require('../server');
const request = require('supertest')(app);
const debug = require('debug')('app:test/user-route');

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

describe('user routes', function(){
  describe('POST /api/user', function(){
    afterEach(function(){
      return helper.kill();
    });
    describe('valid request', function(){
      it('should succeed', function(){
        return request
          .post('/api/user')
          .send(exampleUser)
          .expect(200)
          .expect(res => {
            debug(res.text);
            expect(res.text.substring(0, 36)).to.equal('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');
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
  });
});
