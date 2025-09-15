import { proto, generateWAMessageFromContent } from '@whiskeysockets/baileys';

let handler = async (m, { conn, args }) => {
    async function fetchParticipants(...jids) {
        let results = [];
        for (const jid of jids) {
            let { participants } = await conn.groupMetadata(jid);
            participants = participants.map(({ id }) => id);
            results = results.concat(participants);
        }
        return results;
    }

    async function mentionStatus(jids, content) {
        // Generate message content
        let messageContent;
        if (content.text) {
            messageContent = { conversation: content.text };
        } else if (content.image) {
            messageContent = {
                imageMessage: {
                    ...(content.caption ? { caption: content.caption } : {}),
                    url: content.image.url || '',
                    mimetype: 'image/jpeg',
                    fileSha256: Buffer.alloc(32, 0),
                    fileLength: '9999',
                    height: 720,
                    width: 720,
                    mediaKey: Buffer.alloc(32, 0),
                    directPath: '/',
                    mediaKeyTimestamp: new Date(),
                    jpegThumbnail: Buffer.alloc(0)
                }
            };
        } else if (content.video) {
            messageContent = {
                videoMessage: {
                    ...(content.caption ? { caption: content.caption } : {}),
                    url: content.video.url || '',
                    mimetype: 'video/mp4',
                    fileSha256: Buffer.alloc(32, 0),
                    fileLength: '9999',
                    height: 720,
                    width: 720,
                    mediaKey: Buffer.alloc(32, 0),
                    directPath: '/',
                    mediaKeyTimestamp: new Date(),
                    jpegThumbnail: Buffer.alloc(0)
                }
            };
        } else if (content.audio) {
            messageContent = {
                audioMessage: {
                    url: content.audio.url || '',
                    mimetype: 'audio/mpeg',
                    fileSha256: Buffer.alloc(32, 0),
                    fileLength: '9999',
                    mediaKey: Buffer.alloc(32, 0),
                    directPath: '/',
                    mediaKeyTimestamp: new Date(),
                    seconds: 10,
                    ptt: false
                }
            };
        }

        // Generate message
        const msg = generateWAMessageFromContent(
            proto.Message.fromObject({
                statusMessage: {
                    text: content.text || '',
                    ...(content.image ? { imageMessage: messageContent.imageMessage } : {}),
                    ...(content.video ? { videoMessage: messageContent.videoMessage } : {}),
                    ...(content.audio ? { audioMessage: messageContent.audioMessage } : {})
                }
            }),
            { userJid: conn.user.jid, quoted: m }
        );

        let statusJidList = [];
        for (const _jid of jids) {
            if (_jid.endsWith("@g.us")) {
                for (const jid of await fetchParticipants(_jid)) {
                    statusJidList.push(jid);
                }
            } else {
                statusJidList.push(_jid);
            }
        }
        statusJidList = [...new Set(statusJidList)];

        await conn.relayMessage('status@broadcast', msg.message, {
            messageId: msg.key.id,
            statusJidList,
            additionalAttributes: {
                mentionedJid: jids
            }
        });

        for (const jid of jids) {
            let type = jid.endsWith("@g.us") ? "groupStatusMentionMessage" : "statusMentionMessage";
            await conn.relayMessage(jid, {
                [type]: {
                    message: {
                        protocolMessage: {
                            key: msg.key,
                            type: 25
                        }
                    }
                }
            }, {
                additionalAttributes: {
                    isStatusMention: "true"
                }
            });
        }

        return msg;
    }

    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    let content = {};

    if (mime) {
        let media = await q.download();

        if (/image/.test(mime)) {
            content.image = { url: media };
        } else if (/video/.test(mime)) {
            content.video = { url: media };
        } else if (/audio/.test(mime)) {
            content.audio = { url: media };
        } else {
            return m.reply("Jenis file tidak didukung!");
        }

        if (q.text) content.caption = q.text;
    } else if (args[0]) {
        let url = args[0];
        let type = args[1] || 'text';

        if (type === 'image') {
            content.image = { url };
        } else if (type === 'video') {
            content.video = { url };
        } else if (type === 'audio') {
            content.audio = { url };
        } else {
            content.text = args.slice(1).join(" ") || url;
        }
    } else {
        return m.reply("Reply media atau masukkan URL dengan format:\n.status <url> <image/video/audio/text>");
    }

    mentionStatus([m.chat], content).catch(console.error);
};

handler.command = ['upswtag', 'tagsw'];
handler.tags = ['tools'];
handler.help = ['upswtag'];
handler.group = true
handler.owner = true
export default handler;