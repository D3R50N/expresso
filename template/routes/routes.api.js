const ROUTES = {
  DOCS: "/api-docs",

  API_BASE: "/api",
  USERS: "/users",
  FIND: "/:id",
  GET: "/:id/get", // can be used as FIND
  GET_ATTRIBUTE: "/:id/get/:attr",

  AUTH: "/auth",
  AUTH_LOGIN: "/login",
  AUTH_REGISTER: "/register",
};

module.exports = ROUTES;
