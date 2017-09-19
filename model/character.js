'use strict';

const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const debug = require('debug')('app:model/character');

const characterSchema = {
  name: { type: String, required: true },
  stats: [{ type: Schema.Types.ObjectId }],
  skills: [{ type: Schema.Types.ObjectId }],
  saves: [{ type: Schema.Types.ObjectId }],
  spells: [{ type: Schema.Types.ObjectId }],
  attack: [{ type: Schema.Types.ObjectId }],
  sayings: [{ type: Schema.Types.ObjectId }],
  userId: { type: Schema.Types.ObjectId, required: true }
};

const Character = module.exports = mongoose.models.character || mongoose.model('character',characterSchema);

Character.createCharacter = function(character,userId){
  debug(character);
  return new Character({
    ...character,
    userId
  }).save();
};
