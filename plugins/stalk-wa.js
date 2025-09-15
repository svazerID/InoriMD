import moment from 'moment-timezone'
import PhoneNumber from 'awesome-phonenumber'

const regionNames = new Intl.DisplayNames(['id'], { type: 'region' })

const detectOperator = (num) => {
  const prefix = num.replace('+62', '').slice(0, 3)
  if (/^(811|812|813|821|822|823|851|852|853|858)$/.test(prefix)) return 'Telkomsel'
  if (/^(814|815|816|855|856|857|859|895|896|897|898|899)$/.test(prefix)) return 'Indosat / Tri'
  if (/^(817|818|819|877|878)$/.test(prefix)) return 'XL Axiata'
  if (/^(831|832|833|838)$/.test(prefix)) return 'AXIS'
  if (/^(881|882|883|884|885|886|887|888|889)$/.test(prefix)) return 'Smartfren'
  return 'Tidak diketahui'
}

const handler = async (m, { conn, text, usedPrefix, command }) => {
  let num = m.quoted?.sender || m.mentionedJid?.[0] || text
  if (!num) {
    return conn.reply(m.chat, `🌸 Gomen senpai~ siapa nih yang mau stalk?\n\nContoh:\n${usedPrefix + command} @tag atau 628xxxxx`, m)
  }

  num = num.replace(/\D/g, '') + '@s.whatsapp.net'
  const exists = await conn.onWhatsApp(num).catch(() => [])
  if (!exists[0]?.exists) {
    return conn.reply(m.chat, `🚫 Maaf Senpai, nomor itu tidak terdaftar di WhatsApp~`, m)
  }

  const img = await conn.profilePictureUrl(num, 'image').catch(() => null)
  const bio = await conn.fetchStatus(num).catch(() => null)
  const business = await conn.getBusinessProfile(num).catch(() => null)

  let name
  try {
    name = await conn.getName(num)
  } catch {
    name = 'Tidak diketahui'
  }

  const nomorIntl = `+${num.split('@')[0]}`
  const format = PhoneNumber(nomorIntl)
  const isValid = format.valid
  const country = isValid ? (regionNames.of(format.regionCode) || 'Tidak diketahui') : 'Tidak diketahui'
  const jenisNomor = isValid ? (format.type || 'Tidak diketahui') : 'Tidak diketahui'
  const nomorFormatted = format.number?.international || nomorIntl
  const operator = nomorIntl.startsWith('+62') ? detectOperator(nomorIntl) : '-'

  let waInfo = `📱 *Stalking WhatsApp Senpai~*\n\n` +
    `👤 *Nama:* ${name}\n` +
    `📞 *Nomor:* ${nomorFormatted}\n` +
    `🌍 *Negara:* ${country.toUpperCase()}\n` +
    `📡 *Jenis Nomor:* ${jenisNomor}\n` +
    `📶 *Operator:* ${operator}\n` +
    `🔗 *Link WA:* https://wa.me/${num.split('@')[0]}\n` +
    `🗣️ *Sebutan:* @${num.split('@')[0]}\n` +
    `📝 *Status:* ${bio?.status || '-'}\n` +
    `📅 *Diperbarui:* ${bio?.setAt ? moment(bio.setAt).locale('id').format('LLLL') : '-'}`

  if (business) {
    waInfo += `\n\n🏢 *Akun Bisnis~*\n` +
      `✅ *Verified:* ${business.verified_name ? 'Ya (Centang Hijau~)' : 'Tidak'}\n` +
      `🆔 *Business ID:* ${business.wid}\n` +
      `🌐 *Website:* ${business.website || '-'}\n` +
      `📧 *Email:* ${business.email || '-'}\n` +
      `🏬 *Kategori:* ${business.category || '-'}\n` +
      `📍 *Alamat:* ${business.address || '-'}\n` +
      `🕰️ *Zona Waktu:* ${business.business_hours?.timezone || '-'}\n` +
      `📋 *Deskripsi:* ${business.description || '-'}`  
  } else {
    waInfo += `\n\n💬 *Akun WhatsApp Biasa~*`
  }

  try {
    if (img) {
      await conn.sendMessage(m.chat, {
        image: { url: img },
        caption: waInfo,
        mentions: [num]
      }, { quoted: m })
    } else {
      await conn.sendMessage(m.chat, {
        text: waInfo,
        mentions: [num]
      }, { quoted: m })
    }
  } catch (e) {
    console.error('[WASTALK]', e)
    await conn.sendMessage(m.chat, {
      text: waInfo,
      mentions: [num]
    }, { quoted: m })
  }
}

handler.help = ['wastalk']
handler.tags = ['stalk']
handler.command = /^(wa|whatsapp)stalk$/i

handler.register = true

export default handler