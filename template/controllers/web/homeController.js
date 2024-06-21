exports.index = async (req, res) => {
  try {
    const name = req.query.name || "Max Dev";
    return res.render("index", { name:name  })
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
