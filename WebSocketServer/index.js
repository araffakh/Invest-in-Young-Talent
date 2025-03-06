const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*", // السماح للواجهة بالاتصال
        methods: ["GET", "POST"],
    },
});

app.use(cors());

io.on("connection", (socket) => {
    console.log("جهاز متصل");

    socket.on("offer", (offer) => {
        socket.broadcast.emit("offer", offer);
    });

    socket.on("answer", (answer) => {
        socket.broadcast.emit("answer", answer);
    });

    socket.on("ice-candidate", (candidate) => {
        socket.broadcast.emit("ice-candidate", candidate);
    });

    socket.on("disconnect", () => {
        console.log("جهاز انفصل");
    });
});

server.listen(10000, () => console.log("السيرفر يعمل على المنفذ 5000"));
