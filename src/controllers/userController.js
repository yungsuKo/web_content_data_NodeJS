export const getLogin = (req, res) => {
  return res.render("login");
};

export const postLogin = (res, req) => {
  return res.end();
};
