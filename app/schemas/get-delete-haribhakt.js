module.exports = {
  mobile: {
    in: ['query'],
    isMobilePhone: {
      errorMessage: "Invalid mobile number."
    },
    exists: {
      errorMessage: "mobile is required."
    }
  }
};
