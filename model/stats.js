'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const statSchema = Schema({
  strength: { type: Number, required: true},
  dexterity: { type: Number, required: true},
  constitution: { type: Number, required: true},
  intelligence: { type: Number, required: true},
  charisma: { type: Number, required: true},
  wisdom: { type: Number, required: true}
});

module.exports = mongoose.models.stat || mongoose.model('stat', statSchema);
