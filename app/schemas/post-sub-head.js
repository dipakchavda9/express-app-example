module.exports = {
  head_id: {
    in: ['body'],
    exists: {
      errorMessage: 'head_id is required.'
    },
    isInt: {
      errorMessage: "head_id must be integer.",
      options: { min:1, max: 2147483647 }
    },
  },
  name: {
    in: ['body'],
    exists: {
      errorMessage: 'Name is required.'
    },
    isLength: {
      errorMessage: 'Name can be maximum 250 character long.',
      options: { max: 250 }
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
