const request = require('supertest');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { Batch, ClassNumber, User } = require('../../src/models');
const { admin, insertUsers } = require('../fixtures/user.fixture');
const { batchOne, batchTwo, batchThree, batchFour, insertBatches } = require('../fixtures/batch.fixture');
const {
  classNumberOne,
  classNumberTwo,
  classNumberThree,
  classNumberFour,
  insertClassNumbers,
} = require('../fixtures/classNumber.fixture');
const {
  boardNameOne,
  boardNameTwo,
  boardNameThree,
  boardNameFour,
  insertBoardNames,
} = require('../fixtures/boardName.fixture');
const { userOneAccessToken, adminAccessToken, studentOneAccessToken } = require('../fixtures/token.fixture');
const { BATCHES } = require('../data/batch');

setupTestDB();

describe('Batch routes', () => {
  beforeEach(async () => {
    await insertUsers([admin]);
    await insertClassNumbers([classNumberOne, classNumberTwo]);
    await insertBoardNames([boardNameOne, boardNameTwo]);
  });
  afterEach(async () => {
    await Batch.deleteMany();
    await User.deleteMany();
    await ClassNumber.deleteMany();
  });

  describe('POST /v1/batches', () => {
    test('should return 201 and successfully create new batch if data is ok', async () => {
      // without this, auth failure will occur

      const body = {
        ...BATCHES.batchOne,
        classNumber: classNumberOne._id,
        boardName: boardNameOne._id,
      };

      const res = await request(app)
        .post('/v1/batches')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(body)
        .expect(httpStatus.CREATED);

      expect(res.body).toEqual({
        id: expect.anything(),
        ...BATCHES.batchOne,
        classNumber: classNumberOne._id.toString(),
        boardName: boardNameOne._id.toString(),
        students: [],
        subjects: [],
        teachers: [],
      });

      // SKIPPED TESTING DATABASE OBJECT
    });
  });

  describe('PATCH /v1/batches/:id', () => {
    test('should update batch firstName', async () => {
      const body = {
        ...BATCHES.batchOne,
        classNumber: classNumberOne._id,
        boardName: boardNameOne._id,
      };

      const resOld = await request(app)
        .post('/v1/batches')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(body)
        .expect(httpStatus.CREATED);

      // ---------ABOVE TESTED IN OTHER TEST

      const batchOneId = resOld.body.id;

      const updateBody = {
        classNumber: classNumberTwo._id.toString(),
      };

      const res = await request(app)
        .patch(`/v1/batches/${batchOneId}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: expect.anything(),
        ...BATCHES.batchOne,
        classNumber: classNumberTwo._id.toString(),
        boardName: boardNameOne._id.toString(),
        students: [],
        subjects: [],
        teachers: [],
      });

      // SKIPPED TESTING DATABASE OBJECT
    });
  });

  describe('DELETE /v1/batches/:id', () => {
    test('should delete batch', async () => {
      const body = {
        ...BATCHES.batchOne,
        classNumber: classNumberOne._id,
        boardName: boardNameOne._id,
      };

      const resOld = await request(app)
        .post('/v1/batches')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(body)
        .expect(httpStatus.CREATED);

      // ---------ABOVE TESTED IN OTHER TEST

      const batchOneId = resOld.body.id;
      await request(app)
        .delete(`/v1/batches/${batchOneId}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);

      const dbUser = await Batch.findById(batchOne._id);
      expect(dbUser).toBeNull();
    });
  });
});
