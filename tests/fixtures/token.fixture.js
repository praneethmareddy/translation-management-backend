const moment = require('moment');
const config = require('../../src/config/config');
const { tokenTypes } = require('../../src/config/tokens');
const tokenService = require('../../src/services/token.service');
const { userOne, admin } = require('./user.fixture');
const { studentOne } = require('./student.fixture');
const { parentOne } = require('./parent.fixture');

const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');

const userOneAccessToken = tokenService.generateToken(userOne._id, accessTokenExpires, tokenTypes.ACCESS, 'user');

const adminAccessToken = tokenService.generateToken(admin._id, accessTokenExpires, tokenTypes.ACCESS, 'admin');

const studentOneAccessToken = tokenService.generateToken(studentOne._id, accessTokenExpires, tokenTypes.ACCESS, 'user');

const parentOneAccessToken = tokenService.generateToken(parentOne._id, accessTokenExpires, tokenTypes.ACCESS, 'user');

module.exports = {
  userOneAccessToken,
  adminAccessToken,
  studentOneAccessToken,
  parentOneAccessToken,
};
