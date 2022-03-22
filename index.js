const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const ObjectID = require("mongodb").ObjectId;
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://tayeb-rayhan10:mGaytY3zdR9fQ7xg@cluster0.yjiyu.mongodb.net/health__center?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  await client.connect();
  const database = client.db("health__center");
  const productsCollection = database.collection("AllProduct");
  const oderCollection = database.collection("AllOder");
  const usersCollection = database.collection("users");
  const reviewCollection = database.collection("review");

 
 

  // POST API user OderPlc
  app.post("/booking", async (req, res) => {
    const oder = req.body;
    const result = await oderCollection.insertOne(oder);
    console.log("result", result)
    res.json(result);
  });

  app.get("/booking", async (req, res) => {
    const cursor = oderCollection.find({});
    const allUsers = await cursor.toArray();
    res.send(allUsers);
  });

  // GET user OderPlc
  app.get("/userOder/:email", async (req, res) => {
    const email = { email: req.params.email };
    const result = await oderCollection
      .find({
        userEmail: req.params.email,
      })
      .toArray();
    res.send(result);
  });

  // DELETE Orders~
  app.delete("/userOder/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectID(id) };
    const result = await oderCollection.deleteOne(query);
    res.json(result);
  });

  // Update Orders
  app.put("/updateOrder/:id", async (req, res) => {
    const id = req.params.id;
    const update = req.body;
    const filter = { _id: ObjectID(id) };
    const options = { upseert: true };
    const updateDoc = {
      $set: {
        state: update.state,
      },
    };
    const result = await oderCollection.updateOne(filter, updateDoc, options);
    res.send(result);
  });

  // user data save database [name , email]
  app.post("/users", async (req, res) => {
    const user = req.body;
    const result = await usersCollection.insertOne(user);
    res.json(result);
  });

  app.get("/users", async (req, res) => {
    const cursor = usersCollection.find({});
    const allUsers = await cursor.toArray();
    res.send(allUsers);
  });

  // user data save database [name , email] google login
  app.put("/users", async (req, res) => {
    const user = req.body;
    const filter = { email: user.email };
    const options = { upsert: true };
    const updateDoc = { $set: user };
    const result = await usersCollection.updateOne(filter, updateDoc, options);
    res.json(result);
  });

  // admin crate
  app.put("/users/admin", async (req, res) => {
    const user = req.body;
    console.log("put", user);
    const email = { email: user.email };
    const updateDoc = { $set: { role: "admin" } };
    const result = await usersCollection.updateOne(email, updateDoc);
    res.json(result);
  });

  // GET API [fast on admin chack & admin Make new admin]
  app.get("/users/:email", async (req, res) => {
    const email = req.params.email;
    const query = { email: email };
    const user = await usersCollection.findOne(query);
    let isAdmin = false;
    if (user?.role == "admin") {
      isAdmin = true;
    }
    res.json({ admin: isAdmin });
  });

  // POST API [Review]
  app.post("/review", async (req, res) => {
    const review = req.body;
    const result = await reviewCollection.insertOne(review);
    res.json(result);
  });

  // GET API  [Review]
  app.get("/review", async (req, res) => {
    const cursor = reviewCollection.find({});
    const services = await cursor.toArray();
    res.send(services);
  });

  // DELETE Orders~
  app.delete("/deleteProduct/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectID(id) };
    const result = await productsCollection.deleteOne(query);
    console.log("hjg", result);
    res.json(result);
  });

  app.get("/users/:email", async (req, res) => {});
  try {
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running Genius Server");
});

app.listen(port, () => {
  console.log("running genius server");
});