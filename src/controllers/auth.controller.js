
import { compare } from "bcrypt";
import { hash } from "bcrypt"
import jwt  from "jsonwebtoken";
import { User } from "../models/User.model.js"

export const config = {
    secrets: {
      jwt: "abcdefghijklmnopqrstuvwxyz",
      jwtExp: "30d",
    },
  };

const createToken = (data) => {
    // console.log(user, userInfo);
    return jwt.sign(data, config.secrets.jwt, {
      expiresIn: config.secrets.jwtExp,
    });
  };

export const createUser = async (req , res) => {
    const {email , password , balance} = req.body
    console.log(email , password)

    if(!email || !password) {
        return res.status(406).json({message: "email and password required"})

    }

    try {
        const oldUser = await User.findOne({email: email})
        if(oldUser){
            return res.status(400).json({message: "User already Registerd"})
        }
        let hasedPassword = await hash(password , 2);
        const createdUser = await User.create({email , password: hasedPassword , balance})


        if(!createdUser) {
            return res.status(500).json({message: "Internal server error "});

        }

        const token =  createToken({email})

        if(token){
            return res.status(200).json({message: "Successfully Created " , data: { jwt: token}})
        }
        else{
            throw new Error
        }

        
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "something went wrong"})
        
    }


} 

export const login = async (req , res) => {
    const {email , password} = req.body;
    if(!email || !password) {
        return res.status(406).json({message: "email and password required"})

    }

    try {
        const foundUser = await User.findOne({email});
        if(!foundUser){
            return res.status(400).json({message: "User not Registerd"})
        }
        const matched = await compare(password , foundUser.password)

        if(matched){
            const token =  createToken({email : foundUser.email})

        if(token){
            return res.status(200).json({message: "Successfully Created " , data: { jwt: token}})
        }
        else{
            throw new Error
        }

        }
        else{
            return res.status(400).json({message: "email or password is wrong"})

        }


    } catch (error) {
        console.log(error)

        return res.status(500).json({message: "something went wrong"})
        
    }
    
}

export const getUserDetails = async ( req, res) => {
    const { email} = req.user;

    if(!email){
        return res.status(406).json({message: "email  required"})

    }

    try {
        const foundUser = await User.findOne({email: email});

        const toSend = {
            email : foundUser.email,
            balance: foundUser.balance,
            transactions:foundUser.transactions,
            id: foundUser._id
        }

        if(foundUser){
            return res.status(200).json({message: "accepeted" , data: {userDetails: toSend}})
        }
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "something went wrong"})
        
    }
}