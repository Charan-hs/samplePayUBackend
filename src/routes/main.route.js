import express from "express";
import { createUser, getUserDetails, login } from "../controllers/auth.controller.js";
import { updateBalance, updateTransaction , createPaytmChecksum } from "../controllers/transaction.controller.js";
import { verifyTokenUser } from "../utils/midleware.js";


const router = express.Router();

router.post('/create' , createUser);
router.post('/login' , login);
router.post('/getDetails',verifyTokenUser, getUserDetails);

router.post('/transaction',verifyTokenUser ,updateTransaction )
router.post('/updatebalance',verifyTokenUser ,updateBalance )
router.post('/createpaytm',verifyTokenUser ,createPaytmChecksum )


export const mainRoute =  router