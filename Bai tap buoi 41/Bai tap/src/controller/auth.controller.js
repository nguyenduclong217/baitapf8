module.exports = {
  index: (req, res) => {
    res.render("auth", {
      error: req.flash("error"),
      success: req.flash("success"),
    });
  },
  login: (req, res) => {
    // req do người dùng gửi lên , res do server trả về
    if (
      req.body.email === "admin@gmail.com" &&
      req.body.password === "123456"
    ) {
      console.log("true");
      req.session.email = req.body.email;
      req.session.isLogin = true;
      res.redirect("/");
    } else {
      req.flash("error", "Tài khoản hoặc mật khẩu chưa chính xác");
      res.redirect("/dang-nhap");
    }
  },

  logout: (req, res) => {
    delete req.session.email;
    delete req.session.isLogin;
    
    req.flash("success", "Đăng xuất thành công");

    res.redirect("/dang-nhap");
  },
};
