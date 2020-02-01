module.exports = {
  name: {
    in: ['body'],
    exists: {
      errorMessage: "name is required."
    },
    isLength: {
      errorMessage: 'name can be maximum 255 character long.',
      options: { max: 255 }
    }
  }
};
