const faker = require('faker');
const { ClassNumber } = require('../../../src/models');
const { CLASS_NUMBERS } = require('../../data/classNumber');

describe('ClassNumber model', () => {
  describe('ClassNumber validation', () => {
    let newClassNumber;
    beforeEach(() => {
      newClassNumber = CLASS_NUMBERS.classNumberOne;
    });

    /* test('should correctly validate a valid classNumber', async () => { */
    /*   await expect(new ClassNumber(newClassNumber).validate()).resolves.toBeUndefined(); */
    /* }); */
  });

  describe('ClassNumber toJSON()', () => {
    test('should return classNumber when toJSON is called', () => {
      const newClassNumber = CLASS_NUMBERS.classNumberTwo;
      const newClassNumberJSON = new ClassNumber(newClassNumber).toJSON();

      const { classNumber} = CLASS_NUMBERS.classNumberTwo;

      const expected = {
        classNumber,
        id: expect.anything(),
      };

      expect(newClassNumberJSON).toEqual(expected);
    });
  });
});
