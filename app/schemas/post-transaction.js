module.exports = {
  haribhakt_id: {
    in: ['body'],
    optional: true,
    isInt: {
      errorMessage: "haribhakt_id must be integer.",
      options: { min:1, max: 2147483647 }
    }
  },
  description: {
    in: ['body'],
    optional: true,
    isLength: {
      errorMessage: 'description can be maximum 1000 character long.',
      options: { max: 1000 }
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
  transactions: {
    in: ['body'],
    exists: {
      errorMessage: "transactions is required."
    },
    custom: {
      options: (value, { req, location, path }) => {
        if (!Array.isArray(value)) {
          return Promise.reject('transactions must be array.');
        }
        var i = 0;
        while (i < value.length) {
          if (!value[i].sub_head_id || !value[i].amount) {
            return Promise.reject('One or more transactions are invalid.');
          }
          if (!Number.isInteger(+value[i].sub_head_id)) {
            return Promise.reject('One or more transactions are invalid.');
          }
          if (+value[i].sub_head_id <= 0) {
            return Promise.reject('One or more transactions are invalid.');
          }
          if (isNaN(value[i].amount)) {
            return Promise.reject('One or more transactions are invalid.');
          }
          if (+value[i].amount <= 0) {
            return Promise.reject('One or more transactions are invalid.');
          }
          i++;
        }
        return true;
      }
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
  trn_date: {
    in: ['body'],
    optional: true,
    matches: {
      errorMessage: "Invalid trn_date.",
      options: [
        [
          "^\\d{4}\\-\\d{2}\\-\\d{2} \\d{2}:\\d{2}:\\d{2}$"
        ]
      ]
    },
    isISO8601 : {
      errorMessage: "Invalid trn_date.",
    }
  },
  voucher_id: {
    in: ['body'],
    optional: true,
    isInt: {
      errorMessage: "voucher_id must be integer.",
      options: { min:1, max: 9223372036854775807 }
    }
  },
  bill_no: {
    in: ['body'],
    optional: true,
    isLength: {
      errorMessage: 'bill_no can be maximum 100 character long.',
      options: { max: 100 }
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
  }
};
