const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const faker = require('faker');
const Subject = require('../../src/models/subject.model');
const { SUBJECTS } = require('../data/subject');

const password = 'password1';
const salt = bcrypt.genSaltSync(8);
const hashedPassword = bcrypt.hashSync(password, salt);

const subjectOne = {
  _id: mongoose.Types.ObjectId(),
  ...SUBJECTS.subjectOne,
};
const subjectTwo = {
  _id: mongoose.Types.ObjectId(),
  ...SUBJECTS.subjectTwo,
};

const subjectThree = {
  _id: mongoose.Types.ObjectId(),
  ...SUBJECTS.subjectThree,
};

const subjectFour = {
  _id: mongoose.Types.ObjectId(),
  ...SUBJECTS.subjectFour,
};
const insertSubjects = async (subjects) => {
  await Subject.insertMany(subjects.map((subject) => ({ ...subject })));
};

module.exports = {
  subjectOne,
  subjectTwo,
  subjectThree,
  subjectFour,
  insertSubjects,
};
