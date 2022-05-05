const express = require('express');
const cors = require('cors');
const { json } = require('express/lib/response');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config();
const port =process.env.PORT || 5000
const app =express();



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0ib4x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
        await client.connect();
        const productCollection =client.db("perfumeWareHouse").collection
        ("perfumeCollection");
        const orderCollection = client.db("perfumeWareHouse").collection("order");
       app.get('/product', async(req,res)=>{
        const query ={};
        const cursor = productCollection.find(query);
        const products = await cursor.toArray();
        res.send(products);
       })

       app.get('/product/:id', async(req, res)=>{
           const id= req.params.id;
           const query ={_id: ObjectId(id)};
           const product =await productCollection.findOne(query);
           res.send(product);
       })
       app.post('/product', async(req,res)=>{
           const newProduct =req.body;
           const result = await productCollection.insertOne(newProduct);
           res.send(result);
       })
    //    DELETE
    app.delete('/product/:id', async(req,res)=>{
        const id =req.params.id;
        const query ={_id: ObjectId(id)};
        const result = await productCollection.deleteOne(query);
        res.send(result);
    })

    // Order collection api...
    app.post('/order', async (req,res)=>{
        const order = req.body;
        const result =await orderCollection.insertOne(order);
        res.send(result)

    })
    // app.put('/product/:id', async(req,res)=>{
    //     const id =req.params.id;
    //     const updateProduct = req.body;
    //     const filter = {_id:ObjectId(id)};
    //     const option={upsert:true};
    //     const updateDoc={
    //         $set:{
    //             name:updateProduct.name
    //         }

    //     };
    //     const result = await productCollection.updateOne(filter, updateDoc,option);
    //     res.send(result);

    // })


    }finally{

    }

}
run().catch(console.dir)



// middleware
app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send("fdff")
})


app.listen(port, () => {
    console.log("Listinig to port",port)
  })
