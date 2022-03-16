import jwt  from "jsonwebtoken";
import { config } from "../controllers/auth.controller.js";
import { User } from "../models/User.model.js";


const verifyToken  =  async (token) => {
    // console.log(token.trim())
    if(!token) {
     return
    }
    try {
     const payload = await jwt.verify(token , config.secrets.jwt)
     // console.log(payload)
     const user = await User.findOne({email: payload.email}).select('-password')
     if(user) {
      return user
     }
     return 
    } catch (error) {
     console.log(error)
     return
    }
   }
   

export   const verifyTokenUser = async (req, res, next) => {
    try {
      if (req.headers.authorization) {
        const user = await verifyToken(
          req.headers.authorization.split("Bearer ")[1]
        );
  
        if (user) {
          req.user = user;
          next();
        } else {
          return res
            .status(406)
            .json({ message: "not authorized", status: false});
        }
      } else {
        return res
          .status(406)
          .json({ message: "not authorized", status: false });
      }
    } catch (err) {
      return res.status(406).json({ message: err.message });
    }
  };