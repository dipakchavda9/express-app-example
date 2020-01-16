module.exports = {
  id: {
    in: ['params'],
    isInt: {
      errorMessage: "id must be integer.",
      options: { min:1, max: 2147483647 }
    },
    exists: {
      errorMessage: "id is required."
    }
  },
  head_id: {
    in: ['body'],
    optional: true,
    isInt: {
      errorMessage: "head_id must be integer.",
      options: { min:1, max: 2147483647 }
    },
  },
  name: {
    in: ['body'],
    optional: true,
    matches: {
      errorMessage: "Name can't contain special characters.",
      options: [
        [
          '^[a-zA-Z0-9 ]+$'
        ]
      ]
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
