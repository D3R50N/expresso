class Utils {
  static wait(ms = 1000) {
    return new Promise((res, rej) => {
      setTimeout(res, ms);
    })
  }

}

module.exports = Utils;