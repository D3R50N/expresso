exports.code = Object.freeze({
  AUTH_TOKEN_MISSSING: {
    message: "Auth token is missing",
    status: 401,
    code: "AUTH_TOKEN_MISSING",
  },
  AUTH_TOKEN_INVALID: {
    message: "Auth token is invalid",
    status: 401,
    code: "AUTH_TOKEN_INVALID",
  },
  EMAIL_REQUIRED: {
    message: "Email required",
    status: 401,
    code: "EMAIL_REQUIRED",
  },
  PASSWORD_REQUIRED: {
    message: "Password required",
    status: 401,
    code: "PASSWORD_REQUIRED",
  },
  USER_NOT_EXIST: {
    message: "This user doesn't exist",
    status: 401,
    code: "USER_NOT_EXIST",
  },
  USER_ATTR_NOT_FOUND: {
    message: "Attribute not found",
    status: 404,
    code: "USER_ATTR_NOT_FOUND",
  },
  PASSWORD_INCORRECT: {
    message: "Password is incorrect",
    status: 401,
    code: "PASSWORD_INCORRECT",
  },
  SERVER_ERROR: { message: "Server error", status: 500, code: "SERVER_ERROR" },
  USER_EXISTS: {
    message: "User already exists",
    status: 400,
    code: "USER_EXISTS",
  },
  INVALID_REQUEST: {
    message: "Invalid request",
    status: 400,
    code: "INVALID_REQUEST",
  },
  USER_NOT_CREATED: {
    message: "User not created",
    status: 400,
    code: "USER_NOT_CREATED",
  },
  USER_NOT_FOUND: {
    message: "User not found",
    status: 404,
    code: "USER_NOT_FOUND",
  },
  USER_NOT_UPDATED: {
    message: "User not updated",
    status: 400,
    code: "USER_NOT_UPDATED",
  },
  USER_NOT_DELETED: {
    message: "User not deleted",
    status: 400,
    code: "USER_NOT_DELETED",
  },
  USER_NOT_AUTHORIZED: {
    message: "User not authorized",
    status: 401,
    code: "USER_NOT_AUTHORIZED",
  },
  USER_NOT_AUTHENTICATED: {
    message: "User not authenticated",
    status: 401,
    code: "USER_NOT_AUTHENTICATED",
  },
  RESOURCE_NOT_FOUND: {
    message: "Resource not found",
    status: 404,
    code: "RESOURCE_NOT_FOUND",
  },
});

exports.json = function (res, code = exports.code.SERVER_ERROR) {
  return res.status(code.status).json(code);
};
