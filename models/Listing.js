const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdBy: { type: String, required: true },

    businessName: { type: String, required: true },
    ownerName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine: { type: String, required: true },
    pincode: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },

    map: { type: String }, // e.g. URL or coordinates string

    paymentStatus: {
      type: String,
      enum: ["paid", "pending", "failed"],
      default: "pending",
    },

    paidAmount: { type: Number, default: 0 },

    subscriptionType: {
      type: String,
      enum: ["free", "basic", "premium"],
      default: "free",
    },

    images: [{ type: String }], // Array of image URLs or paths

    isActive: { type: Boolean, default: true }, // Active or inactive listing
  },
  { timestamps: true }
);

module.exports = mongoose.model("Listing", listingSchema);
