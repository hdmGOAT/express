import { Router } from "express";
import {
  query,
  validationResult,
  checkSchema,
  matchedData,
} from "express-validator";
import { createUserValidationSchema } from "../utils/validationSchemas.mjs";
import { mockUsers } from "../utils/constants.mjs";

const router = Router();

const resolveIndexByUserId = (request, response, next) => {
  const {
    params: { id },
  } = request;
  const parsedId = parseInt(id);

  if (parsedId === NaN) return response.sendStatus(400);

  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
  if (findUserIndex === -1) return response.sendStatus(404);

  request.findUserIndex = findUserIndex;
  next();
};

router.get(
  "/api/users",
  query("filter")
    .isString()
    .withMessage("must be a string")
    .notEmpty()
    .withMessage("must not be empty"),
  (request, response) => {
    console.log(request.sessionID);
    console.log(
      request.sessionStore.get(request.session.id, (err, sessionData) => {
        if (err) {
          console.log(err);
          throw err;
        }
      })
    );
    const result = validationResult(request);
    console.log(result);
    const {
      query: { filter, value },
    } = request;

    if (!filter && !value) return response.send(mockUsers);

    if (filter && value)
      return response.send(
        mockUsers.filter((user) => user[filter].includes(value))
      );
  }
);

router.post(
  "/api/users",
  checkSchema(createUserValidationSchema),
  (request, response) => {
    const result = validationResult(request);
    console.log(result);

    if (!result.isEmpty()) {
      return response.status(400).send({ errors: result.array() });
    }

    const data = matchedData(request);

    const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data }; //this shit is called the spreader operator
    mockUsers.push(newUser);
    return response.status(201).send(newUser);
  }
);

//ADD VALIDATION

router.get("/api/users/:id", (request, response) => {
  console.log(request.params);
  const parsedId = parseInt(request.params.id);
  if (isNaN(parsedId))
    return response.status(400).send({ msg: "Bad Request, Invalid ID" });

  const findUser = mockUsers.find((user) => user.id === parsedId);
  if (!findUser) return response.sendStatus(404);
  return response.send(findUser);
});

router.put("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { body, findUserIndex } = request;

  mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
  return response.sendStatus(200);
});

router.patch("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { body, findUserIndex } = request;

  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
  return response.sendStatus(200);
});

router.delete("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { findUserIndex } = request;

  mockUsers.splice(findUserIndex, 1);
  return response.sendStatus(200);
});

export default router;
