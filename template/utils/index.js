class Utils {
  static wait(ms = 1000) {
    return new Promise((res, rej) => {
      setTimeout(res, ms);
    });
  }
  static waitForPromises(...promises) {
    return new Promise(async (res, rej) => {
      promises = promises.map((p) => (typeof p == "function" ? p() : p));

      res(
        (await Promise.allSettled(promises)).map((v) =>
          v.status == "fulfilled" ? { value: v.value } : { err: v.reason }
        )
      );
    });
  }

  static generateRandomString(length = 10) {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  static random(max, min = 0) {
    return parseInt(Math.random() * (max - min)) + min;
  }

  static randomElement(array) {
    if (typeof array == "string") array = array.split("");
    
    if (!Array.isArray(array) || array.length === 0) {
      throw new Error("Input must be a non-empty array");
    }
    return array[Math.floor(Math.random() * array.length)];
  }

  static capitalize(str) {
    if (typeof str !== "string") {
      throw new Error("Input must be a string");
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  static uniqueArray(arr) {
    return [...new Set(arr)];
  }

  static arrayDifference(arr1, arr2) {
    return arr1.filter((x) => !arr2.includes(x));
  }
}

module.exports = Utils;
