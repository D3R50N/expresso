exports.e500 = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("error", {title:"500", message: "Something went wrong" });
};

exports.e404 = (req, res, next) => {
  res.status(404).render("error", { title: "404", message: "Page not found"});
};
