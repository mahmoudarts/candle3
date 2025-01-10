const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const db = new sqlite3.Database('./candleManufacture.db');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Create tables if they don't exist
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY, name TEXT, price REAL, costPrice REAL, materials TEXT)");
  db.run("CREATE TABLE IF NOT EXISTS rawMaterials (id INTEGER PRIMARY KEY, name TEXT, quantity REAL, unit TEXT)");
  db.run("CREATE TABLE IF NOT EXISTS orders (id INTEGER PRIMARY KEY, clientName TEXT, items TEXT, totalPrice REAL)");
});

// Route to get products
app.get('/products', (req, res) => {
  db.all("SELECT * FROM products", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Route to add product
app.post('/products', (req, res) => {
  const { name, price, costPrice, materials } = req.body;
  const stmt = db.prepare("INSERT INTO products (name, price, costPrice, materials) VALUES (?, ?, ?, ?)");
  stmt.run(name, price, costPrice, materials, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, name, price, costPrice, materials });
  });
  stmt.finalize();
});

// Route to get raw materials
app.get('/rawMaterials', (req, res) => {
  db.all("SELECT * FROM rawMaterials", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Route to add raw material
app.post('/rawMaterials', (req, res) => {
  const { name, quantity, unit } = req.body;
  const stmt = db.prepare("INSERT INTO rawMaterials (name, quantity, unit) VALUES (?, ?, ?)");
  stmt.run(name, quantity, unit, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, name, quantity, unit });
  });
  stmt.finalize();
});

// Route to get orders
app.get('/orders', (req, res) => {
  db.all("SELECT * FROM orders", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Route to add order
app.post('/orders', (req, res) => {
  const { clientName, items, totalPrice } = req.body;
  const stmt = db.prepare("INSERT INTO orders (clientName, items, totalPrice) VALUES (?, ?, ?)");
  stmt.run(clientName, items, totalPrice, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, clientName, items, totalPrice });
  });
  stmt.finalize();
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
