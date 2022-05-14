const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors())
app.use(express.json())

// Connect to Cluster
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wdn4h.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const serviceCollection = client.db('nevica').collection('service');

        app.post('/login', async(req, res)=>{
            const user =req.body;
            const accessToken =jwt.sign(user, process.env.ACESS_TOKEN_SEKRITE,{
                expiresIn: '1d'
            });
            res.send(accessToken);
        })


        app.get('/service', async(req, res)=>{
            const email = req.query.email;
            const query= {email: email};
            const cursor= serviceCollection.find(query);
            const services= await cursor.toArray();
            res.send(services);
        })

        app.get("/service/:id", async(req, res)=>{
            const id =req.params.id;
            const query={_id: ObjectId(id)};
            const service= await serviceCollection.findOne(query);
            res.send(service);
        })

        // POST
        app.post('/service', async(req,res)=>{
            const newService = req.body;
            const result= await serviceCollection.insertOne(newService);
            res.send(result);
        });

        app.put('/service/:id', async(req, res)=>{
            const id = req.params.id;
            const updatedGuest = req.body;
            const filter = {_id: ObjectId(id)};
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    guests: updatedGuest.guests
                }
            };
            const result = await serviceCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })

        // Delete
        app.delete("/service/:id", async(req,res)=>{
            const id = req.params.id;
            const query={_id: ObjectId(id)};
            const result = await serviceCollection.deleteOne(query);
            res.send(result);
        })

    }
    finally{}
}
run().catch(console.dir);



// root api
app.get('/', (req, res)=>{
    res.send('Running Boating Nevica...');
})

app.listen(port, ()=>{
    console.log('Boating Nevica Server is Running...');
})

