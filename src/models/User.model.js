import mongoose from "mongoose";
// import { db } from "../../index.js";

const { Schema } = mongoose;

const TransactionSchema = new Schema(
    {
      email: String,
      amount: Number,
      type: {type: String , enum:['receive' , 'sent']}
    },
    { timestamps: true }
  );
  

const UserSchema = new Schema({
  email: {
    type: String,
    default: "",
    trim: true,
  },
  password: {
    type: String,
    trim: true,
  },
  balance: {
    type: Number,
    default:0,
    require: true
  },
  transactions:[TransactionSchema]
},  { timestamps: true });



export const User = mongoose.model('user', UserSchema);