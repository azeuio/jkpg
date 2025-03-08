const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/router');
const Venue = require('./models/Venue');
const fs = require('fs');
const path = require ('path');
const cors = require('cors');

const app = express();
app.use(express.json());

const importData = async () => {
  try {
    const data = fs.readFileSync(path.join(__dirname, 'stores.json'), 'utf8');
    const venues = JSON.parse(data);

    await Venue.insertMany(venues);
    console.log('Data imported successfully');
  } catch (err) {
    console.error('Error importing data:', err);
  }
};

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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
    importData();
    app.listen(PORT, () => {
      console.log(`This server is running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.log('Database Error', error);
    process.exit(1);
  });


