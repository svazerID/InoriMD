import fetch from 'node-fetch';

let handler = async (m, { conn, command }) => {
    try {
        // Ambil data JSON dari URL
        let res = await fetchJson('https://raw.githubusercontent.com/Fiisya/Database-Json/refs/heads/main/ppcouple.json');
        
        // Pilih pasangan secara acak dari data JSON
        let random = res[Math.floor(Math.random() * res.length)];
        
        // Kirim gambar untuk pria
        await conn.sendMessage(m.chat, { 
            image: { url: random.male }, 
            caption: `Couple PP for Male` 
        }, { quoted: m });
        
        // Kirim gambar untuk wanita
        await conn.sendMessage(m.chat, { 
            image: { url: random.female }, 
            caption: `Couple PP for Female` 
        }, { quoted: m });
    } catch (err) {
        // Tangani kesalahan
        console.error(err);
        await conn.sendMessage(m.chat, { text: 'Maaf, terjadi kesalahan. Coba lagi nanti.' }, { quoted: m });
    }
};

// Properti tambahan untuk handler
handler.help = ['ppcp'];
handler.tags = ['internet'];
handler.command = /^ppcp$/i;

export default handler;

// Fungsi untuk mengambil data JSON dari URL
export const fetchJson = async (url, options) => {
    try {
        // Set default options jika tidak diberikan
        options = options || {};
        
        // Lakukan permintaan HTTP menggunakan fetch
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36',
                ...options.headers
            },
            ...options
        });

        // Periksa jika respons tidak OK
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        
        // Parse respons sebagai JSON
        return await res.json();
    } catch (err) {
        console.error(`Error fetching JSON: ${err.message}`);
        throw err;
    }
};