const expressListRoutes = require("express-list-routes");
const fs = require("fs");
const path = require("path");

const routesFolder = "routes";
var list = [];

getRoutesInFolder(routesFolder);

function getRoutesInFolder(folder) {
  fs.readdirSync(folder).forEach((file) => {
    const filePath = path.join(folder, file);
    if (fs.lstatSync(filePath).isDirectory()) {
      getRoutesInFolder(filePath);
    } else if (file.includes(".js")) {
      const route = require("../" + filePath.replace(".js", ""));
      list.push(
        ...expressListRoutes(route, {
          logger: (_) => {},
          prefix: `[${filePath.replace(".js", "").replace("routes", "")}]`,
        })
      );
    }
  });
}
list = list.map((route) => {
  return `${route.method} ${route.path.replaceAll("\\", "/")}`;
});

list.sort()

module.exports = {
  list,
  log: function () {
    var currentMethod = list[0].split(" ")[0];
    console.log("ROUTES LIST");
    list.forEach((route) => {
      if (route.split(" ")[0] != currentMethod) {
        console.log("");
        currentMethod = route.split(" ")[0];
      }
      console.log(route.split(" ").join('\t'));
    });
  },
};
