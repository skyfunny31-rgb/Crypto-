export default async function handler(req, res) {
  try {
    const userMessage = req.body.message || "Hello";

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 800,
        messages: [
          {
            role: "user",
            content: userMessage
          }
        ]
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(200).json({
        reply: "❌ " + data.error.message
      });
    }

    const reply =
      data?.content?.[0]?.text ||
      "⚠️ No response";

    res.status(200).json({ reply });

  } catch (err) {
    res.status(500).json({
      reply: "⚠️ Server error: " + err.message
    });
  }
}
