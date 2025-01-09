import { Router } from "express";
import { mockProds } from "../utils/constants.mjs";

const router = Router();

router.get("/api/products", (request, response) => {
  console.log(request.headers.cookie);
  console.log(request.signedCookies.hello);
  if (request.signedCookies.hello && request.signedCookies.hello == "world") {
    return response.send([{ mockProds }]);
  }
  return response.status(403).send({ msg: "lacking appropriate cookie" });
});

export default router;
