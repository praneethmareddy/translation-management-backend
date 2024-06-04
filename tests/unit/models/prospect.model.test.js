const faker = require('faker');
const { Prospect } = require('../../../src/models');
const { PROSPECTS } = require('../../data/prospect');

describe('Prospect model', () => {
  describe('Prospect validation', () => {
    let newProspect;
    beforeEach(() => {
      newProspect = PROSPECTS.prospectOne;
    });

    test('should correctly validate a valid prospect', async () => {
      await expect(new Prospect(newProspect).validate()).resolves.toBeUndefined();
    });

    test('should throw a validation error if email is invalid', async () => {
      newProspect.email = 'invalidEmail';
      await expect(new Prospect(newProspect).validate()).rejects.toThrow();
    });
  });

  describe('Prospect toJSON()', () => {
    test('should return prospect when toJSON is called', () => {
      const newProspect = PROSPECTS.prospectTwo;
      const newProspectJSON = new Prospect(newProspect).toJSON();

      const expected = {
        batches: [],
        subjects: [],
        firstName: 'b',
        email: 'b@b.com',
        contactNumber: '753',
        dateOfBirth: expect.anything(),
        dateOfInquiry: expect.anything(),
        parents: [],
        id: expect.anything(),
      };

      expect(newProspectJSON).toEqual(expected);
    });
  });
});
