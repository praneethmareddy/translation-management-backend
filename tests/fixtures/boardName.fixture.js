const mongoose = require('mongoose');
const BoardName = require('../../src/models/boardName.model');
const { BOARD_NAMES } = require('../data/boardName');

const boardNameOne = {
  _id: mongoose.Types.ObjectId(),
  ...BOARD_NAMES.boardNameOne,
};
const boardNameTwo = {
  _id: mongoose.Types.ObjectId(),
  ...BOARD_NAMES.boardNameTwo,
};

const boardNameThree = {
  _id: mongoose.Types.ObjectId(),
  ...BOARD_NAMES.boardNameThree,
};

const boardNameFour = {
  _id: mongoose.Types.ObjectId(),
  ...BOARD_NAMES.boardNameFour,
};
const insertBoardNames = async (boardNames) => {
  await BoardName.insertMany(boardNames.map((boardName) => ({ ...boardName })));
};

module.exports = {
  boardNameOne,
  boardNameTwo,
  boardNameThree,
  boardNameFour,
  insertBoardNames,
};
