import axios from 'axios';
import { Sticker } from 'wa-sticker-formatter';

const handler = async (m, { conn, text }) => {
  try {
      if (!text) throw "✳️ mau nyari sticker ape raju?"
    const { data } = await axios.get(
      `https://api.alfixd.my.id/api/pinterest?q=${encodeURIComponent(text)}`
    );
    
    if (!data?.results || !Array.isArray(data.results) || data.results.length === 0) {
      return m.reply('🚫 Tidak ada hasil yang ditemukan.');
    }

    const pickResult = pickRandom(data.results);
    const imageUrl = pickResult.image; 
    console.log('Gambar terpilih:', imageUrl);

    const stickpack = 'Sticker';
    const stickauth = '© InoriMD Powered By SvazerID';

    const sticker = new Sticker(imageUrl, {
      pack: stickpack,
      author: stickauth,
      type: 'full',    // pakai tipe full agar tidak crop
      categories: ['🐊', '🦖'], // contoh kategori emoji
      id: 'dino-sticker'
    });

    const buffer = await sticker.toBuffer();
    if (buffer) {
      await conn.sendFile(m.chat, buffer, 'cat.webp', '', m);
    } else {
      m.reply('🚫 Gagal membuat sticker.');
    }
  } catch (err) {
    console.error(err);
    m.reply('🚫 Terjadi kesalahan saat memproses permintaan.');
  }
};

handler.help = ['stickersearch'];
handler.tags = ['sticker'];
handler.command = ['stickersearch', 'ssticker','ssearch',];
handler.limit = 2;

export default handler;

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}