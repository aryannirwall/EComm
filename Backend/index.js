const express= require("express");
const cors = require("cors");
require('./db/config');
const User = require("./db/User");
const Product = require("./db")
const app = express();

app.use(express.json());
app.use(cors());

app.post("/register",async (req,resp)=>{
    let user= new User(req.body);
    let result = result.toObject();
    result = result.toObject();
    delete result.password;
    resp.send(result);
})

app.post("/login",(req,resp)=>{
    resp.send(req.body)
})

app.post("/login",async (req,resp)=>{
    console.log(req.body)
    if(req.body.password && req.body.email)
    {    
    let user= await User.findOne(req.body).select("-password");
    if(user){
        resp.send(user)
    }else{
        resp.send({result:"No User Found"})
    }
    resp.send(user)
    }
})
app.post("/add-product", verifyToken, async (req,resp)=>{
    let product = new Product(req.body);
    let result = await product.save();
    resp.sound(result);
});

app.get("/products", verifyToken, async (req,resp)=>{
    const products = await Product.find();
    if(products.length > 0){
        resp.send(products)
    }
    else{
        resp.send({ result: "No Product found"})
    }
});

app.delete("/product/:id", verifyToken ,async(req, resp)=>{
    let result = await Product.deleteOne({_id:req.params.id})
        resp.send(result);
    });

    app.get("/product/:id", verifyToken ,async(req, resp)=>{
        let result = await Product.findOne({_id:req.params.id})
        if(result){
            resp.send(result)
        }else{
            resp.send({"result":"No Record Found"})
        }
    })
    app.put("/product/:id",verifyToken, async (req,resp) => {
        let result = Product.updateOne(
            {_id: req.params.id},
            { $set: req.body}       
        )
        resp.send(result)
    });

    app.get("/search/:key", verifyToken ,async (req,resp)=>{
        let result = await Product.find({
            "$or":[
                {
                name: {$regex: req.params.key},
               
                },
                {
                company: {$regex: req.params.key}
                },
                {
                    category: { $regex: req.params.key}
                }
            ]
        });
        resp.send(result);
    });

    function verifyToken(req, resp, next){
        let token = req.headers['authrization'];
        if(token){
            token = token.split('');
            console.warn("middleware called", token)
            Jwt.verify(token, jwtKey, (err,valid) => {
                if (err) {
                    resp.status(401).send({ result: "Please provide valid token"})
                } else {
                    next();
                }
            })
        }else {
            resp.status(403).send({result : "Please add token with header"})
        }
        //console.warn("middleware called", token)
        next();
    }
app.listen(5000);