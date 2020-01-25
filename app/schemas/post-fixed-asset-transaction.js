module.exports = {
  sub_head_id: {
    in: ['body'],
    exists: {
      errorMessage: "sub_head_id is required."
    },
    isInt: {
      errorMessage: "sub_head_id must be integer.",
      options: { min:1, max: 2147483647 }
    }
  },
  financial_year: {
    in: ['body'],
    optional: true,
    matches: {
      errorMessage: "Invalid financial_year.",
      options: [
        [
          "^\\d{4}\\-\\d{4}$"
        ]
      ]
    }
  },
  user_id: {
    in: ['body'],
    exists: {
      errorMessage: "user_id is required."
    },
    isInt: {
      errorMessage: "user_id must be integer.",
      options: { min:1, max: 2147483647 }
    }
  },
  trn_type: {
    in: ['body'],
    exists: {
      errorMessage: "trn_type is required."
    },
    isIn: {
      errorMessage: "trn_type can be either 'C' or 'D'",
      options: [
        [
          'C',
          'D'
        ]
      ]
    }
  },
  amount: {
    in: ['body'],
    exists: {
      errorMessage: "amount is required."
    },
    isNumeric: {
      errorMessage: "Invalid amount."
    }
  }
};
