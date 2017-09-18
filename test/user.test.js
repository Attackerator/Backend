'use strict';

const debug = require('debug')('app:test/user.test');
const { expect } = require('chai');
const helper = require('../test/test-helper');


describe('user creation', function () {
  afterEach(function(){
    return helper.kill();
  });
  describe('create user', function (){
    it('should return a user', function (){
      helper.user
        .then(res => {
          expect(res).to.deep.equal(helper.user);
          debug(res);
        });
    });
  });
});
