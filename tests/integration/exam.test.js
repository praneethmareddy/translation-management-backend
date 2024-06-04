const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const mongoose = require('mongoose');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { Exam, User } = require('../../src/models');
const { userOne, userTwo, admin, insertUsers } = require('../fixtures/user.fixture');
const { examOne, examTwo, examThree, examFour, insertExams } = require('../fixtures/exam.fixture');
const { userOneAccessToken, adminAccessToken, examOneAccessToken } = require('../fixtures/token.fixture');
const { EXAMS } = require('../data/exam');

setupTestDB();

describe('Exam routes', () => {
  afterEach(async () => {
    await Exam.deleteMany();
    await User.deleteMany();
  });

  describe('POST /v1/exams', () => {
    test('should return 201 and successfully create new exam if data is ok', async () => {
      // without this, auth failure will occur
      await insertUsers([admin]);

      const res = await request(app)
        .post('/v1/exams')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(EXAMS.examOne)
        .expect(httpStatus.CREATED);

      expect(res.body).toEqual({
        id: expect.anything(),
        questions: [
          {
            _id: expect.anything(),
            question: {
              _id: expect.anything(),
              ...EXAMS.examOne.questions[0].question,
            },
            answer: {
              _id: expect.anything(),
              ...EXAMS.examOne.questions[0].answer,
            },
          },
          {
            _id: expect.anything(),
            question: {
              _id: expect.anything(),
              ...EXAMS.examOne.questions[1].question,
            },
            answer: {
              _id: expect.anything(),
              ...EXAMS.examOne.questions[1].answer,
              content: [
                {
                  _id: expect.anything(),
                  ...EXAMS.examOne.questions[1].answer.content[0],
                },
                {
                  _id: expect.anything(),
                  ...EXAMS.examOne.questions[1].answer.content[1],
                },
              ],
            },
          },
        ],
      });
    });
    test('should return 201', async () => {
      // without this, auth failure will occur
      await insertUsers([admin]);

      const res = await request(app)
        .post('/v1/exams')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(EXAMS.examFive)
        .expect(httpStatus.CREATED);

      expect(res.status).toBe(201);
    });
    test('should return 201 for another data', async () => {
      // without this, auth failure will occur
      await insertUsers([admin]);

      const res = await request(app)
        .post('/v1/exams')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(EXAMS.examSix)
        .expect(httpStatus.CREATED);

      expect(res.status).toBe(201);
    });
  });

  /* describe('PATCH /v1/exams/:id', () => { */
  /*   test('should update exam firstName', async () => { */
  /*     await insertUsers([admin]); */
  /*     await insertExams([examOne]); */
  /**/
  /*     const updateBody = { */
  /*       name: 'newName', */
  /*     }; */
  /*     const res = await request(app) */
  /*       .patch(`/v1/exams/${examOne._id}`) */
  /*       .set('Authorization', `Bearer ${adminAccessToken}`) */
  /*       .send(updateBody) */
  /*       .expect(httpStatus.OK); */
  /**/
  /*     expect(res.body).toEqual({ */
  /*       id: expect.anything(), */
  /*       name: 'newName', */
  /*       teachers: [], */
  /*     }); */
  /**/
  /*     // SKIPPED TESTING DATABASE OBJECT */
  /*   }); */
  /* }); */
  /**/
  /* describe('DELETE /v1/exams/:id', () => { */
  /*   beforeEach(async () => { */
  /*     await insertUsers([admin]); */
  /*     await insertExams([examOne]); */
  /*   }); */
  /*   test('should delete exam', async () => { */
  /*     await request(app) */
  /*       .delete(`/v1/exams/${examOne._id}`) */
  /*       .set('Authorization', `Bearer ${adminAccessToken}`) */
  /*       .send() */
  /*       .expect(httpStatus.NO_CONTENT); */
  /**/
  /*     const dbUser = await Exam.findById(examOne._id); */
  /*     expect(dbUser).toBeNull(); */
  /*   }); */
  /* }); */
});
