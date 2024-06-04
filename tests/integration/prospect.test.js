const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const mongoose = require('mongoose');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { Student, Parent, Prospect } = require('../../src/models');
const { userOne, userTwo, admin, insertUsers } = require('../fixtures/user.fixture');
const { studentOne, studentTwo, studentThree, studentFour, insertStudents } = require('../fixtures/student.fixture');
const { parentOne, parentTwo, parentThree, parentFour, insertParents } = require('../fixtures/parent.fixture');
const { prospectOne, prospectTwo, prospectThree, prospectFour, insertProspects } = require('../fixtures/prospect.fixture');
const { userOneAccessToken, adminAccessToken, studentOneAccessToken } = require('../fixtures/token.fixture');
const { STUDENTS, PARENTS } = require('../data/student');
const { PROSPECTS } = require('../data/prospect');

setupTestDB();

describe('Prospect routes', () => {
  afterEach(async () => {
    await Prospect.deleteMany();
  });

  describe('POST /v1/prospects', () => {
    test('should return 201 and successfully create new prospect if data is ok', async () => {
      // without this, auth failure will occur
      await insertUsers([admin]);

      const res = await request(app)
        .post('/v1/prospects')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(PROSPECTS.prospectOne)
        .expect(httpStatus.CREATED);

      const { firstName, email, contactNumber } = PROSPECTS.prospectOne;

      expect(res.body).toEqual({
        id: expect.anything(),
        firstName,
        email,
        batches: [],
        contactNumber,
        dateOfBirth: expect.anything(),
        dateOfInquiry: expect.anything(),
        parents: [],
      });

      // SKIPPED TESTING DATABASE OBJECT
    });
  });

  describe('PATCH /v1/students/:id', () => {
    test('should update prospect firstName', async () => {
      await insertUsers([admin]);
      await insertProspects([prospectOne]);

      const updateBody = {
        firstName: 'newFirstName',
      };
      const res = await request(app)
        .patch(`/v1/prospects/${prospectOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      const { email, contactNumber } = PROSPECTS.prospectOne;

      expect(res.body).toEqual({
        id: expect.anything(),
        firstName: 'newFirstName',
        email,
        batches: [],
        contactNumber,
        dateOfBirth: expect.anything(),
        dateOfInquiry: expect.anything(),
        parents: [],
      });

      // SKIPPED TESTING DATABASE OBJECT
    });
  });

  describe('DELETE /v1/prospects/:id', () => {
    beforeEach(async () => {
      await insertUsers([admin]);
      await insertProspects([prospectOne]);
    });
    test('should delete student', async () => {
      await request(app)
        .delete(`/v1/prospects/${prospectOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);

      const dbUser = await Prospect.findById(prospectOne._id);
      expect(dbUser).toBeNull();
    });
  });
});
