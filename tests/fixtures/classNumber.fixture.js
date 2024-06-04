const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const ClassNumber = require('../../src/models/classNumber.model');
const { CLASS_NUMBERS } = require('../data/classNumber');

const password = 'password1';
const salt = bcrypt.genSaltSync(8);
const hashedPassword = bcrypt.hashSync(password, salt);

const classNumberOne = {
  _id: mongoose.Types.ObjectId(),
  ...CLASS_NUMBERS.classNumberOne,
};
const classNumberTwo = {
  _id: mongoose.Types.ObjectId(),
  ...CLASS_NUMBERS.classNumberTwo,
};

const classNumberThree = {
  _id: mongoose.Types.ObjectId(),
  ...CLASS_NUMBERS.classNumberThree,
};

const classNumberFour = {
  _id: mongoose.Types.ObjectId(),
  ...CLASS_NUMBERS.classNumberFour,
};
const insertClassNumbers = async (classNumbers) => {
  await ClassNumber.insertMany(classNumbers.map((classNumber) => ({ ...classNumber })));
};

module.exports = {
  classNumberOne,
  classNumberTwo,
  classNumberThree,
  classNumberFour,
  insertClassNumbers,
};
