// Main Express server file
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Create orders.json if it doesn't exist
const ordersPath = path.join(dataDir, 'orders.json');
if (!fs.existsSync(ordersPath)) {
  fs.writeFileSync(ordersPath, JSON.stringify([]));
}

// Create products.json if it doesn't exist
const productsPath = path.join(dataDir, 'products.json');
if (!fs.existsSync(productsPath)) {
  // Sample products data (same as on the frontend)
  const initialProducts = [
    {
      id: 'ring-g',
      name: '1/15 CT. Diamond Crescent Moon Ring',
      price: 289.99,
      image: 'images/ring_g.webp',
      description: '1/15 CT. T.W. Diamond Crescent Moon and Eight-Point Star Open Ring in 10K Gold'
    },
    {
      id: 'ring-s',
      name: 'Sterling Silver Crescent Moon Ring',
      price: 149.99,
      image: 'images/ring_s.webp',
      description: 'CUOKA MIRACLE Moon Ring, S925 Sterling Silver Crescent Moon Ring'
    },
    {
      id: 'gold-necklace',
      name: '14K Gold Crescent Moon Necklace',
      price: 349.99,
      image: 'images/gold_necklace.webp',
      description: 'Sofia Zakia Waning Crescent Moon Necklace in 14K Yellow Gold'
    },
    {
      id: 'silver-necklace',
      name: 'Silver Moon Charm Necklace',
      price: 179.99,
      image: 'images/silver_necklace.webp',
      description: 'Crescent Moon Charm Necklace With Blue Topaz Star In Sterling Silver'
    },
    {
      id: 'earrings',
      name: 'Diamond Star and Moon Earrings',
      price: 249.99,
      image: 'images/earrings.webp',
      description: 'Pave-Set Diamond Star and Moon Front-Back Dangle Earrings'
    },
    {
      id: 'earrings-g',
      name: 'Moonface Earrings with Diamonds',
      price: 229.99,
      image: 'images/earrings_g.webp',
      description: 'Hanging Crescent Moonface Earrings with Diamond Eyes'
    }
  ];
  
  fs.writeFileSync(productsPath, JSON.stringify(initialProducts, null, 2));
}

// Helper function to read JSON files
function readJsonFile(filePath) {
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
}

// Helper function to write to JSON files
function writeJsonFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// API Routes
// Get all products
app.get('/api/products', (req, res) => {
  try {
    const products = readJsonFile(productsPath);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve products' });
  }
});

// Get a specific product
app.get('/api/products/:id', (req, res) => {
  try {
    const products = readJsonFile(productsPath);
    const product = products.find(p => p.id === req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve product' });
  }
});

// Create a new order
app.post('/api/orders', (req, res) => {
  try {
    const { customer, items, totals } = req.body;
    
    // Basic validation
    if (!customer || !items || !totals) {
      return res.status(400).json({ error: 'Missing required order information' });
    }
    
    // Generate tracking number
    const trackingNumber = generateTrackingNumber();
    
    // Create new order object
    const newOrder = {
      id: Date.now().toString(),
      trackingNumber,
      customer,
      items,
      totals,
      status: 'Processing',
      orderDate: new Date().toISOString()
    };
    
    // Add to orders.json
    const orders = readJsonFile(ordersPath);
    orders.push(newOrder);
    writeJsonFile(ordersPath, orders);
    
    res.status(201).json({ 
      success: true, 
      orderId: newOrder.id,
      trackingNumber: newOrder.trackingNumber
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get order by ID or tracking number
app.get('/api/orders/:identifier', (req, res) => {
  try {
    const identifier = req.params.identifier;
    const orders = readJsonFile(ordersPath);
    
    // Check if looking up by ID or tracking number
    const order = orders.find(o => 
      o.id === identifier || o.trackingNumber === identifier
    );
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve order' });
  }
});

// Generate a random tracking number
function generateTrackingNumber() {
  const prefix = 'LS';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}-${timestamp}-${random}`;
}

// Catch-all route to redirect to index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});