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
  });
});
