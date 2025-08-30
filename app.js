// app.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const userRoutes = require("./routes/users");

const authRoutes = require("./routes/auth");
const listingsRoutes = require("./routes/listings");
const reviewRoutes = require("./routes/reviewRoutes");

const locationRoutes = require("./routes/locationRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

const { MongoClient, ServerApiVersion } = require("mongodb");
// const uri = "mongodb+srv://bsaikiranaws:y5T0D0b1WBpuVN8Y@cluster0.uzsslge.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// const uri =
//   "mongodb+srv://dev01:9DUo1b9tOkFRL8Tl@cluster0.uzsslge.mongodb.net/testdb?retryWrites=true&w=majority&appName=Cluster0";
const uri = "mongodb://localhost:27017/nearvisitapp";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10, // instead of poolSize
});

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  //   useCreateIndex: true,
});

const ConnectMongodb = () => {
  return mongoose
    .connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      //   useCreateIndex: true,
    })
    .then(() => {
      console.log("✅ Connected to MongoDB successfully.");
    })
    .catch((err) => {
      console.error("Failed to connect to MongoDB on startup", err);
    });
};

ConnectMongodb();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/listings", listingsRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/reviews", reviewRoutes);

app.use("/api/location", locationRoutes);

app.get("/", (req, res) => {
  res.send("Node.js backend for React Native is running.");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
