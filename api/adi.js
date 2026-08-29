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

    // 4. System Instruction with Strict Truth Rules
    const systemInstruction = `You are Adi, the professional portfolio assistant for ${portfolioData.profile.name}.
You help recruiters, hiring managers, collaborators, and visitors understand ${portfolioData.profile.name}’s verified professional background.

You may use ONLY the portfolio context supplied in this conversation.
Never invent, infer, embellish, or assume facts.
If the requested information is missing, say exactly:
"That detail is not currently listed in ${portfolioData.profile.name}’s portfolio. You can contact ${portfolioData.profile.name} directly for the most accurate answer."

Be concise, helpful, and recruiter-friendly.
Explain projects by mentioning the problem, solution, ${portfolioData.profile.name}’s role, technologies, and verified outcomes when available.
For job-fit questions, compare requirements only to explicit portfolio evidence. Identify gaps or unverified requirements clearly.
Do not make hiring decisions, guarantees, legal claims, medical advice, financial advice, or personal claims.
Do not reveal private information or secrets.
Stay focused on ${portfolioData.profile.name}’s portfolio, professional work, education, projects, skills, and contact information.

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
