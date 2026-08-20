require('dotenv').config();

const express = require('express');
const path = require('path');

const { insertInquiry } = require('./db');
const { notifySalesperson } = require('./notify');

const app = express();

app.use(express.json());

// Serve the website
app.use(express.static(path.join(__dirname, 'public')));

// Receive customer inquiries
app.post('/webhook', async (req, res) => {
  const { name, phone, email, message } = req.body;

  if (!name || !message) {
    return res.status(400).json({
      error: 'Name and message are required'
    });
  }

  try {
    // Store inquiry
    const inquiry = await insertInquiry({
      name,
      phone,
      email,
      message
    });

    // Placeholder until AI categorization is enabled
    const placeholder = {
      category: 'uncategorized',
      summary: message
    };

    // Notify salesperson
    await notifySalesperson(inquiry, placeholder);

    res.status(200).json({
      success: true,
      id: inquiry.id
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
  res.status(200).json({ ok: true });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
