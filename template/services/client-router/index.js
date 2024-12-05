const ROUTES = require('../../routes/routes');

class ClientRouterService {
    static basePath = ROUTES.CLIENT_ROUTER;
    static viewPath = "client/";
    static router = require('express').Router();


    static renderView(view, res, data) {
        return new Promise((resolve, rej) => {
            res.render(this.viewPath + view, data, (err, renderedText) => {
                if (err) {
                    console.error(err);
                    rej('Error when rendering view.');
                } else {
                    resolve(renderedText);
                }
            });
        });
    }

    static init(app = require("express")()) {
        require("./routes");
        app.use(this.basePath, this.router);
    }
}

module.exports = ClientRouterService;
