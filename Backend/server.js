import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { YSocketIO } from "y-socket.io/dist/server";

const app = express();
const httpServer = createServer(app);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello World!", success: true });
});

httpServer.listen(3000, () => {
  console.log("Server is running on port 3000");
});
