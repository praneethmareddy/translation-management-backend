const mongoose = require('mongoose');
const Exam = require('../../src/models/exam.model');
const { EXAMS } = require('../data/exam');

const examOne = {
  _id: mongoose.Types.ObjectId(),
  ...EXAMS.examOne,
};
const examTwo = {
  _id: mongoose.Types.ObjectId(),
  ...EXAMS.examTwo,
};

const examThree = {
  _id: mongoose.Types.ObjectId(),
  ...EXAMS.examThree,
};

const examFour = {
  _id: mongoose.Types.ObjectId(),
  ...EXAMS.examFour,
};
const insertExams = async (exams) => {
  await Exam.insertMany(
    exams.map((exam) => ({
      ...exam,
    }))
  );
};

module.exports = {
  examOne,
  examTwo,
  examThree,
  examFour,
  insertExams,
};
