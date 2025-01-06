import express, { request, response } from "express";

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (request, response) => {
  response.status(201).send({ msg: "hello" });
});

app.get("/api/users", (request, response) => {
  response.send([
    { id: 1, username: "hanscoolguy3000", displayName: "hans" },
    { id: 2, username: "irairairiariari", displayName: "ira" },
    { id: 3, username: "aasdfadawe", displayName: "wow" },
  ]);
});

app.get("/api/users/:id", (request, response) => {
  console.log(request.params);
});

app.get("/api/products", (request, response) => {
  response.send([
    { id: 1, itemName: "gun", price: "100" },
    { id: 2, itemName: "bomb", price: "50" },
    { id: 3, itemName: "idk", price: "10" },
  ]);
});

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});
