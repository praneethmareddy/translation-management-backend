const faker = require('faker');
const { Subject } = require('../../../src/models');
const { SUBJECTS } = require('../../data/subject');

describe('Subject model', () => {
  describe('Subject validation', () => {
    let newSubject;
    beforeEach(() => {
      newSubject = SUBJECTS.subjectOne;
    });

    /* test('should correctly validate a valid subject', async () => { */
    /*   await expect(new Subject(newSubject).validate()).resolves.toBeUndefined(); */
    /* }); */
  });

  describe('Subject toJSON()', () => {
    test('should return subject when toJSON is called', () => {
      const newSubject = SUBJECTS.subjectTwo;
      const newSubjectJSON = new Subject(newSubject).toJSON();

      const expected = {
        id: expect.anything(),
        ...SUBJECTS.subjectTwo,
        teachers: [],
      };

      expect(newSubjectJSON).toEqual(expected);
    });
  });
});
