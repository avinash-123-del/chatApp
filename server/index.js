const http = require("http");
const cors = require("cors");
const express = require("express");
const socketIO = require("socket.io");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

// Import files
require('./db/Connection');

// Import schema
const users = require('./modals/Users');

const app = express();

app.use(express.json());
app.use(cors());

const server = http.createServer(app);

const io = socketIO(server);

io.on("connection", (socket) => {
  console.log("New connection");

  // Handle events from this particular socket
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const port = process.env.PORT || 4500;

app.get("/", (req, res) => {
  res.send("Hello chatters");
});

app.post("/api/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const isAlreadyExists = await users.findOne({ email });

    if (isAlreadyExists) {
      return res.status(400).send("User already exists");
    } else {
      const newUsers = new users({ name, email });

      bcrypt.hash(password, 10, async (err, hashPass) => {
        if (err) {
          throw err;
        }

        newUsers.set("password", hashPass);
        await newUsers.save();
        next();
        return res.status(200).send("User registered");
      });
    }
  } catch (error) {
    next(error);
  }
});

app.post("/api/login", async (req, res, next) => {
  const { email, password } = req.body;

  const findUser = await users.findOne({ email });

  if (!findUser) {
    return res.status(400).send("Email or password incorrect");
  } else {
    const validateUser = await bcrypt.compare(password, findUser.password);

    if (!validateUser) {
      return res.status(400).send("Incorrect password");
    } else {
      const payload = { userId: findUser._id, email: findUser.email };
      const JWT_Secret = "454564";

      jwt.sign(payload, JWT_Secret, { expiresIn: 84600 }, async (err, token) => {
        if (err) {
          throw err;
        }

        await users.updateOne({ _id: findUser._id }, {
          $set: { token }
        });

        return res.status(200).json({ users : {email : findUser.email }  , token : token });
      });
    }
  }
});

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
