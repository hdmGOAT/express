import express, { request, response } from "express";
import {
  query,
  body,
  validationResult,
  matchedData,
  checkSchema,
} from "express-validator";
import { createUserValidationSchema } from "./utils/validationSchemas.mjs";
import usersRouter from "./routes/users.mjs";
import { mockUsers } from "./utils/constants.mjs";
const app = express();

app.use(express.json());
app.use(usersRouter);

const loggingMiddleware = (request, response, next) => {
  console.log(`${request.method} - ${request.url}`);
  next();
};

const PORT = process.env.PORT || 3000;

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


app.get("/api/products", (request, response) => {
  response.send(mockProds);
});


