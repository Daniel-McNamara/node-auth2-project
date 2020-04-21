const router = require("express").Router();
const Users = require("./users-model.js");
const restricted = require("../auth/auth-mw.js");

router.get("/", restricted, async (req, res) => {
  try {
    const { role } = req.decodedToken;
    const users = await Users.find().where("department", "=", role);
    res.status(200).json(users);
  } catch (err) {
    console.log("users get all error", err);
    res
      .status(500)
      .json({ message: "there was an errow getting the users", error: err });
  }
});

module.exports = router;