export const protectorMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    res.redirect("/");
  } else {
    next();
  }
};

export const publicMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    res.redirect("/data");
  } else {
    next();
  }
};
