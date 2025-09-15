import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `Contoh: ${usedPrefix + command} <jumlah_berita>`

  let jumlahBerita = parseInt(text);
  if (isNaN(jumlahBerita) || jumlahBerita <= 0) throw 'Jumlah berita harus berupa angka positif!'

  try {
    const response = await fetch('https://api.platform.web.id/detiknews');
    const data = await response.json();

    if (!data.status) throw 'Gagal mendapatkan data dari API.';

    let beritaList = data.result.slice(0, jumlahBerita);
    let message = 'Berita Terbaru:\n\n';

    beritaList.forEach((berita, index) => {
      message += `${index + 1}. ${berita.title}\nLink: ${berita.link}\n\n`;
    });

    await conn.sendMessage(m.chat, {
      text: message
    }, { quoted: m });
  } catch (e) {
    console.error('Error:', e);
    m.reply('🚨 Error: ' + (e.message || e));
  }
}

handler.help = ['detiknews <jumlah_berita>'];
handler.tags = ['internet'];
handler.command = ['detiknews'];
handler.limit = true;

export default handler;