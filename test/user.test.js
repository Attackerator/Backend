'use strict';

const debug = require('debug')('app:test/user.test');
const User = require('../model/user');
const { expect } = require('chai');

const testBody = {
  username: 'MrDonkey1028'
  ,email: 'donkey@example.com'
  ,password: 'mule'
};

describe('user creation', function () {
  describe('create user', function (){
    it('should return a user', function (){
      User.createUser(testBody)
        .then(res => {
          expect(res).to.deep.equal(testBody);
          debug(res);
        });
    });
  });
});
