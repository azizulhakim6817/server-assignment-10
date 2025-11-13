const mongoose = require("mongoose");

const FoodSchema = new mongoose.Schema({
  foodName: { type: String, required: true },
  foodImage: { type: String, required: true }, // URL from imgbb
  foodQuantity: { type: String, required: true },
  pickupLocation: { type: String, required: true },
  expireDate: { type: Date, required: true },
  additionalNotes: { type: String },
  donator: {
    name: String,
    email: { type: String, required: true },
    photoURL: String,
    uid: String,
  },
  food_status: {
    type: String,
    enum: ["Available", "Donated"],
    default: "Available",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Food", FoodSchema);
