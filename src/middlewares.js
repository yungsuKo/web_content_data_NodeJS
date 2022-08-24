export const protectorMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    res.redirect("/");
  } else {
    next();
  }
};
