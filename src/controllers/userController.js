export const getLogin = (req, res) => {
  return res.render("login", {
    title: "Login",
    pageTitle: "로그인",
  });
};

export const postLogin = (req, res) => {
  return res.send("Login Success");
};

export const getSignup = (req, res) => {
  return res.render("signup", {
    title: "Signup",
    pageTitle: "회원가입",
  });
};
export const postSignup = (req, res) => {
  console.log(req.body.id);
};
