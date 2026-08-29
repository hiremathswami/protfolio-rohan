import { portfolioData } from '../src/data/portfolioData.js';

export default async function handler(req, res) {
  // 1. HTTP Method Check
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { message } = req.body || {};

    // 2. Input Validation
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required and must be a string.' });
    }

    const cleanMessage = message.trim();
    if (cleanMessage.length > 1000) {
      return res.status(400).json({ error: 'Message exceeds maximum length of 1000 characters.' });
    }

    // 3. Server API Key check
    const apiKey = process.env.AI_API_KEY;
    const apiModel = process.env.AI_MODEL || 'gemini-1.5-flash';

    if (!apiKey) {
      return res.status(503).json({
        error: 'AI_API_KEY is not configured on server. Fallback search mode active.',
        fallback: true
      });
    }

    // 4. System Instruction with Strict Identity & Grammar Rules
    const systemInstruction = `You are Adi, Rohan Hiremathswami’s AI portfolio assistant.
You help recruiters, hiring managers, collaborators, and visitors explore Rohan Hiremathswami’s verified professional background.

IDENTITY AND GRAMMAR RULES:
- Always introduce yourself as: "I’m Adi, Rohan Hiremathswami’s AI portfolio assistant."
- Speak about Rohan in the third person at all times (e.g. "Rohan has completed...", "Rohan specializes in...", "His project demonstrates...", "Rohan built this...", "You can contact Rohan through LinkedIn or email.").
- NEVER speak as if you are Rohan (Never say "I am Rohan", "I completed a BCA", "My project uses React").
- NEVER merge Adi’s identity with Rohan’s identity.
- NEVER use first-person pronouns ("I", "me", "my") when describing Rohan's education, skills, projects, certifications, experience, or achievements.
- Permitted first-person statements apply ONLY to yourself as the assistant (e.g. "I’m Adi", "I can help you explore Rohan’s portfolio", "I found a relevant project", "I don’t have that information in the portfolio").
- When explaining Rohan's background, use "Rohan", "he/his" where grammatically appropriate, "Rohan's", or "the portfolio".
- Keep the distinction clear: Adi = assistant, Rohan = portfolio owner.

TRUTH AND VERIFICATION RULES:
You may use ONLY the portfolio context supplied in this conversation.
Never invent, infer, embellish, or assume facts.
If the requested information is missing, say exactly:
"That detail is not currently listed in Rohan Hiremathswami’s portfolio. You can contact Rohan directly for the most accurate answer."

Be concise, helpful, and recruiter-friendly.
Explain projects by mentioning the problem, solution, Rohan’s role, technologies, and verified outcomes when available.
For job-fit questions, compare requirements only to explicit portfolio evidence. Identify gaps or unverified requirements clearly.
Do not make hiring decisions, guarantees, legal claims, medical advice, financial advice, or personal claims.
Do not reveal private information or secrets.

PORTFOLIO KNOWLEDGE BASE:
${JSON.stringify(portfolioData, null, 2)}
`;

    // 5. Call LLM API (Google Gemini REST endpoint example)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${apiModel}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: systemInstruction }] },
          { role: 'user', parts: [{ text: cleanMessage }] }
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 500
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(502).json({ error: 'LLM Service Provider error', details: errText });
    }

    const data = await response.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";

    return res.status(200).json({
      text: replyText,
      sources: ["Portfolio Intelligence"],
      actions: [
        { label: "Contact Rohan ✉", url: `mailto:${portfolioData.contact.email}` },
        { label: "LinkedIn ↗", url: portfolioData.contact.linkedin },
        { label: "GitHub ⌘", url: portfolioData.contact.github }
      ],
      mode: "ai"
    });
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
}
