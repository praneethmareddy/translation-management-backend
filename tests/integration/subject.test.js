const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const mongoose = require('mongoose');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { Student, Parent, Subject } = require('../../src/models');
const { userOne, userTwo, admin, insertUsers } = require('../fixtures/user.fixture');
const { studentOne, studentTwo, studentThree, studentFour, insertStudents } = require('../fixtures/student.fixture');
const { parentOne, parentTwo, parentThree, parentFour, insertParents } = require('../fixtures/parent.fixture');
const { subjectOne, subjectTwo, subjectThree, subjectFour, insertSubjects } = require('../fixtures/subject.fixture');
const { userOneAccessToken, adminAccessToken, studentOneAccessToken } = require('../fixtures/token.fixture');
const { STUDENTS, PARENTS } = require('../data/student');
const { SUBJECTS } = require('../data/subject');

setupTestDB();

describe('Subject routes', () => {
  afterEach(async () => {
    await Subject.deleteMany();
  });

  describe('POST /v1/subjects', () => {
    test('should return 201 and successfully create new subject if data is ok', async () => {
      // without this, auth failure will occur
      await insertUsers([admin]);

      const res = await request(app)
        .post('/v1/subjects')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(SUBJECTS.subjectOne)
        .expect(httpStatus.CREATED);

      const { name } = SUBJECTS.subjectOne;

      expect(res.body).toEqual({
        id: expect.anything(),
        name,
        teachers: [],
      });

      // SKIPPED TESTING DATABASE OBJECT
    });
  });

  describe('PATCH /v1/subjects/:id', () => {
    test('should update subject firstName', async () => {
      await insertUsers([admin]);
      await insertSubjects([subjectOne]);

      const updateBody = {
        name: 'newName',
      };
      const res = await request(app)
        .patch(`/v1/subjects/${subjectOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: expect.anything(),
        name: 'newName',
        teachers: [],
      });

      // SKIPPED TESTING DATABASE OBJECT
    });
  });

  describe('DELETE /v1/subjects/:id', () => {
    beforeEach(async () => {
      await insertUsers([admin]);
      await insertSubjects([subjectOne]);
    });
    test('should delete student', async () => {
      await request(app)
        .delete(`/v1/subjects/${subjectOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);

      const dbUser = await Subject.findById(subjectOne._id);
      expect(dbUser).toBeNull();
    });
  });
});
