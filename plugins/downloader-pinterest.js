//Simple Base Botz// • Credits : wa.me/62895322391225 [ Asyl ]// • Feature : download/pindl
import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `❌ *Format salah!*
Contoh: ${usedPrefix + command} https://pin.it/xxxxx`;

    try {
        const apiUrl = `https://api.platform.web.id/pinterestdl?q=${encodeURIComponent(text)}`;
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error(`❌ API Error: ${res.status} ${res.statusText}`);

        const json = await res.json();
        console.log('📌 PinterestDL JSON:', JSON.stringify(json, null, 2));

        if (!json.success || !Array.isArray(json.media) || json.media.length === 0) {
            throw new Error("❌ Tidak ditemukan media di URL tersebut.");
        }

        const videoMedia = json.media.filter(media => media.extension === 'mp4');
        const imageMedia = json.media.filter(media => ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(media.extension));

        if (videoMedia.length > 0) {
            const video = videoMedia[0];
            await conn.sendMessage(m.chat, {
                video: { url: video.url },
                caption: `🎥 *Video Pinterest*
📌 *Kualitas:* ${video.quality}
📌 *Ukuran:* ${video.formattedSize}
📌 *URL:* ${text}`,
                fileName: `pinterest_${Date.now()}.mp4`,
                mimetype: 'video/mp4'
            }, { quoted: m });

            await conn.sendMessage(m.chat, { react: { text: '🎥', key: m.key } });
            return;
        }
        else if (imageMedia.length > 0) {
            const image = imageMedia.reduce((prev, current) =>
                prev.size > current.size ? prev : current
            );

            await conn.sendMessage(m.chat, {
                image: { url: image.url },
                caption: `🖼️ *Gambar Pinterest*
📌 *Kualitas:* ${image.quality}
📌 *Ukuran:* ${image.formattedSize}
📌 *URL:* ${text}`,
                fileName: `pinterest_${Date.now()}.${image.extension}`,
                mimetype: `image/${image.extension}`
            }, { quoted: m });

            await conn.sendMessage(m.chat, { react: { text: '🖼️', key: m.key } });
        } else {
            throw new Error("❌ Tidak ditemukan video atau gambar yang valid.");
        }

    } catch (e) {
        console.error('🚨 PinterestDL Error:', e);
        m.reply('🚨 *Error:* ' + (e.message || 'Terjadi kesalahan saat mengunduh media.'));
    }
};

handler.help = ['pinterest'].map(v => v + ' <url>');
handler.tags = ['downloader'];
handler.command = /^(pinterestdl|pindl)$/i;

handler.limit = 2
handler.register = true

export default handler
