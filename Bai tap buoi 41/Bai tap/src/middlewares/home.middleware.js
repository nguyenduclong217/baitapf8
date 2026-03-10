module.exports = homeMiddleware = (req, res, next) => {
  if (!req.session.isLogin) {
    return res.redirect("/dang-nhap");
  }
  next();
};
