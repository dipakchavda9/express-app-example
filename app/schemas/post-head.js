module.exports = {
  name: {
    in: ['body'],
    exists: {
      errorMessage: 'Name is required.'
    },
    isAlphanumeric: {
      errorMessage: 'Name must be Alpha Numeric.'
    },
    isLength: {
      errorMessage: 'Name can be maximum 250 character long.',
      // Multiple options would be expressed as an array
      options: { max: 250 }
    }
  },
  type: {
    in: ['body'],
    exists: {
      errorMessage: 'Type is required.'
    },
    isIn: {
      errorMessage: "Type can be either 'F' or 'P'",
      options: [
        [
          'F',
          'P'
        ]
      ]
    }
  },
  status: {
    in: ['body'],
    optional: true,
    isBoolean: {
      errorMessage: "Status can be either true or false."
    }
  }
};
