import express from "express";

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (request, response) => {
  response.status(201).send({ msg: "hello" });
});

app.get("/cool", (request, response) => {
  response.send(request.ip);
});

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});