const express = require("express");
const router = express.Router();
const State = require("../models/State");
const City = require("../models/City");
const authenticateToken = require("../middleware/authMiddleware");
const Category = require("../models/Category");
const Subcategory = require("../models/Subcategory");

// --- STATES ---

// Get all states
router.get("/states", authenticateToken, async (req, res) => {
  try {
    const states = await State.find();
    res.json(states);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new state
router.post("/states", authenticateToken, async (req, res) => {
  const { name } = req.body;
  console.log(req.body, "req.body");
  try {
    const existing = await State.findOne({ name });
    if (existing)
      return res.status(400).json({ message: "State already exists" });

    const state = new State({ name });
    await state.save();
    res.status(201).json(state);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a state
router.put("/states/:id", authenticateToken, async (req, res) => {
  try {
    const updated = await State.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a state
router.delete("/states/:id", authenticateToken, async (req, res) => {
  try {
    await State.findByIdAndDelete(req.params.id);
    res.json({ message: "State deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- CITIES ---

// ✅ Get all cities (with populated state name)
router.get("/cities", authenticateToken, async (req, res) => {
  try {
    const cities = await City.find().populate("stateId", "name");
    res.json(cities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Add a new city
router.post("/cities", authenticateToken, async (req, res) => {
  const { name, stateId } = req.body;
  try {
    const city = new City({ name, stateId });
    await city.save();

    // Populate before sending response
    const populatedCity = await City.findById(city._id).populate(
      "stateId",
      "name"
    );
    res.status(201).json(populatedCity);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ Update a city
router.put("/cities/:id", authenticateToken, async (req, res) => {
  const { name, stateId } = req.body;

  try {
    const city = await City.findById(req.params.id);
    if (!city) return res.status(404).json({ message: "City not found" });

    city.name = name || city.name;
    city.stateId = stateId || city.stateId;

    await city.save();

    const updatedCity = await City.findById(city._id).populate(
      "stateId",
      "name"
    );
    res.json(updatedCity);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ Delete a city
router.delete("/cities/:id", authenticateToken, async (req, res) => {
  try {
    const city = await City.findByIdAndDelete(req.params.id);
    if (!city) return res.status(404).json({ message: "City not found" });

    res.json({ message: "City deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- CATEGORY ---

// Get all
router.get("/categories", authenticateToken, async (req, res) => {
  try {
    const cats = await Category.find();
    res.json(cats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create
router.post("/categories", authenticateToken, async (req, res) => {
  try {
    const cat = new Category({ name: req.body.name });
    await cat.save();
    res.status(201).json(cat);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update
router.put("/categories/:id", authenticateToken, async (req, res) => {
  try {
    const cat = await Category.findById(req.params.id);
    if (!cat) return res.status(404).json({ message: "Category not found" });

    cat.name = req.body.name || cat.name;
    await cat.save();
    res.json(cat);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete
router.delete("/categories/:id", authenticateToken, async (req, res) => {
  try {
    const cat = await Category.findByIdAndDelete(req.params.id);
    if (!cat) return res.status(404).json({ message: "Category not found" });
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- SUBCATEGORY ---

// Get all with populated category
router.get("/subcategories", authenticateToken, async (req, res) => {
  try {
    const subs = await Subcategory.find().populate("categoryId", "name");
    res.json(subs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create
router.post("/subcategories", authenticateToken, async (req, res) => {
  try {
    const sub = new Subcategory({
      name: req.body.name,
      categoryId: req.body.categoryId,
    });
    await sub.save();
    const populated = await Subcategory.findById(sub._id).populate(
      "categoryId",
      "name"
    );
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update
router.put("/subcategories/:id", authenticateToken, async (req, res) => {
  try {
    const sub = await Subcategory.findById(req.params.id);
    if (!sub) return res.status(404).json({ message: "Subcategory not found" });

    sub.name = req.body.name || sub.name;
    sub.categoryId = req.body.categoryId || sub.categoryId;
    await sub.save();

    const updated = await Subcategory.findById(sub._id).populate(
      "categoryId",
      "name"
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete
router.delete("/subcategories/:id", authenticateToken, async (req, res) => {
  try {
    const sub = await Subcategory.findByIdAndDelete(req.params.id);
    if (!sub) return res.status(404).json({ message: "Subcategory not found" });
    res.json({ message: "Subcategory deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/location/cities/state/:stateId
router.get("/cities/state/:stateId", authenticateToken, async (req, res) => {
  try {
    const cities = await City.find({ stateId: req.params.stateId });
    res.json(cities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load cities" });
  }
});

// GET /api/location/subcategories/category/:categoryId
router.get(
  "/subcategories/category/:categoryId",
  authenticateToken,
  async (req, res) => {
    try {
      const subs = await Subcategory.find({
        categoryId: req.params.categoryId,
      });
      res.json(subs);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to load subcategories" });
    }
  }
);

module.exports = router;
