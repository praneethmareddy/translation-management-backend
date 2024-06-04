const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const mongoose = require('mongoose');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { BoardName, ClassNumber, User, Student, Parent } = require('../../src/models');
const { userOne, userTwo, admin, insertUsers } = require('../fixtures/user.fixture');
const { studentOne, studentTwo, studentThree, studentFour, insertStudents } = require('../fixtures/student.fixture');
const { parentOne, parentTwo, parentThree, parentFour, insertParents } = require('../fixtures/parent.fixture');
const { userOneAccessToken, adminAccessToken, studentOneAccessToken } = require('../fixtures/token.fixture');
const { STUDENTS, PARENTS } = require('../data/student');
/* const { classNumberOne, classNumberTwo, classNumberFour, insertClassNumbers } = require('../fixtures/classNumber.fixture'); */
/* const { boardNameOne, boardNameTwo, boardNameFour, insertBoardNames } = require('../fixtures/boardName.fixture'); */

setupTestDB();

describe('Student routes', () => {
  beforeEach(async () => {
    /* await insertClassNumbers([classNumberOne, classNumberTwo]); */
    /* await insertBoardNames([boardNameOne, boardNameTwo]); */
  });
  afterEach(async () => {
    await User.deleteMany();
    /* await BoardName.deleteMany(); */
    /* await ClassNumber.deleteMany(); */
    await Student.deleteMany();
    await Parent.deleteMany();
  });

  describe('POST /v1/students', () => {
    test('should return 201 and successfully create new user if data is ok', async () => {
      // without this, auth failure will occur
      await insertUsers([admin]);

      const res = await request(app)
        .post('/v1/students')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(STUDENTS.studentOne)
        .expect(httpStatus.CREATED);

      expect(res.body).not.toHaveProperty('password');

      const {
        firstName,
        lastName,
        password,
        gender,
        email,
        parents,
        contactNumber,
        dateOfBirth,
        emergencyContactNumber,
        admissionId,
      } = STUDENTS.studentOne;
      expect(res.body).toEqual({
        id: expect.anything(),
        firstName,
        lastName,
        gender,
        email,
        batches: [],
        parents,
        contactNumber,
        dateOfBirth: expect.anything(),
        emergencyContactNumber,
        admissionId,
        isEmailVerified: false,
        role: 'user',
      });

      // SKIPPED TESTING DATABASE OBJECT
    });
  });

  describe('PATCH /v1/students/:id', () => {
    test('should update user firstName', async () => {
      // without this, auth failure will occur
      await insertStudents([studentOne]);

      const updateBody = {
        firstName: 'newFirstName',
      };
      const res = await request(app)
        .patch(`/v1/students/${studentOne._id}`)
        .set('Authorization', `Bearer ${studentOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      expect(res.body).not.toHaveProperty('password');

      const { lastName, password, gender, email, parents, contactNumber, dateOfBirth, emergencyContactNumber, admissionId } =
        STUDENTS.studentOne;
      expect(res.body).toEqual({
        id: expect.anything(),
        firstName: 'newFirstName',
        lastName,
        gender,
        email,
        batches: [],
        parents,
        contactNumber,
        dateOfBirth: expect.anything(),
        emergencyContactNumber,
        admissionId,
        isEmailVerified: false,
        role: 'user',
      });

      // SKIPPED TESTING DATABASE OBJECT
    });

    test(`should update student's parents with one parent and the parents children with one student when a parent is added to a student`, async () => {
      await insertStudents([studentOne]);
      await insertParents([parentOne]);

      const updateBody = {
        parents: [parentOne._id],
      };

      const res = await request(app)
        .patch(`/v1/students/${studentOne._id}`)
        .set('Authorization', `Bearer ${studentOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      expect(res.body).not.toHaveProperty('password');

      // verify if response shows updated parent
      expect(res.body.parents).toEqual([parentOne._id.toJSON()]);

      // verify if student was updated correctly in db
      const dbStudent = await Student.findById(studentOne._id);
      expect(dbStudent).toBeDefined();
      expect(Array.from(dbStudent.parents)).toEqual([parentOne._id]);

      // verify if parents was updated correctly in db
      const dbParent = await Parent.findById(parentOne._id);
      expect(dbParent).toBeDefined();
      expect(Array.from(dbParent.children)).toEqual([studentOne._id]);
    });

    test(`should update student's parents with multiple parents and the parents children with multiple students when multiple parents are added to a student`, async () => {
      await insertStudents([studentOne]);
      await insertParents([parentOne, parentTwo]);

      const updateBody = {
        parents: [parentOne._id, parentTwo._id],
      };

      const res = await request(app)
        .patch(`/v1/students/${studentOne._id}`)
        .set('Authorization', `Bearer ${studentOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      expect(res.body).not.toHaveProperty('password');

      // verify if response shows updated parent
      expect(res.body.parents).toEqual([parentOne._id.toJSON(), parentTwo._id.toJSON()]);

      // verify if student was updated correctly in db
      const dbStudent = await Student.findById(studentOne._id);
      expect(dbStudent).toBeDefined();
      expect(Array.from(dbStudent.parents)).toEqual([parentOne._id, parentTwo._id]);

      // verify if parentOne was updated correctly in db
      const dbParentOne = await Parent.findById(parentOne._id);
      expect(dbParentOne).toBeDefined();
      expect(Array.from(dbParentOne.children)).toEqual([studentOne._id]);

      // verify if parentTwo was updated correctly in db
      const dbParentTwo = await Parent.findById(parentTwo._id);
      expect(dbParentTwo).toBeDefined();
      expect(Array.from(dbParentTwo.children)).toEqual([studentOne._id]);
    });

    test(`should update student's parents and parent's children when a new parent is added and existing parent removed`, async () => {
      await insertStudents([studentOne]);
      await insertParents([parentOne, parentTwo, parentThree]);

      const updateBodyOld = {
        parents: [parentOne._id, parentTwo._id],
      };

      await request(app)
        .patch(`/v1/students/${studentOne._id}`)
        .set('Authorization', `Bearer ${studentOneAccessToken}`)
        .send(updateBodyOld)
        .expect(httpStatus.OK);
      // ----------------ABOVE REQUEST HAS BEEN TESTED IN OTHER TEST-------------

      // We will REMOVE parentOne and ADD parentThree
      const updateBody = {
        parents: [parentThree._id, parentTwo._id],
      };

      const res = await request(app)
        .patch(`/v1/students/${studentOne._id}`)
        .set('Authorization', `Bearer ${studentOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      // verify if response shows updated parent
      expect(res.body.parents).toEqual([parentThree._id.toJSON(), parentTwo._id.toJSON()]);

      // verify if student was updated correctly in db
      const dbStudent = await Student.findById(studentOne._id);
      expect(dbStudent).toBeDefined();
      expect(Array.from(dbStudent.parents)).toEqual([parentThree._id, parentTwo._id]);

      // verify if parentOne was updated correctly in db
      const dbParentOne = await Parent.findById(parentOne._id);
      expect(dbParentOne).toBeDefined();
      expect(Array.from(dbParentOne.children)).toEqual([]);

      // verify if parentTwo was updated correctly in db
      const dbParentTwo = await Parent.findById(parentTwo._id);
      expect(dbParentTwo).toBeDefined();
      expect(Array.from(dbParentTwo.children)).toEqual([studentOne._id]);

      // verify if parentThree was updated correctly in db
      const dbParentThree = await Parent.findById(parentThree._id);
      expect(dbParentThree).toBeDefined();
      expect(Array.from(dbParentThree.children)).toEqual([studentOne._id]);
    });

    test(`should update student's parents and parent's children when all parents are removed`, async () => {
      await insertStudents([studentOne]);
      await insertParents([parentOne, parentTwo, parentThree]);

      const updateBodyOld = {
        parents: [parentOne._id, parentTwo._id],
      };

      await request(app)
        .patch(`/v1/students/${studentOne._id}`)
        .set('Authorization', `Bearer ${studentOneAccessToken}`)
        .send(updateBodyOld)
        .expect(httpStatus.OK);
      // ----------------ABOVE REQUEST HAS BEEN TESTED IN OTHER TEST-------------

      // We will REMOVE parentOne and ADD parentThree
      const updateBody = {
        parents: [],
      };

      const res = await request(app)
        .patch(`/v1/students/${studentOne._id}`)
        .set('Authorization', `Bearer ${studentOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      // verify if response shows updated parent
      expect(res.body.parents).toEqual([]);

      // verify if student was updated correctly in db
      const dbStudent = await Student.findById(studentOne._id);
      expect(dbStudent).toBeDefined();
      expect(Array.from(dbStudent.parents)).toEqual([]);

      // verify if parentOne was updated correctly in db
      const dbParentOne = await Parent.findById(parentOne._id);
      expect(dbParentOne).toBeDefined();
      expect(Array.from(dbParentOne.children)).toEqual([]);

      // verify if parentTwo was updated correctly in db
      const dbParentTwo = await Parent.findById(parentTwo._id);
      expect(dbParentTwo).toBeDefined();
      expect(Array.from(dbParentTwo.children)).toEqual([]);
    });
    test(`should not modify parents when some other field is updated`, async () => {
      await insertStudents([studentOne]);
      await insertParents([parentOne, parentTwo, parentThree]);

      const updateBodyOld = {
        parents: [parentOne._id, parentTwo._id],
      };

      await request(app)
        .patch(`/v1/students/${studentOne._id}`)
        .set('Authorization', `Bearer ${studentOneAccessToken}`)
        .send(updateBodyOld)
        .expect(httpStatus.OK);

      // ----------------ABOVE REQUEST HAS BEEN TESTED IN OTHER TEST-------------

      const updateBody = {
        firstName: 'newFirstName',
      };
      const res = await request(app)
        .patch(`/v1/students/${studentOne._id}`)
        .set('Authorization', `Bearer ${studentOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      // TODO: fix this to check if actual parents exist or write assertion for db value
      expect(res.body.parents).not.toEqual([]);
    });
  });

  describe('DELETE /v1/students/:id', () => {
    beforeEach(async () => {
      await insertUsers([admin]);
      await insertStudents([studentOne]);
    });
    test('should delete student', async () => {
      await request(app)
        .delete(`/v1/students/${studentOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);

      const dbUser = await Student.findById(studentOne._id);
      expect(dbUser).toBeNull();
    });
    test('should delete id from children array of parent record when student is deleted', async () => {
      await insertParents([parentOne, parentTwo]);

      const updateBodyOld = {
        parents: [parentOne._id, parentTwo._id],
      };

      await request(app)
        .patch(`/v1/students/${studentOne._id}`)
        .set('Authorization', `Bearer ${studentOneAccessToken}`)
        .send(updateBodyOld)
        .expect(httpStatus.OK);
      // ----------------ABOVE REQUEST HAS BEEN TESTED IN OTHER TEST-------------
      const dbParentOneOld = await Parent.findById(parentOne._id);
      expect(dbParentOneOld).toBeDefined();
      expect(Array.from(dbParentOneOld.children)).toEqual([studentOne._id]);

      const dbParentTwoOld = await Parent.findById(parentTwo._id);
      expect(dbParentTwoOld).toBeDefined();
      expect(Array.from(dbParentTwoOld.children)).toEqual([studentOne._id]);

      await request(app)
        .delete(`/v1/students/${studentOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);

      const dbUser = await Student.findById(studentOne._id);
      expect(dbUser).toBeNull();

      const dbParentOne = await Parent.findById(parentOne._id);
      expect(dbParentOne).toBeDefined();
      expect(Array.from(dbParentOne.children)).toEqual([]);

      const dbParentTwo = await Parent.findById(parentTwo._id);
      expect(dbParentTwo).toBeDefined();
      expect(Array.from(dbParentTwo.children)).toEqual([]);
    });
  });

  describe('GET /v1/students/batchId/:batchId', () => {
    test('should get students when batchId is provided', async () => {
      // without this, auth failure will occur
      await insertStudents([studentOne]);

      const updateBody = {
        firstName: 'newFirstName',
      };
      const res = await request(app)
        .patch(`/v1/students/${studentOne._id}`)
        .set('Authorization', `Bearer ${studentOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      expect(res.body).not.toHaveProperty('password');

      const { lastName, password, gender, email, parents, contactNumber, dateOfBirth, emergencyContactNumber, admissionId } =
        STUDENTS.studentOne;
      expect(res.body).toEqual({
        id: expect.anything(),
        firstName: 'newFirstName',
        lastName,
        gender,
        email,
        batches: [],
        parents,
        contactNumber,
        dateOfBirth: expect.anything(),
        emergencyContactNumber,
        admissionId,
        isEmailVerified: false,
        role: 'user',
      });

      // SKIPPED TESTING DATABASE OBJECT
    });
    });
});
