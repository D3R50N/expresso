const ROUTES = require("../../routes/routes");

class RoutesService {
  static routes = [];
  static host = "";

  static getUrl(req) {
    return this.host + req.originalUrl;
  }

  static log() {
    const methods = new Set(
      this.routes
        .map((r) => r.methods)
        .join(",")
        .split(",")
        .map((r) => r.trim().toUpperCase())
    );

    for (let method of methods.keys()) {
      console.log(`\n[${method}]`);
      for (let route of this.routes
        .filter((r) => r.methods.toUpperCase() == method)
        .sort((a, b) => a.path.localeCompare(b.path))) {
        console.log(
          `  ${route.path} \t (${route.middlewares.length} middlewares)`
        );
      }
    }
  }

  static find(route, method = "get") {
    return this.routes.find(
      (r) =>
        r.path == route &&
        r.methods.toLowerCase().includes(method.toLowerCase())
    );
  }

  static init(app) {
    this.routes = [];
    function traverseStack(stack, basePath = "") {
      stack.forEach((layer) => {
        if (layer.route) {
          const routePath = basePath + layer.route.path;
          const methods = Object.keys(layer.route.methods)
            .join(", ")
            .toUpperCase();
          const middlewares = layer.route.stack.map((l) => l.handle);
          RoutesService.routes.push({
            path: routePath.replaceAll("/?(?=/|$)/i", ""),
            methods,
            middlewares,
          });
        } else if (layer.name === "router" && layer.handle.stack) {
          const routerPath = layer.regexp
            .toString()
            .replace(/^\/\^/, "")
            .replace(/\/\?\(\?=\\\/\|\$\)\$/, "")
            .replace(/\\\//g, "/");
          traverseStack(layer.handle.stack, basePath + routerPath);
        }
      });
    }

    traverseStack(app._router.stack);
  }

  static router = (req, res, next) => {
    this.host = req.protocol + "://" + req.get("host");
    res.locals.routes = {};

    for (let k of Object.keys(ROUTES)) {
      res.locals.routes[k.toUpperCase()] = ROUTES[k];
      res.locals.routes[k.toLowerCase()] = ROUTES[k];
    }
    next();
  };
}

module.exports = RoutesService;
