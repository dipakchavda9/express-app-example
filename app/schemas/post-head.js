module.exports = {
  name: {
    in: ['body'],
    exists: {
      errorMessage: 'Name is required.'
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
  transaction_type: {
    in: ['body'],
    exists: {
      errorMessage: 'transaction_type is required.'
    },
    isIn: {
      errorMessage: "transaction_type can be either 'C' or 'D'",
      options: [
        [
          'C',
          'D'
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
