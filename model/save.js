'use strict';

const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const debug = require('debug')('app:model/save');

const saveSchema = Schema ({
  type: { type: String, required: true },
  stat: { type: String, required: true },
  bonus: { type: Number },
  characterId: { type: Schema.Types.ObjectId, required: true },
  userId: { type: Schema.Types.ObjectId, required: true },
});

const Save = module.exports = mongoose.models.save || mongoose.model('save',saveSchema);

Save.createSave = function(body){
  debug(body);
  return new Save({
    ...body,
  }).save();
};
