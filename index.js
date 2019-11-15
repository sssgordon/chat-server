const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const jsonParser = bodyParser.json();
app.use(jsonParser);

const port = 4000;

app.get("/", (req, res) => {
  res.send("hello");
});

const messages = []; // fake database

app.post("/message", (req, res, next) => {
  const { message } = req.body; // gets rid of the body; messages=xxx <- this becomes a property of the request body

  messages.push(message);

  res.send(message);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
