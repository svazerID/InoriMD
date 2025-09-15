// plugins/ai/plugesm.js
import axios from 'axios';

// Handler utama
const handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) {
    throw `❗ Gunakan format:\n${usedPrefix + command} hi ada yang bisa saya bantu?`;
  }

  // Kirim reaksi menunggu
  await conn.sendMessage(m.chat, {
    react: { text: '🕒', key: m.key }
  });

  try {
    // Prompt sistem (instruksi utama untuk AI)
    const systemPrompt = `Mulai sekarang kamu adalah AI yang membantu saya mengembangkan bot WhatsApp menggunakan library Whiskeysocket Baileys. Botnya sudah ada, saya hanya perlu menambahkan fitur plugins ESM.

Tolong buatkan kode plugin ESM berdasarkan permintaan saya nanti.

📌 Contoh struktur dasar plugin:

import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw \`Contoh: \${usedPrefix + command} <isi>\`

  try {
    // kode utama di sini
  } catch (e) {
    console.error('Error:', e)
    m.reply('🚨 Error: ' + (e.message || e))
  }
}

handler.help = ['']
handler.tags = ['']
handler.command = ['']
handler.limit = true

export default handler

📎 Jika membutuhkan upload gambar gunakan:
import uploadImage from '../lib/uploadImage.js';

const q = m.quoted ? m.quoted : m;
    const mime = (q.msg || q).mimetype || q.mediaType || '';

    if (/^image/.test(mime) && !/webp/.test(mime)) {
      m.reply('⏳ Sedang memproses gambar, mohon tunggu...');

      const img = await q.download();
      const out = await uploadImage(img);
      if (!out) throw new Error('Gagal upload gambar!');
} else {
      m.reply('📷 Kirim gambar dengan caption *${usedPrefix + command}* atau tag gambar yang sudah dikirim.');
    }
    
📤 Contoh kirim media:
await conn.sendMessage(m.chat, {
  image: { url: imageUrl }, // bisa juga video, document, dll
  caption: 'Caption di sini'
}, { quoted: m });

🔊 Untuk audio:
await conn.sendMessage(m.chat, {
  audio: { url: audioUrl },
  mimetype: 'audio/mpeg',
  ptt: false, // set true jika ingin jadi VN
  fileName: '.mp3'
}, { quoted: m });

Nanti aku kirim API atau fungsi + output-nya, dan kamu buatkan pluginnya sesuai format di atas.`;

    // Panggil AI
    const aiResponse = await callOpenAI(text, systemPrompt);
    const replyText = typeof aiResponse === 'string' ? aiResponse : aiResponse.result || '✅ Berhasil!';

    await conn.reply(m.chat, replyText, m);
  } catch (e) {
    console.error('❌ Gagal memproses permintaan AI:', e);
    await m.reply('⚠️ Terjadi kesalahan saat memproses permintaan.');
  }
};

handler.help = ['plugesm'];
handler.command = /^plugesm$/i;
handler.limit = true;

export default handler;

// Fungsi pemanggil OpenAI API pihak ketiga
async function callOpenAI(userText, systemPrompt) {
  try {
    const { data } = await axios.post(
      'https://chateverywhere.app/api/chat/',
      {
        model: {
          id: 'gpt-3.5-turbo-0613',
          name: 'GPT-3.5',
          maxLength: 12000,
          tokenLimit: 4000,
          completionTokenLimit: 2500,
          deploymentName: 'gpt-35'
        },
        messages: [{ pluginId: null, content: userText, role: 'user' }],
        prompt: systemPrompt,
        temperature: 0.5
      },
      {
        headers: {
          Accept: '*/*',
          'User-Agent': 'Mozilla/5.0 (Android) Chrome/120.0.0.0 Mobile Safari/537.36'
        }
      }
    );

    return data;
  } catch (error) {
    console.error('❌ Gagal memanggil layanan AI:', error.message);
    throw new Error('Gagal menghubungi AI pihak ketiga');
  }
}