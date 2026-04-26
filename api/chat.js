export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, system } = req.body;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1024,
        messages: [
          ...(system ? [{ role: 'system', content: system }] : []),
          ...messages,
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Groq error:', JSON.stringify(data));
      return res.status(response.status).json(data);
    }

    const text = data.choices?.[0]?.message?.content || '';
    return res.status(200).json({ text });

  } catch (err) {
    console.error('Handler error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
