import User from "../models/User";
import bcrypt from "bcrypt";

export const getLogin = (req, res) => {
  return res.render("login", {
    title: "Login",
    pageTitle: "로그인",
    errorMsg: "",
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
      errorMsg: "실패 : 없는 ID",
    });
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.render("login", {
      title: "Login",
      pageTitle: "로그인",
      errorMsg: "실패 : 비밀번호 틀림",
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/data/summary");
};

export const getSignup = (req, res) => {
  return res.render("signup", {
    title: "Signup",
    pageTitle: "회원가입",
  });
};
export const postSignup = async (req, res) => {
  const { id, password } = req.body;
  const isExist = await User.exists({ id });
  if (isExist) return res.redirect("/signup");
  const user = await User.create({ id, password });

  console.log(user);
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
};
