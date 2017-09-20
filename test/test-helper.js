'use strict';

const User = require('../model/user');
const Stats = require('../model/stats');
const Character = require('../model/character');
const Spell = require('../model/spells');
const Skill = require('../model/skills');
const Attack = require('../model/attack');
const Save = require('../model/save');
const debug = require('debug')('app:test/HELPER');

const exampleHacker = {
  username: 'Imahack',
  password: 'password',
  email: 'email@example.com'
};

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

const exampleAttack = {
  name: 'Donkey Kick',
  stat: 'strength',
  toHitBonus: 5,
  damageBonus: 3,
  damageType: 'bludgeoning',
  diceType: '12',
  diceCount: '2',
  description: 'Achh, right in the fruit and veg',
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
  userId: 'deadbeefdeadbeefdeadbeef',
};

const exampleSkill = {
  name: 'underwater basket weaving',
  bonus: 3,
  stat: 'dexterity'
};

const addSkill = function(characterId, userId){
  Character.findById(characterId)
    .then(character => {
      debug(character);
      exampleSkill.characterId = characterId;
      exampleSkill.userId = userId;
      return Skill.createSkill(exampleSkill)
        .then(skill => {
          debug(skill);
          character.skills.push(skill._id);
          character.save();
        });
    });
};


const addSpell = function (characterId, userId){
  return Character.findById(characterId)
    .then(character => {
      debug(character);
      exampleSpell.characterId = characterId;
      exampleSpell.userId = userId;
      return Spell.createSpell(exampleSpell)
        .then(spell => {
          character.spells.push(spell._id);
          character.save();
        });
    });
};

const addStat = function (characterId, userId){
  return Character.findById(characterId)
    .then(character => {
      debug(character);
      exampleStats.characterId = characterId;
      exampleStats.userId = userId;
      return Stats.createStats(exampleStats)
        .then(stat => {
          character.stats.push(stat._id);
          character.save();
        });
    });
};

const addSave = function (characterId, userId){
  return Character.findById(characterId)
    .then(character => {
      debug(character);
      exampleSave.characterId = characterId;
      exampleSave.userId = userId;
      return Save.createSave(exampleSave)
        .then(saves => {
          character.saves.push(saves._id);
          character.save();
        });
    });
};

const addAttack = function (characterId, userId){
  return Character.findById(characterId)
    .then(character => {
      debug(character);
      exampleAttack.characterId = characterId;
      exampleAttack.userId = userId;
      return Attack.createAttack(exampleAttack)
        .then(attack => {
          character.attack.push(attack._id);
          character.save();
        });
    });
};

const deleteCharacter = function(){
  Promise.all([
    User.remove({}),
    Stats.remove({}),
    Spell.remove({}),
    Character.remove({}),
    Skill.remove({}),
    Save.remove({}),
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
  hacker: exampleHacker,
  addSpell: addSpell,
  addSkill: addSkill,
  addSave: addSave,
  addStat: addStat,
  addAttack: addAttack,
};
