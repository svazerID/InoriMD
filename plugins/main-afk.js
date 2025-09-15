let handler = async (m, { conn, text }) => {
    const pickRandom = (arr) => {
        return arr[Math.floor(Math.random() * arr.length)];
    }

   // let photo = pickRandom(global.fotoRandom);
    let user = global.db.data.users[m.sender];
    let _uptime = process.uptime() * 1000
    let uptime = clockString(_uptime)
    
    user.afk = +new Date();
    user.afkReason = text;

    conn.sendMessage(m.chat, {
        text: `${user.registered ? user.name : conn.getName(m.sender)} is now AFK\n\nReason ➠ ${text ? text : 'Tanpa Alasan'}`,
        contextInfo: {
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363420643650987@newsletter',
                newsletterName: `Powered By: ${global.author} / runtime ${uptime}`,
                serverMessageId: -1
            },
            forwardingScore: 256,
            externalAdReply: {
                title: global.wm,
                body: '',
                thumbnailUrl: 'https://kua.lat/inori',
                sourceUrl: sgc, // Ganti dengan link web yang sesuai
                mediaType: 1,
                renderLargerThumbnail: false
            }
        }
    });
}

handler.help = ['afk'].map(v => v + ' <alasan>');
handler.tags = ['group'];
handler.command = /^afk$/i;

export default handler;

function clockString(ms) {
    let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
    let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
    let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
    return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}