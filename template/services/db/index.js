/**
 * Database Service for managing MongoDB connections and seeding operations.
 * Provides methods to connect to the database and populate collections with seed data.
 */
class DBService {
  /**
   * Connects the application to MongoDB.
   *
   * @param {boolean} [showConnectionState=true] - Whether to display connection state logs in the console.
   * @returns {Promise<void>}
   */
  static async connect(showConnectionState = true) {
    if (!config.dbUri) return;

    if (showConnectionState) {
      mongoose.connection.on("connected", () => {
        console.log("Connected to MongoDB");
      });
    }

    try {
      if (showConnectionState)
        console.log(`Connecting to MongoDB (${config.dbUri})`);
      await mongoose.connect(config.dbUri, {});
    } catch (err) {
      console.error("Error connecting to MongoDB: ", err.message);
      process.exit(1);
    }
  }

  /**
   * Seeds the MongoDB collections with data from JSON files in the seeders directory.
   *
   * @param {Object} [options={}] - Configuration options for seeding.
   * @param {string[]} [options.only=[]] - Array of specific seed files or collection names to process.
   * @param {string[]} [options.exclude=[]] - Array of seed files or collection names to exclude.
   * @param {boolean} [options.erase=true] - Whether to clear existing documents in the collections before seeding.
   * @returns {Promise<void>}
   */
  static async seed({ only = [], exclude = [], erase = true } = {}) {
    await this.connect(false);

    const seedersDir = path.resolve(__dirname, "../../seeders");
    const seedsDir = path.resolve(__dirname, "../../seeds");

    // Ensure seeders and seeds directories exist
    for (let dir of [seedersDir, seedsDir])
      if (!fs.existsSync(dir)) fs.mkdirSync(dir);

    const seedLog = {};

    // Filter JSON seed files
    let files = fs
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

      let data;
      try {
        data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      } catch (error) {
        data = [];
      }

      try {
        // Resolve potential model names for the collection
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

        let Model;

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
}

module.exports = DBService;
