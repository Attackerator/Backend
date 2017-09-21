'use strict';

const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const debug = require('debug')('app:model/character');

const characterSchema = Schema({
  userId: { type: Schema.Types.ObjectId, required: true},
  name: { type: String, required: true },
  stats: [{ type: Schema.Types.ObjectId, ref: 'stat' }],
  skills: [{ type: Schema.Types.ObjectId, ref: 'skill' }],
  saves: [{ type: Schema.Types.ObjectId, ref: 'save' }],
  spells: [{ type: Schema.Types.ObjectId, ref: 'spell' }],
  attack: [{ type: Schema.Types.ObjectId, ref: 'attack' }],
  sayings: [{ type: Schema.Types.ObjectId }],
});

const Character = module.exports = mongoose.models.character || mongoose.model('character',characterSchema);

Character.createCharacter = function(character){
  debug(character);
  return new Character(character).save();
};
