const express = require("express");
const app = express();
const PORT = 4000;

app.get("/", (req, res) => {
  res.send("hello from backend");
});

app.post("/user", (req, res) => {
  res.send("Got a post request at /user");
});

app.listen(PORT, (err) => {
  if (err) console.log("Error!", err);
  console.log(`Port ${PORT} is online`);
});
