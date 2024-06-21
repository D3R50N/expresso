const mongoose = require("mongoose");

const [##MODEL_NAME##]Schema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique:true,
  },
});

const [##MODEL_NAME_U##] = mongoose.model("[##MODEL_NAME##]", [##MODEL_NAME##]Schema);

module.exports = [##MODEL_NAME_U##];
