const express = require("express");

const authRouter = require("./auth/authRouter");
const userRouter = require("./users/usersRouter");

const server = express();

server.use(express.json());

server.use("/api/auth", authRouter);
server.use("/api/users", userRouter);

server.get("/", (req, res) => {
  res.status(200).json({ message: "API is running" });
});

module.exports = server;