import express from "express";
import { register, login, searchUser } from "../controllers/auth.js";
import authenticateUser from "../middlewares/auth.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/users").get(authenticateUser, searchUser);

export default router;

    
    