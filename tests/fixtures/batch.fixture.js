const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Batch = require('../../src/models/batch.model');
const { BATCHES } = require('../data/batch');

const password = 'password1';
const salt = bcrypt.genSaltSync(8);
const hashedPassword = bcrypt.hashSync(password, salt);

const batchOne = {
  _id: mongoose.Types.ObjectId(),
  ...BATCHES.batchOne,
};
const batchTwo = {
  _id: mongoose.Types.ObjectId(),
  ...BATCHES.batchTwo,
};

const batchThree = {
  _id: mongoose.Types.ObjectId(),
  ...BATCHES.batchThree,
};

const batchFour = {
  _id: mongoose.Types.ObjectId(),
  ...BATCHES.batchFour,
};
const insertBatches = async (batches) => {
  await Batch.insertMany(batches.map((batch) => ({ ...batch })));
};

module.exports = {
  batchOne,
  batchTwo,
  batchThree,
  batchFour,
  insertBatches,
};
