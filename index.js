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

app.get("/message", (req, res, next) => {
  res.send(messages);
});

app.post("/message", (req, res, next) => {
  const { message } = req.body; // REQUIRES body-parser to use the body
  // gets rid of the body; messages='xxx' in request <- this becomes a property of the request body

  messages.push(message);

  res.send(message);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
