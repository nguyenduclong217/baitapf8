const authMiddleware = (req, res, next) => {
  if (!req.body?.email?.trim() || !req.body?.password?.trim()) {
    req.flash("error", "Email hoặc mật khẩu không được để trống");
    return res.redirect("/dang-nhap");
  }

  next();
};

const authMiddleware2 = (req, res, next) => {
  if (req.session.isLogin) {
    return res.redirect("/");
  }

  next();
};

module.exports = {
  authMiddleware,
  authMiddleware2,
};