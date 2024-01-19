const express = require("express");

const app = express();
const port = 8000;

app.use(express.static("static"));

app.get("/", (req, res) => { 
  res.sendFile("index.html", {root: "views"})
});

app.get("/app", (req, res) => { 
  res.sendFile("app.html", {root: "app"})
});

app.get("/app/app.js", (req, res) => { 
  res.sendFile("app.js", {root: "app"})
});

app.get("/app/style.css", (req, res) => { 
  res.sendFile("style.css", {root: "app"})
});

app.listen(port, () => {
  console.log(`listening on http://127.0.0.1:${port}`);
});