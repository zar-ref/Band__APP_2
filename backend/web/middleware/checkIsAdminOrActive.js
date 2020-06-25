const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = { email: decodedToken.email, role: decodedToken.role };
    if(req.userData.role === 'admin' || req.userData.role === 'active'){
        next();
    }
 
  } catch (error) {
    res.status(401).json({ message: "Não tem acesso à Fan Zone" });
  }
};