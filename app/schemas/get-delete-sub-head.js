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
  }
};
