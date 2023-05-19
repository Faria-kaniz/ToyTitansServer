const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.DB_PORT || 5000;
app.use(cors());
app.use(express.json());
require('dotenv').config();


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
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
