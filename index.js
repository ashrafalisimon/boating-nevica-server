const express = require('express');
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

        app.get('/service', async(req, res)=>{
            const query= {};
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

