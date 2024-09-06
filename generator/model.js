const mongoose = require("mongoose");

const [##MODEL_NAME##]Schema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique:true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },

});

[##MODEL_NAME##]Schema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const [##MODEL_NAME_U##] = mongoose.model("[##MODEL_NAME##]", [##MODEL_NAME##]Schema);

module.exports = [##MODEL_NAME_U##];
