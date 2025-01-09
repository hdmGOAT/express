import express, { request, response } from "express";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import { mockUsers } from "./utils/constants.mjs";

const app = express();

app.use(express.json());
app.use(cookieParser("helloWorld"));
app.use(
  session({
    secret: "this is a temporary secret",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60_000 * 60,
    },
  })
);

app.use(routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});

app.get("/", (request, response) => {
  console.log(request.session);
  console.log(request.session.id);
  request.session.visited = true;
  response.cookie("hello", "world", { maxAge: 60_000 * 60 * 2, signed: true });
  response.status(201).send({ msg: "hello" });
});

app.post("/api/auth", (request, response) => {
  //ADD VALIDATION
  const {
    body: { username, password },
  } = request;

  const findUser = mockUsers.find((user) => user.username === username);
  if (!findUser) return response.status(401).send({ msg: "BAD CREDENTIALS" });
  if (findUser.password != password)
    return response.status(401).send({ msg: "BAD CREDENTIALS" });

  request.session.user = findUser;
  return response.status(200).send(findUser);
});

app.get("/api/auth/status", (request, response) => {
  request.sessionStore.get(request.sessionID, (err, session) => {
    console.log(session);
  });
  return request.session.user
    ? response.status(200).send(request.session.user)
    : response.status(401).send({ msg: "Not Authenticated" });
});