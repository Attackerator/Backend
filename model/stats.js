'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;
const debug = require('debug')('app:model/stats');

const statSchema = Schema({
  strength: { type: Number, required: true, default: 3},
  dexterity: { type: Number, required: true, default: 3},
  constitution: { type: Number, required: true, default: 3},
  intelligence: { type: Number, required: true, default: 3},
  charisma: { type: Number, required: true, default: 3},
  wisdom: { type: Number, required: true, default: 3}
});

const Stats = module.exports = mongoose.models.stat || mongoose.model('stat', statSchema);

Stats.createStats = function(body) {
  debug('createStat', body);
  return new Stats(body);
};
