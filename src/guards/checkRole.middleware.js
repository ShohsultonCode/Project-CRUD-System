const checkRole = (roles) => {
  return (req, res, next) => {
    if (req.user && roles.includes(req.user.user_role)) {
      return next();
    } else {
      return res.status(403).json({ message: "Access denied" });
    }
  };
};

module.exports = { checkRole };
