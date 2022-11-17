const express = require("express");
const app =express()
const dotenv=require("dotenv")
const bodyParser=require("body-parser");
const fileUpload=require("express-fileupload")
const path= require("path")

const cookieParser=require("cookie-parser")
const errorMiddleware= require("./middleware/error");

app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended:true}));
app.use(fileUpload())

//config
dotenv.config({path:"BackEnd/config/.env"});

// Route imports
const product = require("./routes/producctRoute");
const user=require("./routes/userRoutes");
const order= require("./routes/orderRoutes")
const payment= require("./routes/paymentRoutes")

app.use("/api/v",product);
app.use("/api/v",user);
app.use("/api/v",order)
app.use("/api/v",payment)

// app.use(express.static(path.join(__dirname, "../FrontEND")));

// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "../FrontEND/build/index.html"));
// });

//Middleware for error
app.use(errorMiddleware)

module.exports= app;
