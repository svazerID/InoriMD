import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `Contoh: ${usedPrefix + command} <pesan>`;

  try {
    const apiUrl = 'https://api.platform.web.id/claude';

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: text
      })
    });

    const data = await response.json();

    if (data.response.status !== 'success') {
      console.error('API Error:', data);
      throw new Error(`API Error: ${data.response.msg || 'Terjadi kesalahan saat memproses permintaan.'}`);
    }

    const replyMessage = data.response.data;

    await conn.sendMessage(m.chat, { text: replyMessage }, { quoted: m });

  } catch (e) {
    console.error('Error:', e);
    m.reply('🚨 Error: ' + (e.message || e));
  }
}

handler.help = ['claude'];
handler.tags = ['ai'];
handler.command = ['claude'];
handler.limit = true;

export default handler