const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const faker = require('faker');
const Student = require('../../src/models/student.model');
const { STUDENTS, PARENTS } = require('../data/student');
const { classNumberFour, insertClassNumbers } = require('./classNumber.fixture');
const { boardNameFour, insertBoardNames } = require('./boardName.fixture');

const password = 'password1';
const salt = bcrypt.genSaltSync(8);
const hashedPassword = bcrypt.hashSync(password, salt);

const studentOne = {
  _id: mongoose.Types.ObjectId(),
  ...STUDENTS.studentOne,
};
const studentTwo = {
  _id: mongoose.Types.ObjectId(),
  ...STUDENTS.studentTwo,
};

const studentThree = {
  _id: mongoose.Types.ObjectId(),
  ...STUDENTS.studentThree,
};

const studentFour = {
  _id: mongoose.Types.ObjectId(),
  ...STUDENTS.studentFour,
};
const insertStudents = async (students) => {
  await insertClassNumbers([classNumberFour]);
  await insertBoardNames([boardNameFour]);
  await Student.insertMany(
    students.map((student) => ({
      ...student,
      password: hashedPassword,
      classNumber: classNumberFour._id.toString(),
      boardName: boardNameFour._id.toString(),
    }))
  );
};

module.exports = {
  studentOne,
  studentTwo,
  studentThree,
  studentFour,
  insertStudents,
};
