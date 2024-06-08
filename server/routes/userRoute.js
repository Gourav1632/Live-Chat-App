
import {getAllUsers,setAvatar,login, register, getUserContacts,sendRequest,getSentRequests,getRecievedRequests,acceptRequest,rejectRequest} from "../controllers/userController.js"
import express from "express";

const router = express.Router();

router.post("/register",register);
router.post("/login",login);
router.post("/setavatar/:id",setAvatar);
router.get("/allusers/:id",getAllUsers)
router.get("/contacts/:id",getUserContacts);
router.post("/sendrequest/:id",sendRequest);
router.get("/getSentRequests/:id",getSentRequests);
router.get("/getRecievedRequests/:id",getRecievedRequests);
router.post("/acceptrequest/:id",acceptRequest);
router.post("/rejectrequest/:id",rejectRequest);

export default router