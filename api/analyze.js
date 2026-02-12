import OpenAI from "openai";

export default async function handler(req, res) {

  // 🔥 CORS HEADERS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // 🔥 Gestione preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const listing = req.body;

    const prompt = `
Sei un esperto di vendita su Vinted.

Analizza questo prodotto:

${JSON.stringify(listing)}

Genera:
- title ottimizzato
- description professionale
- suggestedPrice realistico

Rispondi SOLO in JSON con:
{
  "title": "...",
  "description": "...",
  "suggestedPrice": 0
}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    });

    const aiText = completion.choices[0].message.content;

    const parsed = JSON.parse(aiText);

    return res.status(200).json(parsed);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "AI Error" });
  }
}
