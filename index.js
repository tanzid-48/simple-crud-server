require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;

// Adds headers: Access-Control-Allow-Origin: *
app.use(cors());
// Json
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xhm3y2q.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const run = async () => {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // Get the database and collection on which to run the operation
    const db = client.db("simpleCrud");
    const userCollection = db.collection("users");

    app.get("/users", async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id),
      };
      const user = await userCollection.findOne(query);

      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      console.log("user id", id);
      res.send(user);
    });

    app.post('/users',async(req,res) =>{
      const newUser = req.body;
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    })

    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id),
      };
      const deleteUser = await userCollection.deleteOne(query);

      if (!deleteUser) {
        return res.status(404).send({ message: "User not found" });
      }
      console.log("user id", id);
      res.send(deleteUser);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
};
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Simple Crud server Serving");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
