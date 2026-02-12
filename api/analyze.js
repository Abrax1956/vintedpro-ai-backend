import OpenAI from "openai";

export const config = {
  api: {
    bodyParser: true
  }
};

export default async function handler(req, res) {

  // 🔥 CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

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

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Sei un esperto di vendita su Vinted."
        },
        {
          role: "user",
          content: `
Analizza questo prodotto:

${JSON.stringify(listing)}

Genera risposta JSON con:
{
  "title": "...",
  "description": "...",
  "suggestedPrice": 0
}
`
        }
      ],
      temperature: 0.7
    });

    const aiText = completion.choices[0].message.content;

    const parsed = JSON.parse(aiText);

    return res.status(200).json(parsed);

  } catch (error) {
    console.error("AI ERROR:", error);
    return res.status(500).json({ error: "AI error" });
  }
}
