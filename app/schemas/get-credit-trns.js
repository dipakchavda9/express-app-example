module.exports = {
  start_date: {
    in: ['query'],
    exists: {
      errorMessage: "start_date is required."
    },
    matches: {
      errorMessage: "Invalid start_date.",
      options: [
        [
          "^\\d{4}\\-\\d{2}\\-\\d{2}$"
        ]
      ]
    },
    isISO8601 : {
      errorMessage: "Invalid start_date.",
    }
  },
  end_date: {
    in: ['query'],
    exists: {
      errorMessage: "end_date is required."
    },
    matches: {
      errorMessage: "Invalid end_date.",
      options: [
        [
          "^\\d{4}\\-\\d{2}\\-\\d{2}$"
        ]
      ]
    },
    isISO8601 : {
      errorMessage: "Invalid end_date.",
    }
  }
};
