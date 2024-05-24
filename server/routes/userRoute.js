
import {setAvatar,login, register} from "../controllers/userController.js"
import express from "express";

const router = express.Router();

router.post("/register",register);
router.post("/login",login);
router.post("/setavatar/:id",setAvatar);

export default router