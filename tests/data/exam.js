const EXAMS = {
  examOne: {
    questions: [
      {
        question: {
          type: 'text',
          content: 'Content 1',
        },
        answer: {
          type: 'text',
          placeholder: 'Placeholder 1',
          content: [],
          note: 'Note 1',
        },
      },
      {
        question: {
          type: 'image',
          content: 'Image Content 2',
        },
        answer: {
          type: 'dropdown',
          placeholder: '',
          content: [
            {
              choice: 'choice 1',
              note: 'note for choice 1',
            },
            {
              choice: 'choice 2',
              note: 'note for choice 2',
            },
          ],
          note: '',
        },
      },
    ],
  },
  examTwo: [
    {
      question: {
        type: 'text',
        content: 'Content 1',
      },
      answer: {
        type: 'text',
        placeholder: 'Placeholder 1',
        content: [],
        note: 'Note 1',
      },
    },
  ],
  examThree: [
    {
      question: {
        type: 'text',
        content: 'Content 1',
      },
      answer: {
        type: 'text',
        placeholder: 'Placeholder 1',
        content: [],
        note: 'Note 1',
      },
    },
  ],
  examFour: [
    {
      question: {
        type: 'text',
        content: 'Content 1',
      },
      answer: {
        type: 'text',
        placeholder: 'Placeholder 1',
        content: [],
        note: 'Note 1',
      },
    },
  ],
  examFive: {
    questions: [
      {
        question: {
          type: 'text',
          content: 'q1',
        },
        answer: {
          type: 'dropdown',
          placeholder: '',
          content: [
            {
              choice: 'c',
              note: '',
            },
            {
              choice: 'd',
              note: '',
            },
            {
              choice: 'b',
              note: '',
            },
          ],
          note: '',
          correctChoice: 'c',
        },
      },
    ],
  },
  examSix: {
    questions: [
      {
        question: {
          type: 'text',
          content: 'q1',
        },
        answer: {
          type: 'dropdown',
          placeholder: '',
          content: [
            {
              choice: 'c1',
              note: 'n1',
            },
            {
              choice: 'c2',
              note: 'n2',
            },
          ],
          note: '',
          correctChoice: 'c1',
        },
      },
    ],
  },
};

module.exports = { EXAMS };
