'use strict';

const User = require('../model/user');
const Stats = require('../model/stats');
const Character = require('../model/character');
const debug = require('debug')('app:test-helper');



const exampleBody = {
  username: 'MrDonkey1028'
  ,email: 'donkey@example.com'
  ,password: 'mule'
};
/*
const exampleStats = {
  strength:'',
  dexterity:'',
  constitution:'',
  intelligence:'',
  charisma:'',
  wisdom:'',
};
*/
const exampleCharacter ={
  name: 'SuperDonkey',
};

const testUser = User.createUser(exampleBody);
debug('testUser');
//const testStats = Stats.createStats(exampleStats);
//debug('testStats');
const testCharacter = Character.createCharacter(exampleCharacter);
debug('testUser');

const deleteCharacter = function(){
  Promise.all([
    User.remove({}),
    Stats.remove({}),
    Character.remove({}),
  ]);
};

module.exports = {
  user: testUser,
  //stats: testStats,
  character: testCharacter,
  kill: deleteCharacter,
};
