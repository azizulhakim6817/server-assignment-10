const express = require("express");
const router = express.Router();
const Food = require("../models/Food");
const firebaseAuth = require("../middleware/firebaseAuth");
const uploadToImgbb = require("../utils/imgbb");

router.post("/", firebaseAuth, async (req, res) => {
  try {
    const {
      foodName,
      foodImage,
      foodQuantity,
      pickupLocation,
      expireDate,
      additionalNotes,
    } = req.body;

    // Upload image to imgbb
    const imageUrl = await uploadToImgbb(foodImage);

    const newFood = new Food({
      foodName,
      foodImage: imageUrl,
      foodQuantity,
      pickupLocation,
      expireDate,
      additionalNotes,
      donator: {
        name: req.user.name || req.user.email,
        email: req.user.email,
        photoURL: req.user.picture || "",
        uid: req.user.uid,
      },
      food_status: "Available",
    });

    await newFood.save();
    res.status(201).json({ message: "Food added successfully", food: newFood });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add food", error: err.message });
  }
});

module.exports = router;
