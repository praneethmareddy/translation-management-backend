const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const faker = require('faker');
const Prospect = require('../../src/models/prospect.model');
const { PROSPECTS } = require('../data/prospect');

const password = 'password1';
const salt = bcrypt.genSaltSync(8);
const hashedPassword = bcrypt.hashSync(password, salt);

const prospectOne = {
  _id: mongoose.Types.ObjectId(),
  ...PROSPECTS.prospectOne,
};
const prospectTwo = {
  _id: mongoose.Types.ObjectId(),
  ...PROSPECTS.prospectTwo,
};

const prospectThree = {
  _id: mongoose.Types.ObjectId(),
  ...PROSPECTS.prospectThree,
};

const prospectFour = {
  _id: mongoose.Types.ObjectId(),
  ...PROSPECTS.prospectFour,
};
const insertProspects = async (prospects) => {
  await Prospect.insertMany(prospects.map((prospect) => ({ ...prospect, password: hashedPassword })));
};

module.exports = {
  prospectOne,
  prospectTwo,
  prospectThree,
  prospectFour,
  insertProspects,
};
