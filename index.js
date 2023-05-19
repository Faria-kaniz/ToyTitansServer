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
        console.log(toyCollection);
        
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
