import OpenAI from "openai";

export default async function handler(req, res) {

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

Rispondi SOLO con JSON valido:
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

    const text = completion.choices[0].message.content;
    const parsed = JSON.parse(text);

    return res.status(200).json(parsed);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "AI error" });
  }
}
