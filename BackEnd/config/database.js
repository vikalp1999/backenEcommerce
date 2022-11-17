const mongoose= require("mongoose")

const connectDataBase=async ()=>{
   return  mongoose.connect(process.env.DB_URL)
}

module.exports= connectDataBase
