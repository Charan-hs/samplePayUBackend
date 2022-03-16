import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { database } from "./src/config/database.js";
import  {mainRoute}  from "./src/routes/main.route.js";




const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


export const db = await mongoose.connect(database,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

 
if(db) {
    console.log("Database Connected");

}else {
    console.log("Database Connection Error")
}
// mongoose
//   .connect(database, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then((res) => {
//     console.log("Database Connected", res);
//   })
//   .catch((err) => console.log("Database Connection Error", err));

app.use('/api',mainRoute)

app.get("/", (req, res) => {
  res.send("<div><h1>The Server is Running</h1></div>");
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.error("Server is running on " + port);
});
