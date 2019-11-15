const express = require("express");
const bodyParser = require("body-parser");
const Sse = require("json-sse"); // capitalize S because server sent event is a class
const cors = require("cors");

const app = express();

const corsMiddleware = cors();
app.use(corsMiddleware);

const jsonParser = bodyParser.json();
app.use(jsonParser);

const port = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("hello");
});

const stream = new Sse(); // a stream is a list of clients; send data to the stream is to send data to ALL CLIENTS; Sse = server sent event

const streams = {}; // for multiple streams / rooms; this is a dictionary

app.get("/stream", (req, res, next) => {
  // this endpoint connect to the stream
  const rooms = Object.keys(messages); // gives an object and returns an array of its keys (property names)
  // a new stream endpoint is how we get to the stream
  const string = JSON.stringify(rooms); // serialize the data is to turn the data into a series of characters (string) when we need to send data over the internet
  stream.updateInit(string); // this updates the data when the client sees the stream; this is always placed before stream.init
  stream.init(req, res); // a function to connect to the stream
  // to test, run: http :4000/stream --stream
});

app.get("/streams/:roomName", (req, res, next) => {
  // this endpoint connect to a stream of a room with the existing roomName

  // to test a stream, we need to get with --stream
  const { roomName } = req.params;
  //   console.log("roomName test", roomName);
  //   console.log("streams test", streams);
  const stream = streams[roomName];
  //   console.log("stream test:", stream);

  const data = messages[roomName]; // we can get a list of messages in this room stream
  const string = JSON.stringify(data);
  stream.updateInit(string);
  stream.init(req, res);
});

function send(data) {
  // we create this function because we keep copying code to serialize JSON data
  const string = JSON.stringify(data); //ALWAYS send json strings over the stream
  stream.send(string); // the function that sends data to the stream
}

app.post("/room", (req, res, next) => {
  // this endpoint create rooms
  const { name } = req.body; // assuem someone will send us a name of a room

  send(name);

  messages[name] = []; // object[name] -> this syntax is for dynamic property (existing properties need '')
  //here the room is an array that is the value of a property of the messages object

  streams[name] = new Sse(); // KEY STEP: each room needs its own stream; this creates a new stream (Sse) in streams (object) once a new room is posted to this endpoint
  res.send(name);
});

const messages = {}; // fake database; when it's an object, it can have multiple properties (of arrays)

app.get("/message", (req, res, next) => {
  res.send(messages); // since we don't have a database, the messages refresh everytime the server starts
});

app.post("/message/:roomName", (req, res, next) => {
  const { message } = req.body; // REQUIRES body-parser to use the body
  // gets the message out of the body and gets rid of the body; messages='xxx' in request <- this becomes a property of the request body
  console.log("message test", message);
  const { roomName } = req.params;
  console.log("roomName test", roomName);
  const room = messages[roomName]; // the roomName property of the messages object, which will return an array
  console.log("room test", room);
  room.push(message);

  const stream = streams[roomName];

  const string = JSON.stringify(message);

  stream.send(string);

  //   messages.push(message); // once a new message is created, its gets pushed to the fake database

  res.send(message); // this is only for testing, the app woulnd't see this; this should always be put at the end, for legibility
});

app.listen(port, () => console.log(`Listening on port ${port}`));
