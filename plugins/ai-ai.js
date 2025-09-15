import fetch from 'node-fetch'

let chatHistory = {};

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `Contoh: ${usedPrefix + command} hai`;
  
  try {
    let chatId = m.chat;

    // Inisialisasi riwayat
    if (!chatHistory[chatId]) chatHistory[chatId] = [];

    // Tambah pesan user ke riwayat
    chatHistory[chatId].push(`User: ${text}`);

    // Gabungkan riwayat percakapan jadi satu string
    let conversation = chatHistory[chatId].join("\n");
    
    // Fetch API disini
    const apiUrl = `https://api.platform.web.id/ai?model=o4-mini&role=user&content=${encodeURIComponent(conversation)}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    if (!data.status) {
      console.error('API Error:', data); // Log detail error dari API
      throw new Error(`API Error: ${data.result?.error || 'Gagal mengambil respon dari API'}`);
    }
    
    const replyMessage = data.result

    // Simpan jawaban bot ke riwayat
    chatHistory[chatId].push(`Bot: ${replyMessage}`);

    // Batasi history maksimal 10 pesan (5 tanya-jawab)
    if (chatHistory[chatId].length > 10) {
      chatHistory[chatId] = chatHistory[chatId].slice(-10);
    }

    // Kirimkan jawaban ke user
    await conn.sendMessage(m.chat, { text: replyMessage }, { quoted: m });

  } catch (e) {
    console.error('Error:', e);
    m.reply('🚨 Error: ' + (e.message || e));
  }
}

handler.help = ['ai'];
handler.tags = ['ai'];
handler.command = ['ai'];
handler.limit = true;

export default handler