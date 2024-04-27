const express = require ('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
// middleWare
app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.aq8mwv9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri)

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
    await client.connect();

    const database = client.db("artDB");
    const artCollection = database.collection("art");

    app.get('/art', async(req,res) =>{
      const cursor = artCollection.find();
      const result = await cursor.toArray();
      res.send(result);

    })

    app.post('/art', async(req,res) =>{
        const newArt = req.body;
        console.log('new user', newArt);
        const result = await artCollection.insertOne(newArt);
        res.send(result);
    })

    app.get('/arts/:id', async(req,res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const art = await artCollection.findOne(query);
      res.send(art);
    })

    app.get("/myArt/:email", async(req,res)=>{
      console.log(req.params.
        email);
      const result = await artCollection.find({
        user_email: req.params.
        email}).toArray();
      res.send(result);
    })

    app.delete('/art/:id', async(req,res) =>{
      const id = req.params.id;
      console.log('delete from database', id);
      const query = { _id: new ObjectId(id) };
      const result = await artCollection.deleteOne(query);
      res.send(result);
    })

    app.put('/arts/:id', async(req,res) =>{
      const id = req.params.id;
      console.log(id,user);
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const  UpdatedArt= req.body;
      const Art = {
        $set: {
          image_url: UpdatedArt.image_url,
          item_name: UpdatedArt.item_name,
          subcategory_name: UpdatedArt.subcategory_name,
          description: UpdatedArt.description,
          price: UpdatedArt.price,
          rating: UpdatedArt.rating,
          customization: UpdatedArt.customization,
          processing_time: UpdatedArt.processing_time,
          stock_status: UpdatedArt.stock_status
        },
      }
      const result = await artCollection.updateOne(filter,Art,options);
      res.send(result);

    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req,res) =>{
    res.send('ArtNest crud is running')
})

app.listen(port, () =>{
    console.log(`ArtNest crud port, ${port}`)
})