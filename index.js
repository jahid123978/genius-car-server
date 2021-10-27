const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const port = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ywrmz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run (){
  try{
     await client.connect();
    //  console.log("Connected to the database");
    const database = client.db("car-mechanics");
    const servicesCollection = database.collection("services");

    //GET API
    app.get('/services', async (req, res) =>{
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    })

    //GET single service
    app.get('/services/:id', async (req, res) =>{
      console.log("hitting services");
      const id = req.params.id;
      const query = { _id: ObjectId(id)};
      const ser = await servicesCollection.findOne(query);
      res.json(ser);
    })
    //POST api
    app.post('/services', async (req, res) => {
       const service = req.body;
      console.log(service);
       const result = await servicesCollection.insertOne(service);
       console.log(result);
      res.json(result);
    });

    //DELETE API
    app.delete('/services/:id', async (req, res) => {
       const id = req.params.id;
       const query = { _id: ObjectId(id)};
       const result = await servicesCollection.deleteOne(query);
      res.json(result);
      })
  }
  finally{
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send("Genius server is running now");
})

app.listen(port, () => {
    console.log("listening on port", port)
})