'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;
const debug = require('debug')('app:model/attack');

const attackSchema = Schema({
  name: { type: String, required: true },
  stat: { type: String, required: true },
  damageType: { type: String, required: true},
  diceType: { type: Number, required: true },
  diceCount: { type: Number, required: true },
  description: { type: String, required: false },
  toHitBonus: { type: Number, required: false },
  damageBonus: { type: Number, required: false },
  characterId: { type: Schema.Types.ObjectId, required: true},
  userId: { type: Schema.Types.ObjectId, required: true}
});

const Attack = module.exports = mongoose.models.attack || mongoose.model('attack', attackSchema);

Attack.createAttack = function(body, userId, characterId) {
  debug('createAttack', body, userId, characterId);
  return new Attack(
    ...body,
    userId,
    characterId
  )
    .save();
};
