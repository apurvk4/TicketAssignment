require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const connect = require("../Models/db");
const path = require("node:path");
const { json } = require("body-parser");
const { clearRecords } = require("../controllers/clearRecords");
const { bookTickets } = require("../controllers/bookTickets");
const app = express();
const PORT = process.env.PORT || 5000;
mongoose.set("strictQuery", false);
function corsMiddleWare(req, res, next) {
  console.log(req.socket.remoteAddress);
  res.setHeader("Access-Control-Allow-Origin", `http://localhost:4000`);
  res.removeHeader("X-powered-by");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,POST");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  if (req.method == "OPTIONS") {
    res.status(200);
    res.end();
  } else {
    next();
  }
}
app.use(express.static(path.join(__dirname, "..", "client", "dist")));
app.use(corsMiddleWare);
app.use(express.urlencoded({ extended: true }));
app.use(json());
connect()
  .then(() => {
    app.get("/api/clear", clearRecords);
    app.post("/api/book", bookTickets);
    app.all("/api/*", (req, res) => {
      res.status(404).send({ message: "operation not supported" });
    });
    app.get("/favicon.ico", (req, res) => {
      res.sendFile(path.join(__dirname, "..", "client", "dist", "vite.svg"));
    });
    app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, "..", "client", "dist", "index.html"));
    });
    app.get("/*", (req, res) => {
      res.sendFile(path.join(__dirname, "..", "client", "dist", "index.html"));
    });
    app.listen(PORT, () => {
      console.log(`server listening on ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  }); // connect to database
