const Product= require("../models/productModel")
const ErrorHandler=require("../utils/errorhandler")

const catchAsyncError = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apifeature");
const cloudinary= require("cloudinary")
// create product --Admin Route
exports.createProduct= catchAsyncError(async(req,res,next)=>{
  let images=[];
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }
  const imagesLinks = [];
  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;
  req.body.user=req.user.id;
  const product= await Product.create(req.body);
  res.status(201).json({
    sucess:true,
    product
  })
})


// get All product
exports.getAllProducts= catchAsyncError(async(req,res)=>{
  const resultPerPage=5;
  const productCount= await Product.countDocuments()
 const apifeature=new ApiFeatures(Product.find(),req.query).search().filter().pagination(resultPerPage)
    const products= await apifeature.query;

    res.status(200).json(
      {  sucess:true,
        products }
    )
})
//update product --admin

exports.updateProduct= catchAsyncError(async(req,res,next)=>{
    let product= await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("product not found",404))
       }
        // Images Start Here
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    // Deleting Images From Cloudinary
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }
     const imagesLinks = [];
     for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });
      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
     req.body.images = imagesLinks;
  }
    product = await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })
    res.status(200).json({
        sucess:true,
        product
    })
})
// delete Product

exports.deleteProduct= catchAsyncError(async(req,res,next)=>{
   const product = await Product.findById(req.params.id);
   if(!product){
    return next(new ErrorHandler("product not found",404))
   }

   // Deleting Images From Cloudinary
  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }
  
   await product.remove();
   res.status(500).json({
    sucess:true,
    message:"Product Delete SuceesFully"
   })
})

// get single product 

exports.getProductDetails= catchAsyncError(async(req,res,next)=>{
    const product =await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("product not found",404))
       }

       res.status(500).json({
        sucess:true,
        product,
        productCount,
       })
})

// Create New Review or update the review

exports.createProductReview= catchAsyncError(async(req,res,next)=>{
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg/product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
})

//get All reviews of a product
exports.getProductReviews=catchAsyncError(async(req,res,next)=>{
  const product= await Product.findById(req.query.id);
  if(!product){
    return next(new ErrorHandler("Product not found"),404)
  }
  res.status(200).json({
    sucess:true,
    reviews:product.reviews,
  })
})

// Delete Review
exports.deletReview=catchAsyncError(async(req,res,next)=>{
  const product= await Product.findById(req.query.productId);
  if(!product){
    return next(new ErrorHandler("Product not found"),404)
  }
  const reviews = product.reviews.filter(rev=>rev._id.toString()!=req.query.id) 
  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  const ratings = avg/reviews.length;
const numOfReviews
=reviews.length;
await Product.findByIdAndUpdate(
  req.query.productId,
  {
    reviews,
    ratings,
    numOfReviews,
  },
  {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  }
);
  res.status(200).json({
    sucess:true,
  })

})

