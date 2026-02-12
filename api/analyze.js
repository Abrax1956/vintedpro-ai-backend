import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {

  // ✅ CORS FIX
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {

    const data = req.body;

    const prompt = `
Sei un esperto di vendite su Vinted.

Analizza questo prodotto:

${JSON.stringify(data, null, 2)}

Genera:
1. Titolo ottimizzato SEO
2. Descrizione professionale persuasiva
3. Prezzo suggerito realistico in euro (solo numero)

Rispondi SOLO in formato JSON con questa struttura:

{
  "title": "...",
  "description": "...",
  "suggestedPrice": 0
}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Sei un esperto di e-commerce e ottimizzazione annunci." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7
    });

    const text = completion.choices[0].message.content;

    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = {
        title: data.title,
        description: data.description,
        suggestedPrice: data.price
      };
    }

    return res.status(200).json(parsed);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Errore interno server" });
  }
}
