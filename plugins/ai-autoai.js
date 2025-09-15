import fetch from 'node-fetch'

let handler = async (m, { conn, text }) => {
    conn.TakinaGPT = conn.TakinaGPT || {};

    if (!text) throw `*Contoh:* .autoai *[on/off]*`;

    if (text === "on") {
        conn.TakinaGPT[m.sender] = { messages: [] };
        m.reply("[ ✓ ] Berhasil mengaktifkan bot TakinaGPT");
    } else if (text === "off") {
        delete conn.TakinaGPT[m.sender];
        m.reply("[ ✓ ] Berhasil menonaktifkan bot TakinaGPT");
    } else {
        throw `*Contoh:* .autoai *[on/off]*`;
    }
};

handler.before = async (m, { conn }) => {
    conn.TakinaGPT = conn.TakinaGPT || {};
    if (m.isBaileys && m.fromMe) return; // Abaikan pesan bot sendiri
    if (!m.text || !conn.TakinaGPT[m.sender]) return;

    // Abaikan jika teks dimulai dengan prefix tertentu
    const prefixes = [".", "#", "!", "/", "\\/"];
    if (prefixes.some(prefix => m.text.startsWith(prefix))) return;

    try {
        // sessionId unik berdasarkan sender
        const sessionId = encodeURIComponent(m.sender)
        const encodedMsg = encodeURIComponent(m.text)
        
        const res = await fetch(`https://api.platform.web.id/vivyai?sessionId=${sessionId}&msg=${encodedMsg}`)
        if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`)

        const json = await res.json()
        console.log('📝 VivyAI response:', JSON.stringify(json, null, 2))

        let vivy = '🤔 Yah, AI Takina diam saja...'

        // fallback robust untuk berbagai response shape
        if (json?.choices?.[0]?.message?.content) {
            vivy = json.choices[0].message.content.trim()
        } else if (json?.data?.choices?.[0]?.message?.content) {
            vivy = json.data.choices[0].message.content.trim()
        } else if (json?.history?.length) {
            vivy = json.history.at(-1)?.content?.trim() || vivy
        }

        // random emoji reaction
        const emojis = ['🤖', '💡', '✨', '💙', '🧠', '📝']
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)]
        await conn.sendMessage(m.chat, { react: { text: randomEmoji, key: m.key } })

        m.reply(vivy)

    } catch (e) {
        console.error('🚨 VivyAI error:', e)
        m.reply('🚨 Takina Error: ' + (e.message || e))
    }
}

handler.command = ['autoai']
handler.tags = ["ai"]
handler.help = ['autoai'].map(a => a + " *[on/off]*")

export default handler