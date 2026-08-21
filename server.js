require('dotenv').config();

const express = require('express');
const path = require('path');

const { insertInquiry } = require('./db');
const { notifySalesperson } = require('./notify');
const { categorizeInquiry } = require('./categorize');

const app = express();

app.use(express.json());

// Serve your website from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Receive customer inquiries
app.post('/webhook', async (req, res) => {
  const { name, phone, email, message } = req.body;

  // Check required fields
  if (!name || !message) {
    return res.status(400).json({
      error: 'Name and message are required'
    });
  }

  try {
    // Step 1: Save the inquiry
    const inquiry = await insertInquiry({
      name,
      phone,
      email,
      message
    });

    // Step 2: Let AI analyze the inquiry
    const aiResult = await categorizeInquiry(message);

    // Step 3: Send inquiry and AI result to salesperson
    await notifySalesperson(inquiry, aiResult);

    // Send success response
    res.status(200).json({
      success: true,
      id: inquiry.id,
      category: aiResult.category,
      summary: aiResult.summary
    });

  } catch (err) {
    console.error('Webhook processing failed:', err);

    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    ok: true
  });
});

// Use Render's port
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
