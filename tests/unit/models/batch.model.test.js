const faker = require('faker');
const { Batch } = require('../../../src/models');
const { BATCHES } = require('../../data/batch');

describe('Batch model', () => {
  describe('Batch validation', () => {
    let newBatch;
    beforeEach(() => {
      newBatch = BATCHES.batchOne;
    });

    test('should correctly validate a valid batch', async () => {
      await expect(new Batch(newBatch).validate()).resolves.toBeUndefined();
    });
  });

  describe('Batch toJSON()', () => {
    test('should return batch when toJSON is called', () => {
      const newBatch = BATCHES.batchTwo;
      const newBatchJSON = new Batch(newBatch).toJSON();

      const { batchName, batchTime, boardName, fees, language } = BATCHES.batchTwo;

      const expected = {
        batchName,
        batchTime,
        boardName,
        fees,
        language,
        subjects: [],
        students: [],
        teachers: [],
        id: expect.anything(),
      };

      expect(newBatchJSON).toEqual(expected);
    });
  });
});
