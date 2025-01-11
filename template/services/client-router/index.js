const ROUTES = require("../../routes/routes");
const path = require("path");
const RoutesService = require("../routes");
const accountMiddleware = require("../../middlewares/web/accountMiddleware");

class ClientRouterService {
  static basePath = ROUTES.CLIENT_ROUTER;
  static viewPath = "client/";
  static router = require("express").Router();
  static #app;

  #base;

  constructor(base) {
    this.#base = base;
  }

  static of(base) {
    return new ClientRouterService(base);
  }

  static #renderView(view, res, data) {
    return new Promise((resolve, rej) => {
      res.render(this.viewPath + view, data, (err, renderedText) => {
        if (err) {
          console.error(err);
          rej("Error when rendering view.");
        } else {
          resolve(renderedText);
        }
      });
    });
  }

  static #cleanRoute(str = "") {
    var s = str;
    function replace(chars, c) {
      for (let char of chars) {
        s = s.replaceAll(char.toLowerCase(), c.toLowerCase());
        s = s.replaceAll(char.toUpperCase(), c.toUpperCase());
      }
    }

    replace("èéêë", "e");
    replace("àâä", "a");
    replace("ôöò", "o");
    replace("ïîì", "i");
    replace(",;+", "");
    replace("&.", "_");
    s = s.replaceAll(/[^\x00-\x7F]/g, "");
    s = s.trim();
    replace(" ", "-");

    return s;
  }

  static init(app) {
    app.use(this.basePath, this.router);
    this.#app = app;
    require("../../controllers/client");
  }

  register({ clientView, route }, dataCallback) {
    if (!clientView) return;

    var ext =
      clientView.lastIndexOf(".") >= 0
        ? clientView.slice(clientView.lastIndexOf("."))
        : "";

    if (!route)
      route = clientView
        .replaceAll(path.sep, "/")
        .replaceAll("index" + ext, "")
        .replaceAll(ext, "")
        .replaceAll(" ", "-")
        .replaceAll("$", ":");

    route = ClientRouterService.#cleanRoute(route);

    const routeService = RoutesService.find(this.#base);
    if (routeService)
      ClientRouterService.#app.get(route, ...routeService.middlewares);

    ClientRouterService.router.get(route, async (req, res) => {
      try {
        const isFunction = typeof dataCallback === "function";
        const data = isFunction ? await dataCallback(req, res) : dataCallback;
        res.send(await ClientRouterService.#renderView(clientView, res, data));
      } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
      }
    });
    return this;
  }
}

module.exports = ClientRouterService;
