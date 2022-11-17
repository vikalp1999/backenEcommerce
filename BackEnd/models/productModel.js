const mongoose= require("mongoose")

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter product Name"],
        trim:true
    },
    description :{
       type: String,
       required:[true,"Please Enter product Description"] 
    },
    price:{
        type: Number,
        required:[true,"Please Enter product Description"] 
    },
    ratings:{
        type:Number,
        default:0
    },
    images:[
        {public_id:{
            type:String,
            required:true
        },
       url:{
            type:String,
            required:true
        }}

    ],
    category:{
        type:String,
        required:[true,"please Enter Product Category"]
    },
    stock:{
        type:Number,
        reuired:[true, "please Enter product Stock"],
        default:1
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            name:{
                type:String,
                required:true,
            },
            rating:{
                type:Number,
                required:true,
            },
            comment:{
                type:String,
                required:true
            }
        }
    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"Use",
        required:true,
    },
},{
    versionKey:false,
    timestamps:true
})

module.exports= mongoose.model("Product",productSchema);