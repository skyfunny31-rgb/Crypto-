export default async function handler(req, res) {
  try {
    const userMessage = req.body.message || "Hello";

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent?key=" + process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
You are CryptoMind AI.

Rules:
- Reply in user's language
- Give simple crypto explanation
- Add risk warning
- Use emoji
- If user asks price/chart, include tag like [[CHART:bitcoin]]

User: ${userMessage}
`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    // error handle
    if (data.error) {
      return res.status(200).json({
        reply: "❌ " + data.error.message
      });
    }

    // reply extract
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "⚠️ No response";

    res.status(200).json({ reply });

  } catch (err) {
    res.status(500).json({
      reply: "⚠️ Server error: " + err.message
    });
  }
}
