import { Router } from "express";
import { mockProds } from "../utils/constants.mjs";

const router = Router();

router.get("/api/products", (request, response) => {
  response.send(mockProds);
});

export default router;
