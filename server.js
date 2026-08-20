require('dotenv').config();
const express = require('express');
const { insertInquiry } = require('./db');
const { notifySalesperson } = require('./notify');
// AI categorization is turned off for now (requires Anthropic billing credit).
// To turn it back on: uncomment the categorize.js import and the two lines
// marked below, and pass { category, summary } into notifySalesperson instead
// of the placeholder object.
// const { categorizeInquiry } = require('./categorize');
// const { updateCategorization } = require('./db');

const app = express();
app.use(express.json());
app.get('/', (req, res) => {
  res.send('Inquiry Automation is running successfully!');
});

app.post('/webhook', async (req, res) => {
  const { name, phone, email, message } = req.body;

  if (!name || !message) {
    return res.status(400).json({ error: 'name and message are required' });
  }

  try {
    // 1. Store the inquiry immediately, so nothing is lost even if
    //    a later step (notification) fails.
    const inquiry = await insertInquiry({ name, phone, email, message });

    // 2. AI categorization step is skipped for now.
    // const { category, summary } = await categorizeInquiry(message);
    // await updateCategorization(inquiry.id, { category, summary });
    const placeholder = { category: 'uncategorized', summary: message };

    // 3. Notify the salesperson with the raw inquiry.
    await notifySalesperson(inquiry, placeholder);

    res.status(200).json({ success: true, id: inquiry.id });
  } catch (err) {
    console.error('Webhook processing failed:', err);
    res.status(500).json({ error: 'internal error' });
  }
});

app.get('/health', (req, res) => res.status(200).json({ ok: true }));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
