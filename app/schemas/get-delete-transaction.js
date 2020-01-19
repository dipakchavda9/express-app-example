module.exports = {
  id: {
    in: ['params'],
    isInt: {
      errorMessage: "id must be integer.",
      options: { min:1, max: 9223372036854775807 }
    },
    exists: {
      errorMessage: "id is required."
    }
  }
};
