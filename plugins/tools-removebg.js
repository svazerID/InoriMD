import axios from 'axios';
import uploadImage from '../lib/uploadImage.js';

let handler = async (m, { conn, usedPrefix, command }) => {
  try {
    const q = m.quoted ? m.quoted : m;
    const mime = (q.msg || q).mimetype || q.mediaType || '';
    if (/^image/.test(mime) && !/webp/.test(mime)) {
      const img = await q.download();
      const out = await uploadImage(img);
      m.reply(wait);
      let anu = `https://api.siputzx.my.id/api/iloveimg/removebg?image=${out}`;
      const response = await axios.get(anu, { responseType: 'arraybuffer' });
        conn.sendMessage(m.chat, {
                            image: Buffer.from(response.data),
                            caption: "done"
                        }, { quoted: m })
    } else {
      m.reply(`Kirim gambar dengan caption *${usedPrefix + command}* atau tag gambar yang sudah dikirim.`);
    }
  } catch (e) {
    console.error(e);
    throw `🚩 *Elorr*`
  }
}

handler.command = handler.help = ['removebg'];
handler.tags = ['ai'];
handler.premium = false;
handler.limit = true;

export default handler