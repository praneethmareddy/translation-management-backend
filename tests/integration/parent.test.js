const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const mongoose = require('mongoose');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { Student, Parent } = require('../../src/models');
const { userOne, userTwo, admin, insertUsers } = require('../fixtures/user.fixture');
const { studentOne, studentTwo, studentThree, studentFour, insertStudents } = require('../fixtures/student.fixture');
const { parentOne, parentTwo, parentThree, parentFour, insertParents } = require('../fixtures/parent.fixture');
const {
  userOneAccessToken,
  adminAccessToken,
  studentOneAccessToken,
  parentOneAccessToken,
} = require('../fixtures/token.fixture');
const { STUDENTS, PARENTS } = require('../data/student');

/* const Parent = mongoose.model('Parent'); */
/* const Student = mongoose.model('Student'); */

setupTestDB();
const doArraysIntersect = (array1, array2) => array1.some((item1) => array2.includes(item1));

describe('Parent routes', () => {
  beforeEach(() => {});
  afterEach(async () => {
    await Student.deleteMany();
    await Parent.deleteMany();
  });

  describe('POST /v1/parents', () => {
    test('should return 201 and successfully create new user if data is ok', async () => {
      // without this, auth failure will occur
      await insertUsers([admin]);

      const res = await request(app)
        .post('/v1/parents')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(PARENTS.parentOne)
        .expect(httpStatus.CREATED);

      expect(res.body).not.toHaveProperty('password');

      const { firstName, lastName, gender, email, contactNumber, children } = PARENTS.parentOne;
      expect(res.body).toEqual({
        id: expect.anything(),
        firstName,
        lastName,
        gender,
        email,
        contactNumber,
        children,
        isEmailVerified: false,
        role: 'user',
      });

      // SKIPPED TESTING DATABASE OBJECT
    });
  });

  describe('PATCH /v1/parents/:id', () => {
    test('should update parent firstName', async () => {
      // without this, auth failure will occur
      await insertParents([parentOne]);

      const updateBody = {
        firstName: 'newFirstName',
      };
      const res = await request(app)
        .patch(`/v1/parents/${parentOne._id}`)
        .set('Authorization', `Bearer ${parentOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      expect(res.body).not.toHaveProperty('password');

      const { firstName, lastName, gender, email, contactNumber, children } = PARENTS.parentOne;
      expect(res.body).toEqual({
        id: expect.anything(),
        firstName: 'newFirstName',
        lastName,
        gender,
        email,
        contactNumber,
        children,
        isEmailVerified: false,
        role: 'user',
      });

      // SKIPPED TESTING DATABASE OBJECT
    });

    test(`should update parent's children with one child and the students parent with one parent when a child is added to a parent`, async () => {
      await insertStudents([studentOne]);
      await insertParents([parentOne]);

      const updateBody = {
        children: [studentOne._id],
      };

      const res = await request(app)
        .patch(`/v1/parents/${parentOne._id}`)
        .set('Authorization', `Bearer ${parentOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      expect(res.body).not.toHaveProperty('password');

      // verify if response shows updated parent
      expect(res.body.children).toEqual([studentOne._id.toJSON()]);

      // verify if student was updated correctly in db
      const dbStudent = await Student.findById(studentOne._id);
      expect(dbStudent).toBeDefined();
      expect(Array.from(dbStudent.parents)).toEqual([parentOne._id]);

      // verify if parents was updated correctly in db
      const dbParent = await Parent.findById(parentOne._id);
      expect(dbParent).toBeDefined();
      expect(Array.from(dbParent.children)).toEqual([studentOne._id]);
    });

    test(`should update parent's children with multiple children and the students parent with multiple parents when multiple children are added to a parent`, async () => {
      await insertParents([parentOne]);
      await insertStudents([studentOne, studentTwo]);

      const updateBody = {
        children: [studentOne._id, studentTwo._id],
      };

      const res = await request(app)
        .patch(`/v1/parents/${parentOne._id}`)
        .set('Authorization', `Bearer ${parentOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      expect(res.body).not.toHaveProperty('password');

      // verify if response shows updated parent
      expect(res.body.children).toEqual([studentOne._id.toJSON(), studentTwo._id.toJSON()]);

      // verify if student was updated correctly in db
      const dbStudentOne = await Student.findById(studentOne._id);
      expect(dbStudentOne).toBeDefined();
      expect(Array.from(dbStudentOne.parents)).toEqual([parentOne._id]);

      // verify if student was updated correctly in db
      const dbStudentTwo = await Student.findById(studentTwo._id);
      expect(dbStudentTwo).toBeDefined();
      expect(Array.from(dbStudentTwo.parents)).toEqual([parentOne._id]);

      // verify if parentOne was updated correctly in db
      const dbParentOne = await Parent.findById(parentOne._id);
      expect(dbParentOne).toBeDefined();
      expect(Array.from(dbParentOne.children)).toEqual([studentOne._id, studentTwo._id]);
    });

    test(`should update student's parents and parent's children when a new parent is added and existing parent removed`, async () => {
      await insertParents([parentOne]);
      await insertStudents([studentOne, studentTwo, studentThree]);

      const updateBodyOld = {
        children: [studentOne._id, studentTwo._id],
      };

      await request(app)
        .patch(`/v1/parents/${parentOne._id}`)
        .set('Authorization', `Bearer ${parentOneAccessToken}`)
        .send(updateBodyOld)
        .expect(httpStatus.OK);

      // ----------------ABOVE REQUEST HAS BEEN TESTED IN OTHER TEST-------------

      // We will REMOVE parentOne and ADD parentThree
      const updateBody = {
        children: [studentThree._id, studentTwo._id],
      };

      const res = await request(app)
        .patch(`/v1/parents/${parentOne._id}`)
        .set('Authorization', `Bearer ${parentOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      // verify if response shows updated parent
      expect(res.body.children).toEqual([studentThree._id.toJSON(), studentTwo._id.toJSON()]);

      // verify if student was updated correctly in db
      const dbStudentOne = await Student.findById(studentOne._id);
      expect(dbStudentOne).toBeDefined();
      expect(Array.from(dbStudentOne.parents)).toEqual([]);

      // verify if student was updated correctly in db
      const dbStudentTwo = await Student.findById(studentTwo._id);
      expect(dbStudentTwo).toBeDefined();
      expect(Array.from(dbStudentTwo.parents)).toEqual([parentOne._id]);

      // verify if student was updated correctly in db
      const dbStudentThree = await Student.findById(studentThree._id);
      expect(dbStudentThree).toBeDefined();
      expect(Array.from(dbStudentThree.parents)).toEqual([parentOne._id]);

      // verify if parentOne was updated correctly in db
      const dbParentOne = await Parent.findById(parentOne._id);
      expect(dbParentOne).toBeDefined();
      expect(Array.from(dbParentOne.children)).toEqual([studentThree._id, studentTwo._id]);
    });

    test(`should update student's parents and parent's children when all parents are removed`, async () => {
      await insertParents([parentOne]);
      await insertStudents([studentOne, studentTwo, studentThree]);

      const updateBodyOld = {
        children: [studentOne._id, studentTwo._id],
      };

      await request(app)
        .patch(`/v1/parents/${parentOne._id}`)
        .set('Authorization', `Bearer ${parentOneAccessToken}`)
        .send(updateBodyOld)
        .expect(httpStatus.OK);

      // ----------------ABOVE REQUEST HAS BEEN TESTED IN OTHER TEST-------------

      // We will REMOVE all
      const updateBody = {
        children: [],
      };

      const res = await request(app)
        .patch(`/v1/parents/${parentOne._id}`)
        .set('Authorization', `Bearer ${parentOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      // verify if response shows updated parent
      expect(res.body.children).toEqual([]);

      // verify if student was updated correctly in db
      const dbStudentOne = await Student.findById(studentOne._id);
      expect(dbStudentOne).toBeDefined();
      expect(Array.from(dbStudentOne.parents)).toEqual([]);

      // verify if student was updated correctly in db
      const dbStudentTwo = await Student.findById(studentTwo._id);
      expect(dbStudentTwo).toBeDefined();
      expect(Array.from(dbStudentTwo.parents)).toEqual([]);

      // verify if parentOne was updated correctly in db
      const dbParentOne = await Parent.findById(parentOne._id);
      expect(dbParentOne).toBeDefined();
      expect(Array.from(dbParentOne.children)).toEqual([]);
    });
    test(`should not modify children when some other field is updated`, async () => {
      await insertParents([parentOne]);
      await insertStudents([studentOne, studentTwo, studentThree]);

      const updateBodyOld = {
        children: [studentOne._id, studentTwo._id],
      };

      await request(app)
        .patch(`/v1/parents/${parentOne._id}`)
        .set('Authorization', `Bearer ${parentOneAccessToken}`)
        .send(updateBodyOld)
        .expect(httpStatus.OK);

      // ----------------ABOVE REQUEST HAS BEEN TESTED IN OTHER TEST-------------

      const updateBody = {
        firstName: 'newFirstName',
      };
      const res = await request(app)
        .patch(`/v1/parents/${parentOne._id}`)
        .set('Authorization', `Bearer ${parentOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      // TODO: fix this to check if actual children exist
      expect(res.body.children).not.toEqual([]);
    });
  });

  describe('DELETE /v1/parents/:id', () => {
    beforeEach(async () => {
      await insertUsers([admin]);
      await insertParents([parentOne]);
    });
    test('should delete parent', async () => {
      await request(app)
        .delete(`/v1/parents/${parentOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);

      const dbUser = await Parent.findById(parentOne._id);
      expect(dbUser).toBeNull();
    });
    test('should delete id from parents array of student record when parent is deleted', async () => {
      await insertStudents([studentOne, studentTwo]);

      const updateBodyOld = {
        children: [studentOne._id, studentTwo._id],
      };

      await request(app)
        .patch(`/v1/parents/${parentOne._id}`)
        .set('Authorization', `Bearer ${parentOneAccessToken}`)
        .send(updateBodyOld)
        .expect(httpStatus.OK);
      // ----------------ABOVE REQUEST HAS BEEN TESTED IN OTHER TEST-------------
      const dbParentOneOld = await Parent.findById(parentOne._id);
      expect(dbParentOneOld).toBeDefined();
      expect(Array.from(dbParentOneOld.children)).toEqual([studentOne._id, studentTwo._id]);

      await request(app)
        .delete(`/v1/parents/${parentOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);

      const dbUser = await Parent.findById(parentOne._id);
      expect(dbUser).toBeNull();

      const dbStudentOne = await Student.findById(studentOne._id);
      expect(dbStudentOne).toBeDefined();
      expect(Array.from(dbStudentOne.parents)).toEqual([]);

      const dbStudentTwo = await Student.findById(studentTwo._id);
      expect(dbStudentTwo).toBeDefined();
      expect(Array.from(dbStudentTwo.parents)).toEqual([]);
    });
  });
});
