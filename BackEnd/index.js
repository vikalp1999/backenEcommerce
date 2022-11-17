const app =require("./app");
const dotenv=require("dotenv")
const cloudinary= require("cloudinary")
const connectDataBase=require("./config/database")

// Handling Uncaught Exception 
process.on("uncaughtException",(err)=>{
    console.log(`Error:${err.message}`)
    console.log(`shutting down the server due to Unhandled Exception`)
    process.exit(1)

})

//config
dotenv.config({path:"BackEnd/config/.env"});

//Connecting to database
connectDataBase();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

const server=app.listen(process.env.PORT,async()=>{
    await connectDataBase()
    console.log(`listening on http://localhost:${process.env.PORT}`)
})



//unhandled Promise Rejection
process.on("unhandledRejection",err=>{
    console.log(`Error:${err.message}`)
    console.log(`shutting down the server due to Unhandled Promise Rejction`)
   server.close(()=>{
    process.exit(1)
   })
}
)