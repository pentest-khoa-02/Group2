const getIndex = (req, res) => {
  res.render("index", {
    errors: "errors",
  });
};

export default { getIndex };
