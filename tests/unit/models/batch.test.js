const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const mongoose = require('mongoose');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { Student, Parent, Batch } = require('../../src/models');
const { userOne, userTwo, admin, insertUsers } = require('../fixtures/user.fixture');
const { studentOne, studentTwo, studentThree, studentFour, insertStudents } = require('../fixtures/student.fixture');
const { parentOne, parentTwo, parentThree, parentFour, insertParents } = require('../fixtures/parent.fixture');
const { batchOne, batchTwo, batchThree, batchFour, insertBatches } = require('../fixtures/batch.fixture');
const { userOneAccessToken, adminAccessToken, studentOneAccessToken } = require('../fixtures/token.fixture');
const { STUDENTS, PARENTS } = require('../data/student');
const { BATCHES } = require('../data/batch');

setupTestDB();

describe('Batch routes', () => {
  afterEach(async () => {
    await Batch.deleteMany();
  });

  describe('POST /v1/batches', () => {
    test('should return 201 and successfully create new batch if data is ok', async () => {
      // without this, auth failure will occur
      await insertUsers([admin]);

      const res = await request(app)
        .post('/v1/batches')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(BATCHES.batchOne)
        .expect(httpStatus.CREATED);

      const { firstName, email, contactNumber } = BATCHES.batchOne;

      expect(res.body).toEqual({
        id: expect.anything(),
        firstName,
        email,
        batches: [],
        contactNumber,
        dateOfBirth: expect.anything(),
        dateOfInquiry: expect.anything(),
        subjects: [],
        parents: [],
      });

      // SKIPPED TESTING DATABASE OBJECT
    });
  });

  describe('PATCH /v1/students/:id', () => {
    test('should update batch firstName', async () => {
      await insertUsers([admin]);
      await insertBatches([batchOne]);

      const updateBody = {
        firstName: 'newFirstName',
      };
      const res = await request(app)
        .patch(`/v1/batches/${batchOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      const { email, contactNumber } = BATCHES.batchOne;

      expect(res.body).toEqual({
        id: expect.anything(),
        firstName: 'newFirstName',
        email,
        batches: [],
        contactNumber,
        dateOfBirth: expect.anything(),
        dateOfInquiry: expect.anything(),
        subjects: [],
        parents: [],
      });

      // SKIPPED TESTING DATABASE OBJECT
    });
  });

  describe('DELETE /v1/batches/:id', () => {
    beforeEach(async () => {
      await insertUsers([admin]);
      await insertBatches([batchOne]);
    });
    test('should delete student', async () => {
      await request(app)
        .delete(`/v1/batches/${batchOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);

      const dbUser = await Batch.findById(batchOne._id);
      expect(dbUser).toBeNull();
    });
  });
});
