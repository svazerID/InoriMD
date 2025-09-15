import { sticker, addExif } from '../lib/sticker.js';
import uploadImage from '../lib/uploadImage.js';
import { Sticker } from 'wa-sticker-formatter';

let handler = m => m;

handler.all = async function (m) {
  const conn = this;
  const chat = global.db.data.chats[m.chat] || {};
  const user = global.db.data.users[m.sender] || {};

  if (chat.autosticker && !chat.isBanned && !user.banned && !m.isBaileys) {
    const q = m.quoted ? m.quoted : m;
    const mime = (q.msg || q).mimetype || q.mediaType || '';

    try {
      if (/video/.test(mime)) {
        if ((q.msg || q).seconds > 10) return conn.reply(m.chat, '⏱️ Durasi maksimal video adalah 10 detik!', m);

        const vid = await q.download?.();
        if (!vid) return conn.reply(m.chat, '❌ Gagal mengunduh video.', m);

        const loading = await conn.reply(m.chat, '⏳ Membuat stiker dari video...', m);

        let stiker = false;
        try {
          stiker = await sticker(vid, false, global.stickpack, global.stickauth);
        } finally {
          if (!stiker) {
            let out = await uploadImage(vid);
            stiker = await sticker(false, out, global.stickpack, global.stickauth);
          }
        }

        await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m);
        if (loading?.key) await conn.sendMessage(m.chat, { delete: loading.key });
      }

      else if (/image/.test(mime)) {
        const img = await q.download?.();
        if (!img) return conn.reply(m.chat, '❌ Gagal mengunduh gambar.', m);

        const loading = await conn.reply(m.chat, '⏳ Membuat stiker dari gambar...', m);

        let stiker = false;
        try {
          stiker = await addExif(img, global.stickpack, global.stickauth);
        } catch (e) {
          console.error(e);
        } finally {
          if (!stiker) {
            stiker = await createSticker(img, false, global.stickpack, global.stickauth);
          }
        }

        await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m);
        if (loading?.key) await conn.sendMessage(m.chat, { delete: loading.key });
      }

    } catch (e) {
      console.error('Autosticker Error:', e);
      conn.reply(m.chat, '❌ Terjadi kesalahan saat membuat stiker otomatis.\n\n' + (e.message || e), m);
    }
  }

  return true;
};

async function createSticker(img, url, packName, authorName, quality = 60) {
  let stickerMetadata = {
    type: 'full',
    pack: packName,
    author: authorName,
    quality
  };
  return (new Sticker(img || url, stickerMetadata)).toBuffer();
}

export default handler;