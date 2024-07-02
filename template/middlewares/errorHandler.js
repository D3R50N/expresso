exports.e500 = ( req, res, next) => {
  res.status(500).render("error", {title:"500", message: req.error.message || "Something went wrong." });
};

exports.e404 = (req, res, next) => {
  res
    .status(404)
    .render("error", {
      title: "404",
      message: req.error?.message || "Page not found.",
    });
};

exports.e400 = (req, res, next) => {
  res
    .status(400)
    .render("error", {
      title: "400",
      message: req.error.message || "Invalid request. Try again..",
    });
};
