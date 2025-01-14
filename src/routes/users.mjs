import { Router } from "express";
import {
  query,
  validationResult,
  checkSchema,
  matchedData,
} from "express-validator";
import { createUserValidationSchema } from "../utils/validationSchemas.mjs";
import { mockUsers } from "../utils/constants.mjs";
import { User } from "../mongoose/schemas/user.mjs";
import { hashPassword } from "../utils/helpers.mjs";
import { getUserByIdHandler } from "../handlers/users.mjs";

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
        console.log(sessionData);
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
  async (request, response) => {
    const result = validationResult(request);
    console.log(result);

    if (!result.isEmpty()) {
      return response.status(400).send({ errors: result.array() });
    }

    const data = matchedData(request);
    data.password = hashPassword(data.password);
    const newUser = new User(data);
    try {
      const savedUser = await newUser.save();
      return response.status(201).send(newUser);
    } catch (err) {
      console.log(err);
      return response.sendStatus(400);
    }
  }
);

//ADD VALIDATION

router.get("/api/users/:id", resolveIndexByUserId, getUserByIdHandler);

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
