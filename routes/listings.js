const express = require("express");
const router = express.Router();
const Listing = require("../models/Listing");
const authenticateToken = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");

// Setup multer storage (save files locally in 'uploads/' folder)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Make sure this folder exists
  },
  filename: (req, file, cb) => {
    // e.g. business-1234567890.jpg
    cb(null, "business-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Create a new listing with images
router.post(
  "/create",
  authenticateToken,
  upload.array("images", 5), // Accept up to 5 images
  async (req, res) => {
    try {
      const {
        businessName,
        ownerName,
        email,
        phone,
        addressLine,
        pincode,
        state,
        city,
        map,
        categoryId,
        subcategoryId,
        paymentStatus,
        paidAmount,
        subscriptionType,
        isActive,
      } = req.body;

      // Validate required fields
      if (
        !businessName ||
        !ownerName ||
        !email ||
        !phone ||
        !addressLine ||
        !pincode ||
        !state ||
        !city ||
        !categoryId ||
        !subcategoryId
      ) {
        return res
          .status(400)
          .json({ message: "Please fill all required fields." });
      }

      // Get uploaded image paths
      const images = req.files ? req.files.map((file) => file.path) : [];

      const newListing = new Listing({
        userId: req.user.id,
        createdBy: req.user.email,
        businessName,
        ownerName,
        email,
        phone,
        addressLine,
        pincode,
        state,
        city,
        categoryId,
        subcategoryId,
        map: map || "",
        paymentStatus: paymentStatus || "pending",
        paidAmount: paidAmount ? Number(paidAmount) : 0,
        subscriptionType: subscriptionType || "free",
        isActive:
          isActive !== undefined
            ? isActive === "true" || isActive === true
            : true,
        images,
      });

      await newListing.save();

      res.status(201).json({
        message: "Listing created successfully.",
        listing: newListing,
      });
    } catch (error) {
      console.error("Error creating listing:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Get all listings for logged-in user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const listings = await Listing.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .populate("state", "name")
      .populate("city", "name")
      .populate("categoryId", "name")
      .populate("subcategoryId", "name");
    console.log(listings, "listings in api");
    res.json({ listings });
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/listings/:id — Get listing by ID
router.get("/specific/:id", authenticateToken, async (req, res) => {
  try {
    console.log(req.params.id, "req.params.id");
    const listingId = req.params.id;
    const listing = await Listing.findById(listingId);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.status(200).json({ listing });
  } catch (err) {
    console.error("Error fetching listing:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
