export const getLogin = (req, res) => {
  return res.render("login", {
    title: "Login",
  });
};

export const postLogin = (res, req) => {
  return res.end();
};
