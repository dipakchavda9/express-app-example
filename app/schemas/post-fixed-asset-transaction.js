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
  last_year_balance: {
    in: ['body'],
    optional: true,
    isDecimal: {
      errorMessage: "last_year_balance must be valid amount.",
      options: { min:1, max: 2147483647 }
    }
  },
};
