import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {

  // 🔥 CORS HEADERS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // 🔥 Risponde al preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {

    const data = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Sei un esperto di ottimizzazione annunci Vinted."
        },
        {
          role: "user",
          content: `
Ottimizza questo annuncio Vinted.

Dati:
${JSON.stringify(data, null, 2)}

Genera:
- titolo migliorato
- descrizione ottimizzata
- prezzo consigliato (numero)

Rispondi SOLO in JSON:
{
  "title": "...",
  "description": "...",
  "suggestedPrice": 123
}
`
        }
      ],
      temperature: 0.7
    });

    const text = completion.choices[0].message.content;

    const parsed = JSON.parse(text);

    return res.status(200).json(parsed);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Errore AI" });
  }
}
