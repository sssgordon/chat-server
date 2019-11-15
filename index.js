const express = require("express");
const bodyParser = require("body-parser");
const Sse = require("json-sse"); // capitalize S because server sent event is a class

const app = express();

const jsonParser = bodyParser.json();
app.use(jsonParser);

const port = 4000;

app.get("/", (req, res) => {
  res.send("hello");
});

const stream = new Sse(); // a stream is a list of clients; send data to the stream is to send data to ALL CLIENTS

app.get("/stream", (req, res, next) => {
  // a new stream endpoint is how we get to the stream
  const string = JSON.stringify(messages); // serialize the data is to turn the data into a series of characters (string) when we need to send data over the internet
  stream.updateInit(string); // this updates the data when the client sees the stream; this is always placed before stream.init
  stream.init(req, res); // a function to connect to the stream
  // to test, run: http :4000/stream --stream
});

const messages = []; // fake database

app.get("/message", (req, res, next) => {
  res.send(messages); // since we don't have a database, the messages refresh everytime the server starts
});

app.post("/message", (req, res, next) => {
  const { message } = req.body; // REQUIRES body-parser to use the body
  // gets rid of the body; messages='xxx' in request <- this becomes a property of the request body

  messages.push(message);

  res.send(message);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
