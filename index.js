const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const query = require('express/lib/middleware/query');

require('dotenv').config();
const port = process.env.PORT || 4000;

const app = express();


// middleware
app.use(cors())
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2kgpg.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const serviceCollection = client.db('carServices').collection('service');
        
        app.get('/service',async(req, res) =>{
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

       app.get('/service/:id', async(req, res) =>{
           const id = req.params.id;
           const query = {_id:ObjectId(id)};
           const service = await serviceCollection.findOne(query);
           res.send(service);
       });
       //post
       app.post('/service', async(req, res)=>{
           const newService = req.body;
           const result = await serviceCollection.insertOne(newService);
           res.send(result);
       });

       //Delete
       app.delete('/service/:id', async(req, res) =>{
           const id = req.params.id;
           const query = {_id:ObjectId(id)};
           const result = await serviceCollection.deleteOne(query);
           res.send(result);
       })

    }
    finally{

    }
}

run().catch(console.dir);

app.get('/',(req,res) =>{
    res.send('Running Car Server')
})

app.listen(port, ()=>{
    console.log('Listening to pore',port);
});