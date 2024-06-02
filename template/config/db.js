const mongoose = require("mongoose");
const config = require("./config");

const process = require("process");

console.log(`Connecting to MongoDB (${config.dbUri})`);
mongoose.connect(config.dbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
}, (err) => { 
  if (err) {
    console.error("Error connecting to MongoDB: ", err.message);
    console.log("Exiting server");
    process.exit(1);
  }
});

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});
