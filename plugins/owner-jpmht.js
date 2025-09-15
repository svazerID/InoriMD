const delay = time => new Promise(res => setTimeout(res, time));

/*
Oleh: KyzRyzz
Ini *Tanda air* saya bung!
Follow https://whatsapp.com/channel/0029VajfpGV0AgWEdZah4K07
*/

const feriv = {
    key: {
        participant: '0@s.whatsapp.net',
        remoteJid: '0@s.whatsapp.net'
    },
    message: { conversation: '_Takina-Wabot © 2025 AlfixD-Salman. All rights reserved._' }
};

const handler = async (m, { conn, text, participants }) => {
    let getGroups = await conn.groupFetchAllParticipating();
    let groups = Object.entries(getGroups).slice(0).map(entry => entry[1]);
    let anu = groups.map(v => v.id);
    for (let i of anu) {
        await delay(500);
        conn.sendMessage(i, { text: text, mentions: participants.map(a => a.id) }, { quoted: feriv }).catch(_ => _);
    }
};

handler.help = ['jpm'];
handler.tags = ['owner'];
handler.command = /^(jpm|jpmht)$/i;
handler.owner = true;

export default handler;