const express = require("express");

const app = express();
const port = 8000;

app.use(express.static("static"));

app.listen(port, () => {
  console.log(`listening on http://127.0.0.1:${port}`);
});