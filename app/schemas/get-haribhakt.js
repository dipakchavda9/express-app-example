module.exports = {
  mobile: {
    in: ['query'],
    isMobilePhone: {
      errorMessage: "Invalid mobile number."
    },
    optional: true
  },
  village: {
    in: ['query'],
    isInt: {
      errorMessage: "village_native must be integer.",
      options: { min:1, max: 2147483647 }
    },
    optional: true
  }
};
