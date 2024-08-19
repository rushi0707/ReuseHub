/*
    THIS IS OUR SERVER PAGE
    Here we created 6 API's

    ******** Admin Side ***********
    1. /upload --> for image upload
    2. /addrpoduct --> to add new product
    3. /removeproduct --> to remove product
    4. /allproducts --> to get all products

    ******** Client Side (Frontend) ***********
    5. /signup --> for signup
    6. /login --> for lohin

    first 4 API endpoints use in Admin side
    and last 2 API endpoints use in frontend side.
*/

const port=  4000;
const express=require('express');
const app=express();
const mongoose=require('mongoose');
const jwt=require('jsonwebtoken');
const multer=require('multer');    // To upload images.
const path=require('path');
const cors=require('cors');
const { type, setPriority } = require('os');

app.use(express.json());
app.use(cors()); //using this our React project connect to this on 4000 port

// Database Connection
mongoose.connect('mongodb+srv://rushi:231807@cluster0.1xrhtdx.mongodb.net/project');

// API Creation 

app.get('/',(req,res)=>{
    res.send("Welocme");
})

app.get('/sell',(req,res)=>{
    
})

// 1. Creating Image Storage Engine
const storage=multer.diskStorage({
    destination:'./upload/images',
    filename:(req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
})

const upload=multer({storage:storage});
app.use('/images',express.static('upload/images'));

// 1. API endpoint for Image upload 
// Creating upload Endpoint for images and when successfully added it shows json msg.
// NOTE--> Always upload image with name product
app.post('/upload',upload.single('product'),(req,res)=>{
    res.json({
        success:1,
        image_url:`http://localhost:${port}/images/${req.file.filename}`
    })
})

// step.1 --> Schema for creating Products (create structure for product)
const Product = mongoose.model("Product",{
    id:{
        type:Number,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    new_price:{
        type:Number,
        required:true,
    },
    old_price:{
        type:Number,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    },
    available:{
        type:Boolean,
        default:true,
    },
    seller_name:{
        type:String,
        required:true,
    },
    contact:{
        type:String,
        required:true,
    },
});

// 2. API endpoint for adding the product. 
// Saving Product details in database (step 2 and 3)
app.post('/addproduct',async(req,res)=>{

    // Here we want give id to product in a sequence i.e. new product id must be last product id + 1.
    // and if we dont have any product then start id from 1.
    let products = await Product.find({}); // To get all products .
    let id;
    if(products.length>0)
    {
        let last_array = products.slice(-1);  // To get array with only last element.
        let last_product = last_array[0];
        id = last_product.id + 1;
    }  
    else
    {
        id=1;  // if product array is empty then start giving id from 1
    }

    // step.2--> Creating object of Product Schema (i.e. created new product)
    const product=new Product({   
        id:id,  
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,
        seller_name:req.body.seller_name,
        contact:req.body.contact,
    });   

    // step.3--> saving product into databse
    console.log(product);
    await product.save()  
    console.log("saved");
    res.json({
        success:true,
        name:req.body.name,
    })
})

// 3.  API endpoint for deleting products.

app.post('/removeproduct', async(req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("removed");
    res.json({
        success:true,
        name:req.body.name,
    })
})

// 4. API endpoint for getting all products.

app.get('/allproducts',async (req,res)=>{
    let products=await Product.find({});
    console.log("All Products Fetched");
    res.send(products);
})


// Creating Schema for user details
const Users = mongoose.model('Users',{
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object ,
    }, 
    date:{
        type:Date,
        default:Date.now,
    }
})

// 5. API endpoint for user Registration.
app.post('/signup', async (req, res) => {
    try 
    {
        // Check if the user already exists
        let check = await Users.findOne({ email: req.body.email });
        if (check) 
        {
            return res.status(400).json({
                success: false,
                error: "User already exists",
            });
        }

        // Initialize cart data
        let cart = {};
        for (let i = 0; i < 300; i++) {
            cart[i] = 0;
        }

        // Create a new user
        const user = new Users({
            name: req.body.username,
            email: req.body.email,
            password: req.body.password,
            cartData: cart,
        });

        // Save the user to the database
        await user.save();

        // Prepare token data
        const data = {
            user: {
                id: user.id,
            },
        };

        // Sign the JWT token (use an environment variable for the secret key)
        const token = jwt.sign(data, process.env.JWT_SECRET || 'default_secret_key');

        // Send success response with the token
        res.json({ success: true, token });
    } 
    catch (error) 
    {
        console.error(error);
        res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
});


// 6. API endpoint for user Login

app.post('/login', async (req, res) => {
    try 
    {
        // Step 1: Find user in the database using email
        const user = await Users.findOne({ email: req.body.email });

        if (user) {
            // Step 2: Compare provided password with the stored password
            if (req.body.password === user.password) 
            {
                // Password matches, create JWT token
                const data = { 
                    user: { 
                        id: user.id 
                    } 
                };
                const token = jwt.sign(data, process.env.JWT_SECRET || 'default_secret_key', { expiresIn: '1h' });
                return res.json({ success: true, token });
            } 
            else 
            {
                return res.status(401).json({ success: false, error: "Wrong Password" });
            }
        } 
        else 
        {
            return res.status(401).json({ success: false, error: "Wrong Email" });
        }
    } 
    catch (error) 
    {
        console.error('Error during login:', error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});

// 7. API endpoint  for New Collection
// Here we fetched recently added last 4 elements.
// NOTE --> Yout must have atleast 4 products to run this
app.get('/newcollections',async(req,res)=>{
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-4);
    console.log("new collection fetched");
    res.send(newcollection);
})

// Creating middleware to fetch user and we pass this middleware to /addtocart API
const secretKey = process.env.JWT_SECRET || 'default_secret_key';

async function fetchUser(req, res, next) {
    // Get the token from the header
    const token = req.header('auth-token');

    // Check if token is provided
    if (!token) {
        return res.status(401).send({
            errors: "Please authenticate using a valid token"
        });
    }

    try {
        // Verify the token and extract the user data
        const data = jwt.verify(token, secretKey);
        req.user = data.user;
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        res.status(401).send({
            errors: "Please authenticate using a valid token"
        });
    }
}

// 8.API endpoint for adding products in cartData (fetch data in addToCart function in ShopContext) 
// Here we also use fetchUser middleware which we created above 
//and using id given by fetchUser middleware we find user form database and store it in userData variable. 
app.post('/addtocart',fetchUser , async (req,res)=>{
    
    // step.1 get user details from user id 
    let userData = await Users.findOne({_id:req.user.id}); 

    // step.2 increase the count of product
    userData.cartData[req.body.itemId] = 1 ;

    // step.3 Update the cart details in database
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Added");
})



// 9.API endpoint for adding products in cartData 
app.post('/removefromcart',fetchUser , async (req,res)=>{
    
    console.log("removed",req.body.itemId);
    // step.1 get user details from user id 
    let userData = await Users.findOne({_id:req.user.id}); 

    // step.2 increase the count of product if count is >0 
    if(userData.cartData[req.body.itemId]>0)
    userData.cartData[req.body.itemId] = 0 ;

    // step.3 Update the cart details in database
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Removed");
})

// 10.API endpoint for get all products in cartData 
app.post('/getcart',fetchUser , async (req,res)=>{ 
    console.log("getCart");
    // step.1 get user details from user id 
    let userData = await Users.findOne({_id:req.user.id}); 

    // step.2 pass user data in json format.
    res.json(userData.cartData);
})

// Starting the Server
app.listen(port,(error)=>{
    if(!error){
        console.log('server running');
    }
    else{
        console.log('error' + error);
    }
});