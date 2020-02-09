module.exports = {
  username: {
    in: ['body'],
    exists: {
      errorMessage: 'username is required.'
    },
    isLength: {
      errorMessage: 'username can be maximum 100 character long.',
      options: { max: 100 }
    }
  },
  password: {
    in: ['body'],
    exists: {
      errorMessage: 'password is required.'
    },
    isLength: {
      errorMessage: 'password can be maximum 100 character long.',
      options: { max: 100 }
    }
  }
};
