module.exports = {
  date: {
    in: ['query'],
    exists: {
      errorMessage: "date is required."
    },
    matches: {
      errorMessage: "Invalid date.",
      options: [
        [
          "^\\d{4}\\-\\d{2}\\-\\d{2}$"
        ]
      ]
    },
    isISO8601 : {
      errorMessage: "Invalid date.",
    }
  }
};
