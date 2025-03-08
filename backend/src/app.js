const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/router');
const Venue = require('./Venue');
const fs = require('fs');
const path = require ('path');
require('dotenv').config();

const app = express();
app.use(express.json());

const importData = async () => {
  try {
    const mongoURI = process.env.DB_URI;
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Database connected');

    const data = fs.readFileSync(path.join(__dirname, 'stores.json'), 'utf8');
    const venues = JSON.parse(data);

    await Venue.insertMany(venues);
    console.log('Data imported successfully');

    mongoose.disconnect();
  } catch (err) {
    console.error('Error importing data:', err);
  }
};

importData();

app.use((req, res, next) => { 
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
}
);

app.use((req, res, next) => {
    const start = Date.now();
    const method = req.method;
    const url = req.url;
    const clientIP = req.ip;
  
    console.log(
      `[${new Date().toLocaleString()}] ${method} ${url} - Client IP: ${clientIP}`,
    );
  
    res.on("finish", () => {
      const duration = Date.now() - start;
      console.log(
        `[${new Date().toLocaleString()}] ${method} ${url} - Processing time: ${duration}ms`,
      );
    });
  
    next();
});

app.get("/", (req, res) => res.send("All is Ok. Server operational"));
app.use("/api", router);

const mongoURI = process.env.DB_URI;

const PORT = process.env.PORT || 3001;

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    socketTimeoutMS: 100000,
    connectTimeoutMS: 100000,
  })
  .then(() => {
    console.log('DATABASE CONNECTION OK!');
    app.listen(PORT, () => {
      console.log(`This server is running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.log('Database Error', error);
    process.exit(1);
  });

