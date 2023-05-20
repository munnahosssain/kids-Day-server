const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Hello kids day!")
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.47jeot4.mongodb.net/?retryWrites=true&w=majority`

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        client.connect();
        const toysCollection = client.db("toysDB").collection("toys");
        const galleryCollection = client.db("toysDB").collection("gallery");

        app.get('/allToys', async (req, res) => {
            const result = await toysCollection.find().limit(20).toArray();
            res.send(result);
        });

        app.get('/allToys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await toysCollection.findOne(query);
            res.send(result);
        });

        app.get("/myToys/:email", async (req, res) => {
            const email = req.params.email;
            const filter = { seller_email: email };
            const result = await toysCollection.find(filter).toArray();
            res.send(result);
        });

        app.post('/allToys', async (req, res) => {
            const query = req.body;
            const result = await toysCollection.insertOne(query);
            res.send(result);
        });

        app.get('/gallery', async (req, res) => {
            const result = await galleryCollection.find().toArray();
            res.send(result);
        });

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log(`Kids day listening on port ${port}`);
})