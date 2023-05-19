const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.DB_PORT || 5000;
app.use(cors());
app.use(express.json());
require('dotenv').config();
const custom_datetime = require("./utility/custom_datetime");

app.get("/", (req, res) => {
    res.send("Server is running");
});

const uri =
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mk4vpll.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});
async function run() {
    try {
        const toyCollection = client
            .db("action-figure-toys")
            .collection("toys");

        // fetch all toys
        app.get("/toys/:userId?", async (req, res) => {
            const createdUserId = req.params.userId || 0;
            let query = {};
            if (createdUserId != 0) {
                query = { created_by: createdUserId };
            }
            const options = {
                sort: { created_at: -1 },
            };

            const cursor = toyCollection.find(query, options).limit(20);
            const result = await cursor.toArray();
            res.send(result);
        });

        // add new toy
        app.post("/toy/add", async (req, res) => {
            let todayDate = custom_datetime.curDate();

            const toyData = req.body;
            toyData.created_at = todayDate;
            const result = await toyCollection.insertOne(toyData);
            res.send(result);
        });

        // get information for particular toy
        app.get("/toy/edit/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const toy = await toyCollection.findOne(query);
            res.send(toy);
        });

        // update a toy
        app.put("/toy/update/:id", async (req, res) => {
            const id = req.params.id;
            const toyData = req.body;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };

            let todayDate = custom_datetime.curDate();

            const updatedToy = {
                $set: {
                    picture: toyData.picture,
                    name: toyData.name,
                    seller_name: toyData.seller_name,
                    seller_email: toyData.seller_email,
                    sub_category: toyData.sub_category,
                    price: toyData.price,
                    rating: toyData.rating,
                    quantity: toyData.quantity,
                    description: toyData.description,
                    created_at: todayDate,
                    created_by: toyData.created_by,
                },
            };
            const result = await toyCollection.updateOne(
                filter,
                updatedToy,
                options
            );
            res.send(result);
        });

        // delete a user
        app.delete("/toy/:id", async (req, res) => {
            const toyId = req.params.id;
            const query = { _id: new ObjectId(toyId) };
            const result = await toyCollection.deleteOne(query);
            res.send(result);
        });

        // get information by name searching
        app.get("/toy/search/:keyword", async (req, res) => {
            const name = req.params.keyword;
            const regexPattern = new RegExp(name, "i");
            const query = { name: regexPattern };
            const toy = await toyCollection.find(query).limit(20).toArray();
            res.send(toy);
        });
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
