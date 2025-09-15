import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const args = text.split(' ');
  const type = args[0] || 'Visa';
  const amount = args[1] || 5;

  try {
    const response = await fetch(`https://api.platform.web.id/credit-generator?type=${encodeURIComponent(type)}&amount=${encodeURIComponent(amount)}`);
    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) throw new Error('Gagal mendapatkan data dari API!');

    let result = 'Berikut adalah nomor kartu kredit yang dihasilkan:\n\n';
    data.forEach(card => {
      result += `*Nama:* ${card.name}\n*Type:* ${card.type}\n*Nomor:* ${card.number}\n*CVV:* ${card.cvv}\n*Expire:* ${card.expiry}\n\n`;
    });

    await conn.sendMessage(m.chat, {
      text: result,
      caption: 'Kartu kredit berhasil dihasilkan!'
    }, { quoted: m });

  } catch (e) {
    console.error('Error:', e);
    m.reply('🚨 Error: ' + (e.message || e));
  }
}

handler.help = ['credit <type> <amount>'];
handler.tags = ['tools'];
handler.command = ['credit'];
handler.limit = true;

export default handler;