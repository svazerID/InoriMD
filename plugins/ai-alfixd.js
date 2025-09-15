import fetch from 'node-fetch';

// Simpan history percakapan per user (key = sender)
let conversationHistory = new Map();

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `Contoh: ${usedPrefix + command} <pertanyaan>`;

  const apiUrl = "https://api.mistral.ai/v1/conversations";
  const apiKey = "Bearer dzHFHOLdkI8mNiDhzedJPWMs049AwXbF"; // Ganti dengan API Key Anda

  // Ambil history user
  let userId = m.sender;
  if (!conversationHistory.has(userId)) {
    conversationHistory.set(userId, []);
  }

  // Ambil percakapan lama
  let history = conversationHistory.get(userId);

  // Tambahkan pesan baru dari user ke history
  history.push({ role: "user", content: text });

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': apiKey
      },
      body: JSON.stringify({
        // Kirim semua history agar AI tahu konteks
        inputs: history.map(h => `${h.role}: ${h.content}`).join("\n"),
        stream: false,
        agent_id: "ag:78bc2c85:20250908:alfixd-agent:4e903e2e"
      })
    });

    const data = await response.json();

    if (data.outputs && data.outputs.length > 0) {
      const answer = data.outputs[0].content;

      // Simpan jawaban ke history juga
      history.push({ role: "assistant", content: answer });

      // Update kembali history user
      conversationHistory.set(userId, history);

      await conn.sendMessage(m.chat, {
        text: answer
      }, { quoted: m });
    } else {
      m.reply('Tidak ada jawaban yang diterima dari API.');
    }
  } catch (e) {
    console.error('Error:', e);
    m.reply('🚨 Error: ' + (e.message || e));
  }
}

handler.help = ['ask <pertanyaan>'];
handler.tags = ['ai'];
handler.command = ['ask', 'alfixd'];
handler.limit = true;

export default handler;