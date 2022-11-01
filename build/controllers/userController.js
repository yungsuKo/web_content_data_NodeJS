import User from "../models/User";
import bcrypt from "bcrypt";

export const getLogin = (req, res) => {
  return res.render("login", {
    title: "Login",
    pageTitle: "로그인",
    errorMsg: ""
  });
};

export const postLogin = async (req, res) => {
  // id, password 일치 여부 확인
  const { id, password } = req.body;
  const user = await User.findOne({ id });
  const exist = await User.exists({ id });
  if (!exist) {
    return res.render("login", {
      title: "Login",
      pageTitle: "로그인",
      errorMsg: "실패 : 없는 ID"
    });
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.render("login", {
      title: "Login",
      pageTitle: "로그인",
      errorMsg: "실패 : 비밀번호 틀림"
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/data");
};

export const getSignup = (req, res) => {
  return res.render("signup", {
    title: "Signup",
    pageTitle: "회원가입",
    pageDescription: "모든 기능이 무료이니 회원가입 후 사용해보세요",
    errorMsg: ""
  });
};
export const postSignup = async (req, res) => {
  console.log(req.body);
  const { id, password, password2 } = req.body;
  const isExist = await User.exists({ id });
  if (isExist) return res.status(400).render("signup", {
    title: "Signup",
    pageTitle: "회원가입",
    pageDescription: "모든 기능이 무료이니 회원가입 후 사용해보세요",
    errorMsg: "존재하는 ID 입니다."
  });
  if (password !== password2) {
    return res.status(400).render("signup", {
      title: "Signup",
      pageTitle: "회원가입",
      pageDescription: "모든 기능이 무료이니 회원가입 후 사용해보세요",
      errorMsg: "비밀번호가 일치하지 않습니다."
    });
  }

  const user = await User.create({ id, password });

  console.log(user);
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
};

export const logout = async (req, res) => {
  req.session.destroy();
  return res.redirect('/');
};