'use strict';

const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const debug = require('debug')('app:model/skills');

const skillsSchema = {
  name: { type: String, required: true },
  bonus: { type: Number, required: true },
  stat: { type: String },
  userId: { type: Schema.Types.ObjectId, required: true },
  characterId: { type: Schema.Types.ObjectId, required: true },
};

const Skill = module.exports = mongoose.models.skill || mongoose.model('skill',skillsSchema);

Skill.createSkill = function(body){
  debug(body);
  return new Skill({
    ...body,
  }).save();
};
