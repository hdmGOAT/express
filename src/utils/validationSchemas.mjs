export const createUserValidationSchema = {
  username: {
    isLength: {
      options: {
        min: 5,
        max: 32,
      },
      errorMessage: "must be at least 5 characters with at most 32 characters",
    },
    notEmpty: {
      errorMessage: "Username cannot be empty",
    },
    isString: {
      errorMessage: "Username must be a string",
    },
  },
  displayName: {
    notEmpty: {
      errorMessage: "display name cannot be empty",
    },
  },
  password: {
    isLength: {
      errorMessage: "password must be longer than 7 characters",
      options: {
        min: 7,
      },
    },
    notEmpty: {
      errorMessage: "Username must not be empty",
    },
  },
};
