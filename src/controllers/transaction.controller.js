import { db } from "../../index.js";
import { User } from "../models/User.model.js";
import Paytm  from "paytmchecksum";
export const updateTransaction = async (req, res) => {
  const { senderEmail, amount, reciverEmail } = req.body;

  console.log(senderEmail, amount, reciverEmail)

  if (!senderEmail || !amount || !reciverEmail || senderEmail === reciverEmail) {
    return res.status(406).json({ message: "All details are  required" });
  }
  try {
    const session = await db.startSession();
    const senderDetails = await User.findOne({ email: senderEmail }).session(session);
    const reciverdetails = await User.findOne({ email: reciverEmail }).session(session);

    if (!senderDetails || !reciverdetails) {
      session.endSession();
      return res.status(500).json({ message: "something went wrong" });
    }

    if (senderDetails.balance < amount) {
      session.endSession();
      return res.status(400).json({ message: "Insufficient balance" });
    }
    const senderTra = { email: reciverEmail, amount, type: "sent" };
    const reciverTra = { email: senderEmail, amount, type: "receive" };
    const senderAmount = parseInt(senderDetails.balance) - parseInt(amount);
    const reciverAmount =  parseInt(reciverdetails.balance) + parseInt(amount);

    const sendUpdated = await User.findOneAndUpdate(
      { email: senderEmail },
      { $set: { balance: senderAmount }, $push: { transactions: senderTra } },
      { session: session }
    ).exec();
    const reciverUpdated = await User.findOneAndUpdate(
      { email: reciverEmail },
      { $set: { balance: reciverAmount }, $push: { transactions: reciverTra } },
      { session: session }
    ).exec();
    session.endSession();
    if (sendUpdated && reciverUpdated) {
      return res
        .status(200)
        .json({ message: "Successfully amount transfered " });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "something went wrong" });
  }
};

export const updateBalance = async (req, res) => {
  const { amount } = req.body;
  const {email} = req.user;

  if (!email || amount < 1) {
    return res.status(406).json({ message: "All details are  required" });
  }
  try {
    const foundUser = await User.findOne({ email });

    if (!foundUser) {
      return res.status(400).json({ message: "no user found" });
    }
    const updatedAmount = foundUser.balance + amount;

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { balance: updatedAmount }
    );

    if (!updatedUser) {
      throw new Error();
    }

    return res.status(200).json({message:"Accepeted"})
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "something went wrong" });
  }
};


export const createPaytmChecksum = async (req, res) => {
  console.log("adfjdafcyh")
  const PaymentConfiguration = {
    MID: "UqGrUm48056341225630",
    Merchant_Key: "#WOxfmJ&9QK2sAk9",
  }
  const {  amount } = req.body;
  if (!amount) {
    let msg = " amount is required field !";
    return res.status(406).json({ message: msg});
  }
  try {
    let orderId = Math.floor(Math.random() *10000);
    let paytmURL =
      "https://securegw.paytm.in/theia/paytmCallback?ORDER_ID=" +
      orderId +
      "&TXN_AMOUNT=" +
      amount +
      "&WEBSITE=WEBSTAGING";
   const body = {
      MID: "UqGrUm48056341225630",
      ORDER_ID: `${orderId}` ,
      TXN_AMOUNT: `${amount}`,
      CHANNEL_ID: "WAP",
      INDUSTRY_TYPE_ID: "Retail",
      WEBSITE: "WEBSTAGING",
      CUST_ID: '123445',
      CALLBACK_URL: paytmURL,
    };
    var paytmChecksum = Paytm.generateSignature(
      body,
      "#WOxfmJ&9QK2sAk9"
    );
    paytmChecksum
      .then(async (result) => {
        body["checksum"] = result;
        return res.status(200).json({message:"Accepeted" , data:body});
      })
      .catch(function (err) {
        console.log(err)
        
        return res.status(500).json({ message: "something went wrong from here" });
      });
    } catch (err) {
    console.log(err)
    return res.status(500).json({ message: "something went wrong" });
  }
};