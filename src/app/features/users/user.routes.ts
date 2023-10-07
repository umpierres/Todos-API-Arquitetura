import express from "express";
import { validateDataUser, validateUserLogin } from "./validators";
import { UserController } from "./controllers";

const routerUser = express.Router();
const userController = new UserController();

routerUser.post("/signup", validateDataUser, userController.signup)
routerUser.post("/signin", validateUserLogin, userController.signin)

export default routerUser