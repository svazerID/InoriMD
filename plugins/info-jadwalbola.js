import axios from 'axios'
import * as cheerio from 'cheerio'
async function Today() {
    try {
        let tanggal = new Date()
        let format_tg = tanggal.toISOString().split('T')[0].replace(/-/g, '')
        const { data } = await axios.get(`https://www.espn.com/soccer/schedule/_/date/${format_tg}`)
        const $ = cheerio.load(data)
        let hasil = []
        let liga = ''
        $('.Table__Title, .Table__TBODY .Table__TR').each((_, el) => {
            if ($(el).hasClass('Table__Title')) {
                liga = $(el).text().trim()
            } else {
                const kolore = $(el).find('.Table__TD')
                const tim1 = kolore.eq(0).text().trim()
                const tim2 = kolore.eq(1).find('span').last().text().trim()
                const skor = tim1+' '+kolore.eq(1).text().trim()
                if (tim1 && tim2 && skor.includes('-')) {
                    hasil.push({
                        liga,
                        time: kolore.eq(2).text().trim() || 'Gak tau',
                        team1: tim1,
                        team2: tim2,
                        score: skor,
                        location: kolore.eq(3).text().trim() || 'Gak tau',
                        source: kolore.eq(0).find('a').attr('href') ? 'https://www.espn.com'+kolore.eq(0).find('a').attr('href') : 'Gak ada',
                        detail: kolore.eq(1).find('a').attr('href') ? 'https://www.espn.com'+kolore.eq(1).find('a').attr('href') : 'Gak ada'
                    })
                }
            }
        })
        return { 
            status: 'Sugses', 
            date: tanggal.toISOString().split('T')[0], 
            total: hasil.length, 
            data: hasil 
        }
    } catch (err) {
        throw new Error(err.message)
    }
}
async function Tomorrow() {
    try {
        let tanggal = new Date()
        tanggal.setDate(tanggal.getDate()+1)
        let format_tg = tanggal.toISOString().split('T')[0].replace(/-/g, '')
        const { data } = await axios.get(`https://www.espn.com/soccer/schedule/_/date/${format_tg}`)
        const $ = cheerio.load(data)
        let hasil = []
        let liga = ''
        $('.Table__Title, .Table__TBODY .Table__TR').each((_, el) => {
            if ($(el).hasClass('Table__Title')) {
                liga = $(el).text().trim()
            } else {
                const kolore = $(el).find('.Table__TD')
                const tim1 = kolore.eq(0).text().trim()
                const tim2 = kolore.eq(1).find('span').last().text().trim()
                if (tim1 && tim2) {
                    hasil.push({
                        liga,
                        time: kolore.eq(2).text().trim() || 'Gak tau',
                        team1: tim1,
                        team2: tim2,
                        tayang: kolore.eq(3).text().trim() || 'Gak tau',
                        location: kolore.eq(4).text().trim() || '-',
                        source: kolore.eq(0).find('a').attr('href') ? 'https://www.espn.com'+kolore.eq(0).find('a').attr('href') : 'Gak ada',
                        detail: kolore.eq(1).find('a').attr('href') ? 'https://www.espn.com'+kolore.eq(1).find('a').attr('href') : 'Gak ada'
                    })
                }
            }
        })
        return { 
            status: 'Sugses', 
            date: tanggal.toISOString().split('T')[0], 
            total: hasil.length, 
            data: hasil 
        }
    } catch (err) {
        throw new Error(err.message)
    }
}

const handler = async (m, { conn, text, command }) => {
    let format = text === 'today' ? 'Today' : 'Tomorrow';
    let res = format === 'Today' ? await Today() : await Tomorrow();
    
    if (res.total === 0) {
        return m.reply(`Tidak ada jadwal pertandingan untuk ${format.toLowerCase()}.`);
    }
    
    let teks = `*JADWAL BOLA ${format.toUpperCase()}*\n📅 Date: ${res.date}\n🏆 Total: ${res.total} pertandingan\n\n`;
    
    for (let i of res.data) {
        teks += `🏆 *Liga:* ${i.liga}\n`;
        teks += `⚽ *Tim:* ${i.team1} vs ${i.team2}\n`;
        teks += `⏰ *Waktu:* ${i.time}\n`;
        if (format === 'Today' && i.score) {
            teks += `📊 *Skor:* ${i.score}\n`;
        }
        teks += `🏟️ *Lokasi:* ${i.location}\n`;
        teks += `🔗 *Link:* ${i.detail}\n\n`;
    }
    
    m.reply(teks);
};

handler.help = ['jadwalbola'];
handler.command = ['jadwalbola'];
handler.tags = ['info'];
handler.limit = true;
export default handler;