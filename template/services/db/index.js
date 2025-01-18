const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Utils = require("../../utils");
const config = require("../../config");
const process = require("process");

class DBService {
  static async connect(showConnectionState = true) {
    if (!config.dbUri) return;

    if (showConnectionState)
      mongoose.connection.on("connected", () => {
        console.log("Connected to MongoDB");
      });

    try {
      if (showConnectionState)
        console.log(`Connecting to MongoDB (${config.dbUri})`);
      await mongoose.connect(config.dbUri, {});
    } catch (err) {
      console.error("Error connecting to MongoDB: ", err.message);
      process.exit(1);
    }
  }

  static async _seed({ only = [], exclude = [], erase = true } = {}) {
    await this.connect(false);

    const seedersDir = path.resolve(__dirname, "../../seeders");
    const seedsDir = path.resolve(__dirname, "../../seeds");

    for (let dir of [seedersDir, seedsDir])
      if (!fs.existsSync(dir)) fs.mkdirSync(dir);

    const seedLog = {};

    var files = fs
      .readdirSync(seedersDir)
      .filter((file) => file.endsWith(".json"));

    if (only.length > 0) {
      files = files.filter((file) => {
        const name = path.basename(file, ".json");
        return only.includes(file) || only.includes(name);
      });
    }

    if (exclude.length > 0) {
      files = files.filter((file) => {
        const name = path.basename(file, ".json");
        return !(exclude.includes(file) || exclude.includes(name));
      });
    }

    for (const file of files) {
      const collectionName = path.basename(file, ".json");
      const filePath = path.join(seedersDir, file);

      var data;
      try {
        data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      } catch (error) {
        data = [];
      }

      try {
        const stringData = Utils._string(collectionName);
        function alternativesStringData(data) {
          const alternatives = [data._value, data.singularize()._value];
          if (!data._value.endsWith("s")) {
            alternatives.push(data.pluralize()._value);
          }
          return alternatives;
        }

        const possibleModelNames = [
          ...alternativesStringData(stringData),
          ...alternativesStringData(stringData.capitalize()),
        ];

        var Model;

        for (let possibleName of possibleModelNames) {
          try {
            Model = mongoose.model(possibleName);
          } catch (_) {}
        }

        if (erase) await Model.deleteMany();
        const result = await Model.create(data);

        seedLog[Model.collection.collectionName] = data;

        console.log(
          `✅ ${result.length} docs added to ${Model.collection.collectionName}`
        );
      } catch (error) {
        console.error(
          `❌ Error when inserting docs to ${collectionName}:`,
          error.message
        );
      }
    }

    if (Object.keys(seedLog).length == 0) {
      console.log("No seed created.");
      return;
    }

    const logFileName = `${new Date()
      .toISOString()
      .replace(/[:.]/g, "-")}.seed.json`;
    fs.writeFileSync(
      path.join(seedsDir, logFileName),
      JSON.stringify(seedLog, null, 2),
      "utf-8"
    );

    console.log(`📂 Seed log in ${path.join("seeds", logFileName)}`);
  }

  static async _getCollections() {
    await this.connect(false);
    const db_collections = mongoose.connection.collections;
    const promise_collections = Object.keys(db_collections).map(async (k) => {
      const collection = db_collections[k];
      const name = collection.name;
      const model = collection.modelName;
      const count = await mongoose.model(model).countDocuments();

      return {
        name,
        model,
        count,
      };
    });
    const collections = await Promise.all(promise_collections);
    return collections;
  }
  static async _getCollectionData(id) {
    await this.connect(false);
    const db_collections = mongoose.connection.collections;
    const collection = db_collections[id];
    if (!collection) return null;

    const name = collection.name;
    const model = collection.modelName;
    const docs = await mongoose.model(model).find();

    return {
      name,
      model,
      docs,
    };
  }
}

module.exports = DBService;
