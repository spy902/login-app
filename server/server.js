// const express = require("express");
import express from "express";
import cors from "cors";
import morgan from "morgan";

import connect from "./database/conn.js";
import router from "./router/route.js";

/** Create express application */
const app = express();

/** middlewares */
app.use(express.json());
app.use(cors());
/** to log http requests */
app.use(morgan("tiny"));
/** less hacker know about our stack */
app.disable("x-powered-by");

/** set port */
const port = 8000;

/** HTTP Get Request */
app.get("/", (req, res) => {
  res.status(201).json("Home GET Request");
});

/** Api routes */
app.use("/api", router);

/** Start server only when we have valid connection */
connect()
  .then(() => {
    try {
      app.listen(port, () => {
        console.log(`Server connected to http://localhost:${port}`);
      });
    } catch (error) {
      console.log(`Cannot connect to the server`);
    }
  })
  .catch((error) => {
    console.log(`Invalid database connection`);
  });
