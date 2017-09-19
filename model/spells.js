'use strict';

const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const debug = require('debug')('app:model/spells');

const spellSchema = Schema ({
  name: { type: String, required: true },
  stat: { type: String, required: true },
  toHitBonus: { type: Number },
  damageBonus: { type: Number },
  damageType: { type: String, required: true },
  diceType: { type: Number, required: true },
  diceCount: { type: Number, required: true },
  description: { type: String },
  characterId: { type: Schema.Types.ObjectId, required: true },
  userId: { type: Schema.Types.ObjectId, required: true },
});

const Spell = module.exports = mongoose.models.spell || mongoose.model('spell',spellSchema);

Spell.createSpell = function(body){
  debug(body);
  return new Spell({
    ...body,
  }).save();
};
