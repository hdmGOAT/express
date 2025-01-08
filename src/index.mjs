import express, { request, response } from "express";
import usersRouter from "./routes/users.mjs";
import productsRouter from "./routes/products.mjs";
const app = express();

app.use(express.json());
app.use(usersRouter);
app.use(productsRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});

app.get("/", (request, response) => {
  response.status(201).send({ msg: "hello" });
});
