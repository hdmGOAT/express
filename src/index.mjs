import express, { request, response } from "express";

const app = express();

const PORT = process.env.PORT || 3000;

const mockUsers = [
  { id: 1, username: "hanscoolguy3000", displayName: "hans" },
  { id: 2, username: "irairairiariari", displayName: "ira" },
  { id: 3, username: "aasdfadawe", displayName: "wow" },
];

const mockProds = [
  { id: 1, itemName: "gun", price: "100" },
  { id: 2, itemName: "bomb", price: "50" },
  { id: 3, itemName: "idk", price: "10" },
];

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});

app.get("/", (request, response) => {
  response.status(201).send({ msg: "hello" });
});

app.get("/api/users", (request, response) => {
  const {
    query: { filter, value },
  } = request;

  if (!filter && !value) return response.send(mockUsers);

  if (filter && value)
    return response.send(
      mockUsers.filter((user) => user[filter].includes(value))
    );
});

app.post("/api/users", (request, response) => {
  console.log(request.body);
  return response.send(200);
});

app.get("/api/users/:id", (request, response) => {
  console.log(request.params);
  const parsedId = parseInt(request.params.id);
  if (isNaN(parsedId))
    return response.status(400).send({ msg: "Bad Request, Invalid ID" });

  const findUser = mockUsers.find((user) => user.id === parsedId);
  if (!findUser) return response.sendStatus(404);
  return response.send(findUser);
});

app.get("/api/products", (request, response) => {
  response.send(mockProds);
});


