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
  },
  firstname: {
    in: ['body'],
    optional: true,
    isLength: {
      errorMessage: 'firstname can be maximum 255 character long.',
      options: { max: 255 }
    }
  },
  lastname: {
    in: ['body'],
    optional: true,
    isLength: {
      errorMessage: 'lastname can be maximum 255 character long.',
      options: { max: 255 }
    }
  },
  address_current: {
    in: ['body'],
    optional: true,
    isLength: {
      errorMessage: 'address_current can be maximum 1000 character long.',
      options: { max: 1000 }
    }
  },
  address_native: {
    in: ['body'],
    optional: true,
    isLength: {
      errorMessage: 'address_native can be maximum 1000 character long.',
      options: { max: 1000 }
    }
  },
  village_current: {
    in: ['body'],
    optional: true,
    isInt: {
      errorMessage: "village_current must be integer.",
      options: { min:1, max: 2147483647 }
    }
  },
  village_native: {
    in: ['body'],
    optional: true,
    isInt: {
      errorMessage: "village_native must be integer.",
      options: { min:1, max: 2147483647 }
    }
  },
  mobile1: {
    in: ['body'],
    isMobilePhone: {
      errorMessage: "Invalid mobile number."
    },
    optional: true
  },
  mobile2: {
    in: ['body'],
    isMobilePhone: {
      errorMessage: "Invalid mobile number."
    },
    optional: true
  },
  email: {
    in: ['body'],
    isEmail: {
      errorMessage: "Invalid email."
    },
    optional: true
  },
  blood_group: {
    in: ['body'],
    optional: true,
    isInt: {
      errorMessage: "blood_group must be integer.",
      options: { min:1, max: 2147483647 }
    }
  },
  profession: {
    in: ['body'],
    optional: true,
    isInt: {
      errorMessage: "profession must be integer.",
      options: { min:1, max: 2147483647 }
    }
  },
  satsang_ref: {
    in: ['body'],
    optional: true,
    isInt: {
      errorMessage: "satsang_ref must be integer.",
      options: { min:1, max: 2147483647 }
    }
  },
  no_members: {
    in: ['body'],
    optional: true,
    isInt: {
      errorMessage: "no_members must be integer.",
      options: { min:1, max: 2147483647 }
    }
  }
};
