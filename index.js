const express = require("express");
require("dotenv").config();
const cors = require("cors");

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//! Database -----------------------------------
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.aramfem.mongodb.net/plate-share-db`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const db = client.db("plate-share-db");

    const foodsCollection = db.collection("foods");

    app.post("/food", async (req, res) => {
      try {
        const newFood = req.body;
        // Optional: validate required fields
        if (!newFood.food_name || !newFood.donator_email) {
          return res
            .status(400)
            .json({ message: "Food name and donator email are required" });
        }
        const result = await foodsCollection.insertOne(newFood);
        res.status(201).json({
          message: "Food created successfully",
          foodId: result.insertedId,
        });
      } catch (error) {
        console.error("Error creating food:", error);
        res.status(500).json({ message: "Server error" });
      }
    });

    //! get food-----------------------------
    app.get("/foods", async (req, res) => {
      try {
        const cursor = foodsCollection.find();
        const result = await cursor.toArray();
        res.status(200).json(result);
      } catch (error) {
        console.error("Error fetching foods:", error);
        res.status(500).json({ message: "Server error" });
      }
    });

    //! single food get-----------------------------
    app.get("/food-details/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await foodsCollection.findOne(query);
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server error" });
      }
    });

    await db.command({ ping: 1 });
    console.log("✅ Successfully connected to MongoDB!");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
