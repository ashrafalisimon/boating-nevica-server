const express = require('express');
require('dotenv').config();
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors())
app.use(express.json())


app.get('/', (req, res)=>{
    res.send('Running Boating Nevica...');
})

app.listen(port, ()=>{
    console.log('Boating Nevica Server is Running...');
})

