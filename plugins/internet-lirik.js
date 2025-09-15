import axios from 'axios';

async function lyrics(title) {
    try {
        if (!title) throw new Error('Title is required')
        
        const { data } = await axios.get(`https://lrclib.net/api/search?q=${encodeURIComponent(title)}`, {
            headers: {
                referer: `https://lrclib.net/search/${encodeURIComponent(title)}`,
                'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36'
            }
        })

        if (!data || !data[0]) throw new Error('No lyrics found')

        let song = data[0]

        let track = song.trackName || 'Unknown Track'
        let artist = song.artistName || 'Unknown Artist'
        let album = song.albumName || 'Unknown Album'
        let duration = song.duration ? `${Math.floor(song.duration / 60)}:${(song.duration % 60).toString().padStart(2, '0')}` : 'Unknown Duration'

        let lyr = song.plainLyrics || song.syncedLyrics
        if (!lyr) lyr = 'No lyrics available'

        lyr = lyr.replace(/\[.*?\]/g, '').trim()

        return `*name :* ${artist} - ${track}
*track name :* ${track}
*artist name :* ${artist}
*album name :* ${album}
*duration :* ${duration}

${lyr}`
    } catch (error) {
        throw new Error(error.message)
    }
}

let handler = async (m, { conn, args }) => {
    try {
        m.reply('wett')
        if (!args.length) throw new Error('mana judul nya bang?, contoh : .lirik nina feast')
        
        const title = args.join(' ')
        const resp = await lyrics(title)
        
        await conn.sendMessage(m.chat, { text: resp }, { quoted: m })
    } catch (err) {
        m.reply(`Eror kak : ${err.message}`)
    }
}

handler.help = ['lirik']
handler.tags = ['internet']
handler.command = ['lirik']

export default handler;