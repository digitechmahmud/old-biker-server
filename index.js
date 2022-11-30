const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rwqozng.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const categoryCollection = client.db('oldBiker').collection('categories');
        const bikeCollection = client.db('oldBiker').collection('bike');
        const userCollection = client.db('oldBiker').collection('users')
        const bookingCollection = client.db('oldBiker').collection('bookings')

        app.get('/categories', async (req, res) => {
            const query = {};
            const categories = await categoryCollection.find(query).toArray();
            res.send(categories);
        })

        app.get('/categories/:id', async (req, res) => {
            const id = req.params.id;
            const query = {catId: id}
            const result = await bikeCollection.find(query).toArray();
            res.send(result);
        })

        app.get('/users', async (req, res) => {
            const query = {};
            const users = await userCollection.find(query).toArray();
            res.send(users);
        })

        app.get('/users/:role', async (req, res) => {
            const role = req.params.role;
            const query = { role: role }
            const result = await userCollection.find(query).toArray();
            res.send(result);
        })

        app.get('/bookings', async (req, res) => {
            const query = {};
            const bookings = await bookingCollection.find(query).toArray();
            res.send(bookings);
        })

        app.get('/bookings/:email', async (req, res) => {
            const email = req.params.email;
            const query = { buyerEmail: email };
            const result = await bookingCollection.find(query).toArray();
            res.send(result);
        })

        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const user = await userCollection.findOne(query);
            res.send({ isAdmin: user?.role === 'admin' });
        })
        app.get('/users/seller/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const user = await userCollection.findOne(query);
            res.send({ isSeller: user?.role === 'Seller' });
        })

        app.get('/bikes', async (req, res) => {
            const query = {};
            const bikes = await bikeCollection.find(query).toArray();
            res.send(bikes);
        })
        app.get('/bikes/:email', async (req, res) => {
            const email = req.params.email;
            const query = {sellerEmail: email};
            const bikes = await bikeCollection.find(query).toArray();
            res.send(bikes);
        })
        app.get('/bike/:ad', async (req, res) => {
            const ad = req.params.ad;
            const query = { ad: ad };
            const result = await bikeCollection.find(query).toArray();
            res.send(result);
        })

        app.post('/users', async(req, res) =>{
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result);
        })

        app.post('/bikes', async (req, res) => {
            const product = req.body;
            const result = await bikeCollection.insertOne(product);
            res.send(result);
        })

        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            const result = await bookingCollection.insertOne(booking);
            res.send(result);
        })

        app.put('/bikes/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    ad: "true"
                },
            };
            const result = await bikeCollection.updateOne(filter, options, updateDoc);
            res.send(result);
        } )

        app.delete('/bikes/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bikeCollection.deleteOne(query);
            res.send(result);
        })

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            res.send(result);
        })

        app.delete('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookingCollection.deleteOne(query);
            res.send(result);
        })

    }
    finally {
        
    }
}

run().catch(err => console.log(err));


app.get('/', (req, res) => {
    res.send("Server is running")
})

app.listen(port, () => {
    console.log(`Server listening: ${port}`);
})