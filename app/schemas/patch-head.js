module.exports = {
  id: {
    in: ['params'],
    isInt: {
      errorMessage: "'id' must be integer.",
      options: { min:1, max: 2147483647 }
    },
    exists: {
      errorMessage: "'id' is required."
    }
  },
  name: {
    in: ['body'],
    optional: true,
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
    optional: true,
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