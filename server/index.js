import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { createServer } from "http";
import cors from "cors";
import { Server } from "socket.io";
import authRoute from "./routes/auth.js";
import chatRoute from "./routes/chat.js";
import messageRoute from "./routes/message.js";
import authenticateUser from "./middlewares/auth.js";

dotenv.config();

console.log("MONGODB_URI:", process.env.MONGODB_URI); // Log to check the value

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected!"))
  .catch((err) => console.error("Database connection error:", err));

app.get("/", (req, res) => {
  res.send("Hey!! This is a sign that the server is running");
});

app.use("/auth", authRoute);
app.use("/chat", authenticateUser, chatRoute);
app.use("/message", authenticateUser, messageRoute);

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected " + socket.id);
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(userData._id + " connected");
    socket.emit("connected");
  });

  socket.on("join-chat", (room) => {
    console.log(room + " joined");
    socket.join(room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop-typing", (room) => socket.in(room).emit("stop-typing"));

  socket.on("new-message", (newMessageReceived) => {
    let chat = newMessageReceived.chat;

    if (!chat.users) return console.log(`chat.users not defined`);

    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;
      console.log("Hey got a message " + newMessageReceived);
      socket.in(user._id).emit("message-received", newMessageReceived);
    });
  });

  socket.off("setup", () => {
    console.log("Socket disconnected");
    socket.leave(userData._id);
  });
});

server.listen(PORT, () => console.log("Server is running on port", PORT));





        
      
    