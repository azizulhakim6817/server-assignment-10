const express = require("express");
require("dotenv").config();
const cors = require("cors");

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//! Database --------------------------
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

    //! update food
    app.put("/food/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const updatedData = req.body;
        const result = await foodsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedData }
        );
        res.status(200).json(result);
      } catch (error) {
        res.status(500).json({ message: "Update failed", error });
      }
    });

    //! delete food ----------
    app.delete("/food/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const result = await foodsCollection.deleteOne({
          _id: new ObjectId(id),
        });
        res.status(200).json(result);
      } catch (error) {
        res.status(500).json({ message: "Delete failed", error });
      }
    });

    await db.command({ ping: 1 });
    console.log("✅ Successfully connected to MongoDB!");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
}

//!  Create Food Request
app.post("/food-request", async (req, res) => {
  try {
    const request = req.body;
    request.status = "pending";
    request.createdAt = new Date();

    const result = await foodRequestsCollection.insertOne(request);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error creating food request:", error);
    res.status(500).json({ message: "Failed to create request" });
  }
});

//! Get requests by foodId
app.get("/food-requests/:foodId", async (req, res) => {
  try {
    const foodId = req.params.foodId;
    const requests = await foodRequestsCollection
      .find({ foodId: foodId })
      .toArray();
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching requests" });
  }
});

//! Update request status and food status
app.patch("/food-request/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { status, foodId } = req.body;

    const updateRequest = await foodRequestsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status } }
    );

    // if accepted → also update food status
    if (status === "accepted") {
      await foodsCollection.updateOne(
        { _id: new ObjectId(foodId) },
        { $set: { food_status: "donated" } }
      );
    }

    res.status(200).json({ message: "Request updated successfully" });
  } catch (error) {
    console.error("Error updating request:", error);
    res.status(500).json({ message: "Failed to update request" });
  }
});

run().catch(console.dir);

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
