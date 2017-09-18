'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const statSchema = Schema({
  strength: { type: Number, required: true, default: 3},
  dexterity: { type: Number, required: true, default: 3},
  constitution: { type: Number, required: true, default: 3},
  intelligence: { type: Number, required: true, default: 3},
  charisma: { type: Number, required: true, default: 3},
  wisdom: { type: Number, required: true, default: 3}
});

module.exports = mongoose.models.stat || mongoose.model('stat', statSchema);
