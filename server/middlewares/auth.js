    
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).send("Authentication Invalid 1");
  }
  let token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(payload.id).select("-password");
    next();
  } catch (error) {
    return res.status(401).send("Authentication Invalid 2");
    // throw new Error("Authentication Invalid");
  }
};

export default auth;


// Now let’s import all the necessary files in index.js of backend.

// import express from "express";
// import dotenv from "dotenv";
// const app = express();
// import mongoose from "mongoose";
// import { createServer } from "http";
// import cors from "cors";
// import { Server } from "socket.io";
// const server = createServer(app);
// import authRoute from "./routes/auth.js";
// import chatRoute from "./routes/chat.js";
// import messageRoute from "./routes/message.js";
// import authenticateUser from "./middleware/auth.js";

// dotenv.config();
// const PORT = process.env.PORT || 4000;

// app.use(cors());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// mongoose
//   .connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("Database connected!"))
//   .catch((err) => console.error(err));

// app.get("/", (req, res) => {
//   res.send("Hey!! This is a sign that the server is running");
// });

// app.use("/auth", authRoute);
// app.use("/chat", authenticateUser, chatRoute);
// app.use("/message", authenticateUser, messageRoute);


// server.listen(PORT, () => console.log("Server is running on port", PORT));
    
    