const ROUTES = {
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
