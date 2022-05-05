const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { json } = require('express/lib/response');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config();
const port = process.env.PORT || 5000
const app = express();



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0ib4x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const productCollection = client.db("perfumeWareHouse").collection
            ("perfumeCollection");
        const orderCollection = client.db("perfumeWareHouse").collection("order");
        // AUTH
        app.post('/login', async (req, res) => {
            const user = req.body;
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN, {
                expiresIn: '1d'
            });
            res.send({ accessToken })
        })
        app.get('/product', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        })

        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await productCollection.findOne(query);
            res.send(product);
        })
        app.post('/product', async (req, res) => {
            const newProduct = req.body;
            const result = await productCollection.insertOne(newProduct);
            res.send(result);
        })
        //    DELETE
        app.delete('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            res.send(result);
        })

        // Order collection api...
        app.get('/order', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = orderCollection.find(query);
            const orders = await cursor.toArray();
            res.send(orders);
        })
        app.post('/order', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result)

        })
        

        app.put('/product/update/:id', async (req, res) => {
            const id = req.params.id;
            const product = await productCollection.findOne({ _id: ObjectId(id) })
            console.log(product);
            const quantity = product.qty - 1
            console.log(quantity);
            const result = await productCollection.updateOne({ _id: ObjectId(id) }, { $set: { qty: quantity } });
            res.send(result);

          
        })
        app.put('/api/product/stock/:id', async(req,res)=>{
            const id =req.params.id;
            const quantity = req.params.qty;
            const product = await productCollection.findOne({_id: ObjectId(id)});
            if(product){
                const qty =parseInt(product.qty) + parseInt(quantity);
                res.send(qty)
            }

        
        })
        // app.put('/api/product/stock/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const quantity = req.body.qty;
        //     const product = await productCollection.findOne({ _id: ObjectId(id) });
        //     if (product) {
        //         const quantity = parseInt(product.qty) + parseInt( quantity);
        //         res.send(quantity)

        


    } finally {

    }

}
run().catch(console.dir)



// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("fdff")
})


app.listen(port, () => {
    console.log("Listinig to port", port)
})
