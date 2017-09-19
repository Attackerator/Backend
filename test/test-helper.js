'use strict';

const User = require('../model/user');
const Stats = require('../model/stats');
const Character = require('../model/character');
const Spell = require('../model/spells');
const Skill = require('../model/skills');

const exampleSpell = {
  name: 'Donkey Fart',
  stat: 'wisdom',
  toHitBonus: 4,
  damageBonus: 7,
  damageType: 'necrotic',
  diceType: '8',
  diceCount: '5',
  description: 'Fills a sixty foot area of effect centered on caster. Everything in effected area rolls fortitude check. Half damage on miss.',
};
const exampleSave = {
  type: 'fortitude',
  stat: 'constitution',
  bonus: 5,
};
const exampleBody = {
  username: 'MrDonkey1028'
  ,email: 'donkey@example.com'
  ,password: 'mule'
};
const exampleStats = {
  strength:'8',
  dexterity:'8',
  constitution:'8',
  intelligence:'8',
  charisma:'8',
  wisdom:'8',
};
const exampleCharacter ={
  name: 'SuperDonkey',
  user: 'deadbeefdeadbeefdeadbeef',
};

const exampleSkill = {
  name: 'underwater basket weaving',
  bonus: 3,
  stat: 'dexterity'
};

const deleteCharacter = function(){
  Promise.all([
    User.remove({}),
    Stats.remove({}),
    Spell.remove({}),
    Character.remove({}),
    Skill.remove({})
  ]);
};

module.exports = {
  save: exampleSave,
  spell: exampleSpell,
  user: exampleBody,
  stats: exampleStats,
  character: exampleCharacter,
  kill: deleteCharacter,
  skill: exampleSkill,
};
