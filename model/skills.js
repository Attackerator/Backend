'use strict';

const mongoose = require('mongoose');
//const { Schema } = require('mongoose');
const debug = require('debug')('app:model/skills');

const skillsSchema = {
  name: { type: String, required: true },
  bonus: { type: Number, required: true },
  stat: { type: String }
};

const Skill = module.exports = mongoose.models.skill || mongoose.model('skill',skillsSchema);

Skill.createSkill = function(skill){
  debug(skill);
  return new Skill(skill).save();
};
