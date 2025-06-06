const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  return res.status(401).json({ message: "Access denied : please log in" });
};

module.exports = {
  ensureAuthenticated,
};
