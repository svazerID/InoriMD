import uploadImage from '../lib/uploadImage.js';
import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw 'Masukkan teks yang ingin diproses!';

    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || q.mediaType || '';

    if (!mime) {
        throw new Error("Tidak ada mimetype atau mediaType yang valid pada pesan.");
    }

    if (/image/.test(mime) && !/webp/.test(mime)) {
        await conn.reply(m.chat, '⏳ Sedang diproses, harap tunggu...', m);

        try {
            if (typeof q.download !== 'function') {
                throw new Error("Fungsi download tidak tersedia pada pesan.");
            }
            const img = await q.download();
            if (!img) throw new Error("Gagal mendownload gambar.");

            let out = await uploadImage(img);
            if (!out) throw new Error("Gagal mengunggah gambar atau URL kosong.");

            let encodedText = encodeURIComponent(text);
            let resultUrl = `https://api.platform.web.id/editimg?imageUrl=${out}&prompt=${encodedText}`;
            console.log("🔗 URL API:", resultUrl);

            let response = await axios.get(resultUrl);
            console.log("✅ API Response:", response.status, response.data);

            let data = response.data;
            if (!data || !data.image || !data.image.url) {
                throw new Error("Respons API tidak memiliki properti 'image.url' atau data kosong.");
            }
            let pepek = data.image.url;

            await conn.sendMessage(
                m.chat,
                {
                    image: { url: pepek },
                    caption: `✅ *Proses selesai!*\n\n📌 *Prompt:* ${text}`,
                },
                { quoted: m }
            );
        } catch (error) {
            console.error('❌ Error:', error);
            m.reply(`❌ Terjadi kesalahan: ${error.message || 'Unknown error'}`);
        }
    } else {
        m.reply(`⚠️ Kirim gambar dengan caption *${usedPrefix + command}* atau tag gambar yang sudah dikirim.`);
    }
};

handler.help = ['editimg'];
handler.tags = ['ai'];
handler.command = /^(geminiimage|editimg)$/i;
handler.register = false;
handler.limit = true;

export default handler;