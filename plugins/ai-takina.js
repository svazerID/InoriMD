import fetch from 'node-fetch';

// Simpan riwayat chat per-room
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

    // Encode untuk URL
    let url = `https://api.platform.web.id/grok?text=${encodeURIComponent(conversation)}`;

    // Request ke API
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Terjadi kesalahan saat menghubungi API');
    }

    // Ambil jawaban bot
    const replyMessage = data.choices?.[0]?.message?.content || "⚠️ Tidak ada jawaban dari API";

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

handler.help = ['takina <text>'];
handler.tags = ['ai'];
handler.command = ['takina'];
handler.limit = true;

export default handler;