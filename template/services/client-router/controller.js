const ClientRouterService = require(".");
const AuthService = require("../auth");

exports.index = async (req, res) => {
    try {
        const user = await AuthService.authUser(req);
        const data = {
            user,
        };

        res.send(await ClientRouterService.renderView("home",res,data))
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
