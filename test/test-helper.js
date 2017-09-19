'use strict';

const User = require('../model/user');
const Stats = require('../model/stats');
const Character = require('../model/character');
const debug = require('debug')('app:test-helper');
const Spell = require('../model/spells');

const exampleSpell = {
  name: 'Donkey Fart',
  toHitBonus: 4,
  damageBonus: 7,
  damageType: 'necrotic',
  diceType: '8',
  diceCount: '5',
  description: 'Fills a sixty foot area of effect centered on caster. Everything in effected area rolls fortitude check. Half damage on miss.',
};
const testSpell = Spell.createSpell(exampleSpell);

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

const testUser = User.createUser(exampleBody).then(user => user.generateFindHash());
debug('testUser');
//const testStats = Stats.createStats(exampleStats);
//debug('testStats');
const testCharacter = Character.createCharacter(exampleCharacter);
debug('testCharacter');

const deleteCharacter = function(){
  Promise.all([
    User.remove({}),
    //Stats.remove({}),
    Stats.remove({}),
    Spell.remove({}),
    Character.remove({}),
  ]);
};

module.exports = {
  spell: testSpell,
  user: testUser,
  //stats: testStats,
  character: testCharacter,
  kill: deleteCharacter,
};
