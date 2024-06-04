// NOT FIXED, ONLY COPIED FROM USER
const faker = require('faker');
const { Student } = require('../../../src/models');

describe('Student model', () => {
  describe('Student validation', () => {
    let newStudent;
    beforeEach(() => {
      newStudent = {
        name: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
        password: 'password1',
        role: 'student',
      };
    });

    test('should correctly validate a valid student', async () => {
      await expect(new Student(newStudent).validate()).resolves.toBeUndefined();
    });

    test('should throw a validation error if email is invalid', async () => {
      newStudent.email = 'invalidEmail';
      await expect(new Student(newStudent).validate()).rejects.toThrow();
    });

    test('should throw a validation error if password length is less than 8 characters', async () => {
      newStudent.password = 'passwo1';
      await expect(new Student(newStudent).validate()).rejects.toThrow();
    });

    test('should throw a validation error if password does not contain numbers', async () => {
      newStudent.password = 'password';
      await expect(new Student(newStudent).validate()).rejects.toThrow();
    });

    test('should throw a validation error if password does not contain letters', async () => {
      newStudent.password = '11111111';
      await expect(new Student(newStudent).validate()).rejects.toThrow();
    });

    test('should throw a validation error if role is unknown', async () => {
      newStudent.role = 'invalid';
      await expect(new Student(newStudent).validate()).rejects.toThrow();
    });
  });

  describe('Student toJSON()', () => {
    test('should not return student password when toJSON is called', () => {
      const newStudent = {
        name: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
        password: 'password1',
        role: 'student',
      };
      expect(new Student(newStudent).toJSON()).not.toHaveProperty('password');
    });
  });
});
