const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

// Enable CORS and body parsing
app.use(cors());
app.use(bodyParser.json());

// Create SQLite database if not exists
const db = new sqlite3.Database('candle-manufacturing.db');

// Create tables if they do not exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    price REAL,
    costPrice REAL,
    materials TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    clientName TEXT,
    phone TEXT,
    email TEXT,
    items TEXT,
    price REAL,
    quantity INTEGER,
    totalPrice REAL
  )`);
});

// Get all products
app.get('/api/products', (req, res) => {
  db.all("SELECT * FROM products", (err, rows) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(rows);
  });
});

// Add a new product
app.post('/api/products', (req, res) => {
  const { name, price, costPrice, materials } = req.body;
  const stmt = db.prepare("INSERT INTO products (name, price, costPrice, materials) VALUES (?, ?, ?, ?)");
  stmt.run(name, price, costPrice, materials, function(err) {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(201).json({ id: this.lastID, name, price, costPrice, materials });
  });
  stmt.finalize();
});

// Delete a product
app.delete('/api/products/:id', (req, res) => {
  const stmt = db.prepare("DELETE FROM products WHERE id = ?");
  stmt.run(req.params.id, function(err) {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).send('Product deleted');
  });
  stmt.finalize();
});

// Get all orders
app.get('/api/orders', (req, res) => {
  db.all("SELECT * FROM orders", (err, rows) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(rows);
  });
});

// Add a new order
app.post('/api/orders', (req, res) => {
  const { clientName, phone, email, items, price, quantity, totalPrice } = req.body;
  const stmt = db.prepare("INSERT INTO orders (clientName, phone, email, items, price, quantity, totalPrice) VALUES (?, ?, ?, ?, ?, ?, ?)");
  stmt.run(clientName, phone, email, items, price, quantity, totalPrice, function(err) {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(201).json({ id: this.lastID, clientName, phone, email, items, price, quantity, totalPrice });
  });
  stmt.finalize();
});

// Generate Invoice PDF
app.get('/api/invoice/:orderId', (req, res) => {
  const orderId = req.params.orderId;
  db.get("SELECT * FROM orders WHERE id = ?", [orderId], (err, order) => {
    if (err || !order) {
      return res.status(404).send('Order not found');
    }

    const doc = new PDFDocument();
    const fileName = `invoice-${orderId}.pdf`;
    const filePath = `./invoices/${fileName}`;

    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(20).text('Invoice', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Client Name: ${order.clientName}`);
    doc.text(`Phone: ${order.phone}`);
    doc.text(`Email: ${order.email}`);
    doc.text(`Items: ${order.items}`);
    doc.text(`Price: $${order.price}`);
    doc.text(`Quantity: ${order.quantity}`);
    doc.text(`Total Price: $${order.totalPrice}`);
    doc.moveDown();

    doc.text(`Thank you for your business!`, { align: 'center' });

    doc.end();

    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error('Error sending file:', err);
      }
    });
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
