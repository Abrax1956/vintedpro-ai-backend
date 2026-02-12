import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {

    const data = req.body;

    const prompt = `
Sei un esperto di vendita su Vinted.

Analizza questo prodotto:

${JSON.stringify(data, null, 2)}

Rispondi SOLO in JSON con questa struttura:

{
  "prezzo_vendita_veloce": number,
  "prezzo_profitto_massimo": number,
  "descrizione_ottimizzata": string,
  "suggerimenti": string
}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Sei un esperto di marketplace e pricing." },
        { role: "user", content: prompt }
      ],
      temperature: 0.4
    });

    const response = completion.choices[0].message.content;

    res.status(200).json(JSON.parse(response));

  } catch (error) {
    res.status(500).json({ error: "Errore AI", details: error.message });
  }
}
