const express = require("express");
const app = express();
const port = 80;

app.get("/", (req, res) => {
  res.send("Hello! Node.js");
});

app.listen(port, () => {
  console.log("Starting node.js at port " + port);
});
