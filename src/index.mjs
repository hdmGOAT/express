import express, { request, response } from "express";

const app = express();

app.use(express.json());

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
  const { body } = request;
  const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...body }; //this shit is called the spreader operator
  mockUsers.push(newUser);
  return response.status(201).send(newUser);
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

app.put("/api/users/:id", (request, response) => {
  const {
    body,
    params: { id },
  } = request;

  const parsedId = parseInt(id);
  if (parsedId === NaN) return response.sendStatus(400);

  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);

  if (findUserIndex === -1) return response.sendStatus(404);

  mockUsers[findUserIndex] = { id: parsedId, ...body };
  return response.sendStatus(200);
});

app.get("/api/products", (request, response) => {
  response.send(mockProds);
});


