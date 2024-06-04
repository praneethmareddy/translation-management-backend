const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const faker = require('faker');
const Parent = require('../../src/models/parent.model');
const { STUDENTS, PARENTS } = require('../data/student');

const password = 'password1';
const salt = bcrypt.genSaltSync(8);
const hashedPassword = bcrypt.hashSync(password, salt);

const parentOne = {
  _id: mongoose.Types.ObjectId(),
  ...PARENTS.parentOne,
};
const parentTwo = {
  _id: mongoose.Types.ObjectId(),
  ...PARENTS.parentTwo,
};

const parentThree = {
  _id: mongoose.Types.ObjectId(),
  ...PARENTS.parentThree,
};

const parentFour = {
  _id: mongoose.Types.ObjectId(),
  ...PARENTS.parentFour,
};

const insertParents = async (parents) => {
  await Parent.insertMany(parents.map((parent) => ({ ...parent, password: hashedPassword })));
};

module.exports = {
  parentOne,
  parentTwo,
  parentThree,
  parentFour,
  insertParents,
};
