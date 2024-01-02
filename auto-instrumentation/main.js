"use strict";

const axios = require("axios").default;
const express = require("express");
const app = express();

app.get("/", async (req, res) => {
  const result = await axios.get("http://localhost:7001/hello");
  return res.status(201).send(result.data);
});

app.get("/hello", async (req, res) => {
  console.log("hello world!")
  res.json({ code: 200, msg: "success" });
});

app.use(express.json());

app.listen(7001, () => {
  console.log("Listening on http://localhost:7001");
});