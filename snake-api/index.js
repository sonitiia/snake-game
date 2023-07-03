const express = require("express");
const cors = require("cors");
const UserController = require("./controllers/user.controller");

const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json());

app.use(cors());

const userController = new UserController();

app.route("/api/users")
  .get(userController.getUsers);

app.route("/api/users")
  .post(userController.createUser);

app.route("/api/users/:username")
  .get(userController.getUser);

app.route("/api/users/:id")
  .put(userController.updateUser)
  .delete(userController.deleteUser);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
