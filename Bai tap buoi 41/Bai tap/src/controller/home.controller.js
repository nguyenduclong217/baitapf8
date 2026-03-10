module.exports = {
  index: (req, res) => {
    res.render("home", {});
    console.log(req.session.email);
  },
};
