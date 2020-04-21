const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Users = require("../users/users-model.js");
const { jwtSecret } = require("../config/secrets.js");

router.post("/register", async (req, res) => {
  try {
    const userInfo = {
      username: req.body.username,
      password: req.body.password,
      department: req.body.department
    };
    const ROUNDS = process.env.HASHING_ROUNDS || 8;
    const hash = bcrypt.hashSync(userInfo.password, ROUNDS);
    userInfo.password = hash;
    const newUser = await Users.add(userInfo);
    res.status(201).json(newUser);
  } catch (err) {
    console.log("user register post error", err);
    res.status(500).json({
      message: "there was an error when registering a new user",
      error: err
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const [user] = await Users.findBy({ username });
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = generateToken(user);
      res.status(200).json({ user: user, token: token });
    } else {
      res.status(401).json({ message: "invalid credentials" });
    }
  } catch (err) {
    console.log("user login post error", err);
    res
      .status(500)
      .json({ message: "there was an error logging in", error: err });
  }
});

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
    role: user.department || "user"
  };
  const options = {
    expiresIn: "2hr"
  };
  return jwt.sign(payload, jwtSecret, options);
}

module.exports = router;