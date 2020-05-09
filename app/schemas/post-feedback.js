module.exports = {
    firstname: {
        in: ['body'],
        exists: {
          errorMessage: "firstname is required."
        },
        isLength: {
          errorMessage: 'firstname can be maximum 255 character long.',
          options: { max: 255 }
        }
    },
    lastname: {
        in: ['body'],
        exists: {
          errorMessage: "lastname is required."
        },
        isLength: {
          errorMessage: 'lastname can be maximum 255 character long.',
          options: { max: 255 }
        }
    },
    mobile: {
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
    message: {
        in: ['body'],
        exists: {
          errorMessage: "Message is required."
        },
        isLength: {
          errorMessage: 'Message can be maximum 5000 character long.',
          options: { max: 5000 }
        }
    },
};
