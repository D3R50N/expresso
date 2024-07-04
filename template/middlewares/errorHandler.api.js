const errors = require("../core/errors");

exports.e500 = (req, res, next) => {
  res.status(500).send(errors.code.SERVER_ERROR)
};

exports.e404 = (req, res, next) => {
  res.status(404).send(errors.code.RESOURCE_NOT_FOUND);
};

exports.e400 = (req, res, next) => {
  res.status(400).send(errors.code.INVALID_REQUEST);
};
