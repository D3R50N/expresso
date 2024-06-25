const ROUTES = {
  WEB: {
    INDEX: "/",
    LOGIN: "/login",
    LOGOUT: "/logout",
    LOGOUT_EXPIRED: "/logout?_exp=1",
    REGISTER: "/register",
  },
  DOCS: "/api-docs",
  API: {
    INDEX: "/api",
    USERS: {
      INDEX: "/users",
      FIND: "/:id",
      GET: {
        INDEX: "/:id/get",
        ATTRIBUTE: "/:id/get/:attr",
      },
    },
    AUTH: {
      INDEX: "/auth",
      LOGIN: "/login",
      REGISTER: "/register",
    },
  },
};

module.exports = ROUTES;
