let handler = async (m, { conn, command }) => {
let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender;
let name = await conn.getName(who);
const repPy = {
        key: {
            remoteJid: '0@s.whatsapp.net',
            fromMe: false,
            id: '3EB0' + (new Date()).getTime(),  // Generate a unique ID
            participant: '0@s.whatsapp.net'
        },
        message: {
            requestPaymentMessage: {
                currencyCodeIso4217: "USD",
                amount1000: 999999999,
                requestFrom: '0@s.whatsapp.net',
                noteMessage: {
                    extendedTextMessage: {
                        text: 'Owner Bot' // Replace 'Your Bot Name' with the actual bot name
                    }
                },
                expiryTimestamp: 999999999,
                amount: {
                    value: 91929291929,
                    offset: 1000,
                    currencyCode: "INR"
                }
            }
        }
    };
    
  conn.sendContact(m.chat, owner, repPy)
  await conn.reply(m.chat, `Hallo ${name}, ini nomor owner:`, repPy); // Fixed `this.reply`
};

handler.help = ['owner'];
handler.tags = ['info'];
handler.command = /^owner$/i;

export default handler;