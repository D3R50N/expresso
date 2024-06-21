const dotenv = require("dotenv");
dotenv.config();

var dbUri = `${process.env.MONGODB_HOST || "127.0.0.1"}:${process.env.MONGODB_PORT || 27017}/${process.env.MONGODB_DBNAME}`;

if (process.env.MONGODB_USER) {
  if (!process.env.MONGODB_PASSWORD)
    console.log("WARNING: Login without password.");
  dbUri =`${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${dbUri}`;
}

module.exports = {
  port: process.env.PORT || 3000,
  dbUri: "mongodb://" + dbUri,
  dbHost: process.env.MONGODB_HOST || "127.0.0.1",
  dbPort: process.env.MONGODB_PORT || 27017,
  dbName: process.env.MONGODB_DBNAME || "",
  jwtSecret: process.env.JWT_SECRET || "your_jwt_secret",
  setupDb: process.env.SETUP_DB == "true",
  environment : process.env.NODE_ENV || "development"
};
