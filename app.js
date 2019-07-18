const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.static("./dist"));
app.get("/", (req, res) => {
  fs.readFile("./dist/index.html", function(err, data) {
    if (err) {
      res.end("页面丢失");
      console.log(err);
    } else {
      res.end(data);
    }
  });
});

app.listen("3030");

console.log("http://127.0.0.1:3030");
