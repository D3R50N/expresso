const ROUTES = require("../../routes/routes");


/**
 * Service to a get many informations about the current app
 * As host, routes, middlewares for each routes, etc..
 */
class RoutesService {
  static routes = [];
  static host = "";

  /**
   * Gets the full URL for the current request.
   *
   * @param {Object} req - The request object.
   * @param {string} req.originalUrl - The original URL of the request.
   *
   * @returns {string} - The full URL of the request.
   */
  static getUrl(req) {
    return this.host + req.originalUrl;
  }

  /**
   * Logs all available routes and their HTTP methods.
   */
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

  /**
   * Finds a route matching the given path and method.
   *
   * @param {string} route - The path of the route to find.
   * @param {string} [method="get"] - The HTTP method (default is GET).
   *
   * @returns {Object|undefined} - The route object if found, or undefined.
   */
  static find(route, method = "get") {
    return this.routes.find(
      (r) =>
        r.path == route &&
        r.methods.toLowerCase().includes(method.toLowerCase())
    );
  }

  /**
   * Initializes the route stack and populates the routes array.
   * This should be called with the Express application instance.
   *
   * @param {Object} app - The Express application instance.
   */
  static getAppRoutes(app) {
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

  /**
   * Middleware that makes routes available in the `res.locals` object for rendering.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   */
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
