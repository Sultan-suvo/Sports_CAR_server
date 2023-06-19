const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.h2wm7t6.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const toyCollectoin = client.db("toysDB").collection("toyDetails");
    const shopCategoryCollection = client.db("toysDB").collection("shobCategory");

    app.get('/addToys', async (req, res) => {
      const cursor = toyCollectoin.find().limit(20);
      const result = await cursor.toArray();
      res.send(result)
    })

    app.get('/addToys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await toyCollectoin.findOne(query)
      res.send(result)
    })

    app.get('/addToys', async (req, res) => {
      let query = {};
      if (req.query?.email) {
        query = { sellerEmail: req.query.email };
      }
      const result = await toyCollectoin.find(query).sort({ price: 1 }).toArray();
      res.send(result);
    });



    app.post('/addToys', async (req, res) => {
      const newToys = req.body;
      const result = await toyCollectoin.insertOne(newToys);
      res.send(result)
    })


    app.put('/addToys/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const option = { upsert: true }
      const updateToy = req.body;
      const updateToyData = {
        $set: {
          description: updateToy.description,
          quantity: updateToy.quantity,
          price: updateToy.price,
        }
      };
      const result = await toyCollectoin.updateOne(filter,updateToyData,option);
      req.send(result)
    })

    

    app.delete('/addToys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await toyCollectoin.deleteOne(query)
      res.send(result)
    })


    app.get('/shobCategory', async (req, res) => {
      const result = await shopCategoryCollection.find().toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})