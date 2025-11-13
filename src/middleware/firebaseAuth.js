const admin = require("firebase-admin");

module.exports = async function (req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer "))
    return res.status(401).json({ message: "Unauthorized" });

  const idToken = authHeader.split("Bearer ")[1];
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    req.user = decoded; // contains uid, email, name, picture
    next();
  } catch (err) {
    console.error("Firebase verify error", err);
    return res.status(401).json({ message: "Invalid token" });
  }
};
