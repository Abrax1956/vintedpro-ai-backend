import OpenAI from "openai";

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const listing = req.body;

    const prompt = `
Sei un esperto di vendita su Vinted.

Analizza questo prodotto:

${JSON.stringify(listing, null, 2)}

Devi restituire SOLO JSON valido con questa struttura:

{
  "optimized_title": "...",
  "optimized_description": "...",
  "suggested_price": numero,
  "score": numero (0-100),
  "improvements": ["...", "..."]
}

Non aggiungere testo fuori dal JSON.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Sei un esperto di ottimizzazione annunci Vinted." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7
    });

    const responseText = completion.choices[0].message.content;

    return res.status(200).json({
      result: responseText
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}
