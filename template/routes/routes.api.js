const ROUTES = {
  API_BASE: "/api",

  STORAGE_GET_FILE: "/storage/files/:filename",

  DOCS: "/api-docs",

  USERS: "/users",
  FIND: "/:id",
  GET: "/:id/get", // can be used as FIND
  GET_ATTRIBUTE: "/:id/get/:attr",

  AUTH: "/auth",
  AUTH_LOGIN: "/login",
  AUTH_REGISTER: "/register",
};

module.exports = ROUTES;
