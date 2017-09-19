'use strict';

const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const debug = require('debug')('app:model/spells');

const saveSchema = Schema ({
  name: { type: String, required: true },
  type: { type: String, required: true },
  stat: { type: String, required: true },
  bonus: { type: Number },
  characterId: { type: Schema.Types.ObjectId, required: true },
  userId: { type: Schema.Types.ObjectId, required: true },
});

const Save = module.exports = mongoose.models.save || mongoose.model('save',saveSchema);

Save.createSpell = function(body, characterId, userId){
  debug(body);
  return new Save({
    ...body,
    characterId,
    userId,
  }).save();
};
