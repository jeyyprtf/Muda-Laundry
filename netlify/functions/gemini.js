// Ini adalah kode BACKEND (Serverless Function)
// Kode ini jalan di server Netlify, bukan di HP user. Aman.

exports.handler = async function(event, context) {
  // 1. Validasi Method (Cuma terima POST)
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  // 2. Ambil Prompt dari Frontend
  let body;
  try {
    body = JSON.parse(event.body);
  } catch (e) {
    return { statusCode: 400, body: "Invalid JSON" };
  }

  // 3. Ambil Kunci Rahasia dari Brankas Server
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return { statusCode: 500, body: "Server Error: API Key missing" };
  }

  // 4. Panggil Google Gemini (Sama kayak kodingan lama, tapi skrg di server)
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: body.prompt }] }]
        })
      }
    );

    const data = await response.json();

    // 5. Kirim Balik Jawaban ke Frontend
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };

  } catch (error) {
    console.error("Error fetching Gemini:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch from Google" }),
    };
  }
};