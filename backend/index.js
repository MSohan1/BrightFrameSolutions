import express from 'express';
import Razorpay from 'razorpay';
import cors from 'cors';
import crypto from 'crypto';
import dotenv from 'dotenv';

// Load environment variables from the root .env file
dotenv.config({ path: '../.env' });


const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Validate environment variables
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;


if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {

  console.error('❌ ERROR: Razorpay credentials are missing in environment variables!');
  process.exit(1);
}

// Initialize Razorpay with debug logging and additional config
console.log('Initializing Razorpay with key_id:', RAZORPAY_KEY_ID);
const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
  headers: {
    'Content-Type': 'application/json'
  }
});
console.log('Razorpay instance created successfully with headers');



// ✅ Root route
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Razorpay Payment Server is running' });
});

// ✅ Create order API
app.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const options = {
      amount: Math.round(amount * 100), // Convert amount to paise
      currency: 'INR',
      receipt: 'order_' + Date.now(),
    };

    console.log("Creating order with options:", options);

    const order = await razorpay.orders.create(options);
    console.log("✅ Order created:", order);

    res.json(order);
  } catch (error) {
    // console.error(err.stack);
    console.error('❌ Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order', details: error.message });
  }
});

// ✅ Verify payment API
app.post('/api/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing required payment verification parameters' });
    }

    // Create a signature using the order_id and payment_id
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    // Verify the signature
    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      console.log("✅ Payment verified successfully");
      res.json({ verified: true });
    } else {
      console.error("❌ Payment verification failed");
      res.status(400).json({ verified: false });
    }
  } catch (error) {
    console.error('❌ Error verifying payment:', error);
    res.status(500).json({ error: 'Error verifying payment', details: error.message });
  }
});

// ✅ Get payment details API
app.get('/api/payment/:paymentId', async (req, res) => {
  try {
    if (!req.params.paymentId) {
      return res.status(400).json({ error: 'Payment ID is required' });
    }

    const payment = await razorpay.payments.fetch(req.params.paymentId);
    res.json(payment);
  } catch (error) {
    console.error('❌ Error fetching payment:', error);
    res.status(500).json({ error: 'Error fetching payment details', details: error.message });
  }
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Something went wrong!' });
});

// ✅ Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
