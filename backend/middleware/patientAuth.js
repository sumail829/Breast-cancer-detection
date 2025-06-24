 import jwt from "jsonwebtoken";

const patientAuth = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.json({
      success: false,
      message: 'Not Authorized. Login Again',
    });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    if (tokenDecode.id) {
      // ✅ Ensure req.body is defined
      if (!req.body) {
        req.body = {};
      }

      req.body.patientId = tokenDecode.id;
    } else {
      return res.json({
        success: false,
        message: 'Not Authorized. Login Again to continue',
      });
    }

    next();
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export default patientAuth;