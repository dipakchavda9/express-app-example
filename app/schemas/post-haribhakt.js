module.exports = {
  firstname: {
    in: ['body'],
    exists: {
      errorMessage: "firstname is required."
    },
    isLength: {
      errorMessage: 'firstname can be maximum 255 character long.',
      options: { max: 255 }
    }
  },
  lastname: {
    in: ['body'],
    exists: {
      errorMessage: "lastname is required."
    },
    isLength: {
      errorMessage: 'lastname can be maximum 255 character long.',
      options: { max: 255 }
    }
  },
  address_current: {
    in: ['body'],
    optional: true,
    isLength: {
      errorMessage: 'address_current can be maximum 1000 character long.',
      options: { max: 1000 }
    }
  },
  address_native: {
    in: ['body'],
    optional: true,
    isLength: {
      errorMessage: 'address_native can be maximum 1000 character long.',
      options: { max: 1000 }
    }
  },
};
