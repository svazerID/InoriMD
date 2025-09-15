import { Sticker, StickerTypes } from 'wa-sticker-formatter';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    try {
        const sticker = new Sticker(
            'https://telegra.ph/file/2a72d5c87d590e6c596f2.jpg',
            {
                pack: global.packname, // Nama pack stiker
                author: global.author, // Nama pembuat
                type: StickerTypes.FULL, // Tipe stiker (FULL, CROP, CIRCLE, dll)
                quality: 75, // Kualitas (1-100)
                keepScale: true, // Menjaga aspek rasio
            }
        );

        const stickerBuffer = await sticker.toBuffer();
        if (stickerBuffer) {
            await conn.sendFile(m.chat, stickerBuffer, 'sticker.webp', '', m);
        } else {
            throw new Error("Gagal membuat stiker.");
        }
    } catch (error) {
        console.error(error);
        throw `❌ Error: ${error.message}`;
    }
};

handler.customPrefix = /^(@6283129667247)$/i;
handler.command = new RegExp();

export default handler;