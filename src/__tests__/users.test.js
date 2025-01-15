import validator, { matchedData } from "express-validator";
import { validationResult } from "express-validator";
import { createUserHandler, getUserByIdHandler } from "../handlers/users.mjs";
import { mockUsers } from "../utils/constants.mjs";
import { response } from "express";
import * as helpers from "../utils/helpers.mjs";
import { User } from "../mongoose/schemas/user.mjs";

jest.mock("express-validator", () => ({
  validationResult: jest.fn(() => ({
    isEmpty: jest.fn(() => false),
    array: jest.fn(() => [{ msg: "Invalid Field" }]),
  })),
  matchedData: jest.fn(() => ({
    id: 1,
    username: "test",
    password: "password",
    displayName: "test_name",
  })),
}));

jest.mock("../utils/helpers.mjs", () => ({
  hashPassword: jest.fn((password) => `hashed_${password}`),
}));

jest.mock("../mongoose/schemas/user.mjs");

const mockRequest = {
  findUserIndex: 1,
};

const mockResponse = {
  sendStatus: jest.fn(),
  send: jest.fn(),
  status: jest.fn(() => mockResponse),
};

describe("get users", () => {
  it("should get user by id", () => {
    getUserByIdHandler(mockRequest, mockResponse);
    expect(mockResponse.send).toHaveBeenCalled();
    expect(mockResponse.send).toHaveBeenCalledWith(mockUsers[1]);
    expect(mockResponse.send).toHaveBeenCalledTimes(1);
  });

  it("should call sendStatus with 404 when user not found", () => {
    const copyMockRequest = { ...mockRequest, findUserIndex: 100 };
    getUserByIdHandler(copyMockRequest, mockResponse);
    expect(mockResponse.sendStatus).toHaveBeenCalled();
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(404);
    expect(mockResponse.sendStatus).toHaveBeenCalledTimes(1);
    expect(mockResponse.send).not.toHaveBeenCalled();
  });
});

//SEND STATUS NOT REACHING

describe("create users", () => {
  const mockRequest = {};

  it("should status of 400 when met with errors", async () => {
    await createUserHandler(mockRequest, mockResponse);
    expect(validator.validationResult).toHaveBeenCalledTimes(1);
    expect(validator.validationResult).toHaveBeenCalledWith(mockRequest);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith({
      errors: [{ msg: "Invalid Field" }],
    });
  });

  it("should return status of 201 and user is created", async () => {
    jest.spyOn(validator, "validationResult").mockImplementationOnce(() => ({
      isEmpty: jest.fn(() => true),
    }));

    const saveMethod = jest.spyOn(User.prototype, "save").mockResolvedValueOnce;

    await createUserHandler(mockResponse, mockRequest);
    expect(validator.matchedData).toHaveBeenCalledWith(mockRequest);
    expect(helpers.hashPassword).toHaveBeenCalled(password);
    expect(helpers.hashPassword).toHaveReturnedWith(`hashed_${password}`);
    expect(User).toHaveBeenCalledWith({
      username: "test",
      password: "password",
      displayName: "test_name",
    });

    expect(saveMethod).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.send).toHaveBeenCalledWith({
      id: 1,
      username: "test",
      password: "password",
      displayName: "test_name",
    });
  });

  it("should sendStatus of 400 when database save fails", async () => {
    jest.spyOn(validator, "validationResult").mockImplementationOnce(() => ({
      isEmpty: jest.fn(() => true),
    }));
    const saveMethod = jest
      .spyOn(User.prototype, "save")
      .mockResolvedValueOnce(() => Promise.reject("failed to save user"));

    await createUserHandler(mockRequest, mockResponse);
    expect(saveMethod).toHaveBeenCalled();
    expect(response.sendStatus).toHaveBeenCalledWith(400);
  });
});
