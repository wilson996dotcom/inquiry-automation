const Anthropic = require('@anthropic-ai/sdk');
const { categorizeInquiry } = require('./categorize');

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const CATEGORIES = ['pricing', 'enrollment', 'tour-request', 'general'];

async function categorizeInquiry(message) {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 300,
    messages: [
      {
        role: 'user',
        content: `Classify this daycare inquiry into exactly one of these categories: ${CATEGORIES.join(', ')}.
Also write a one-sentence summary a busy salesperson can scan in two seconds.

Inquiry: "${message}"

Respond ONLY with JSON, no other text, in this exact shape:
{"category": "...", "summary": "..."}`,
      },
    ],
  });

  const textBlock = response.content.find((block) => block.type === 'text');
  const parsed = JSON.parse(textBlock.text.trim());

  if (!CATEGORIES.includes(parsed.category)) {
    parsed.category = 'general';
  }
  return parsed;
}

module.exports = { categorizeInquiry, CATEGORIES };
