// Pengiriman email (SMTP) untuk OTP lupa kata sandi, pemberitahuan akun, dan email uji.
// Pengaturan dari SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM, MAIL_BALAS (lihat server/konfigurasi.js).
import nodemailer from 'nodemailer';

let transport = null;
let kunciTransport = '';

export const emailSiap = () => Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

function ambilTransport() {
  const port = Number(process.env.SMTP_PORT) || 465;
  const kunci = [process.env.SMTP_HOST, port, process.env.SMTP_USER, process.env.SMTP_PASS].join('|');
  if (!transport || kunci !== kunciTransport) {
    transport?.close?.();
    transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
    });
    kunciTransport = kunci;
  }
  return transport;
}

export async function kirimSurel({ ke, subjek, teks, html }) {
  if (!emailSiap()) throw Object.assign(new Error('Pengiriman email belum diatur (SMTP_HOST, SMTP_USER, SMTP_PASS).'), { kode: 'SUREL_BELUM' });
  await ambilTransport().sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    replyTo: process.env.MAIL_BALAS || undefined,
    to: ke,
    subject: subjek,
    text: teks,
    html,
  });
}

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Kerangka email bergaya brand (tabel + gaya inline agar tampil rapi di Gmail/Outlook)
export function templatSurel({ namaGereja, judul, paragraf = [], kode, tombol, catatan }) {
  const isiParagraf = paragraf.map((p) => `<p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#2A2826">${esc(p)}</p>`).join('');
  const kotakKode = kode
    ? `<div style="margin:22px 0;padding:18px;border-radius:14px;background:#F6F1E7;text-align:center;font-family:'Courier New',monospace;font-size:34px;font-weight:700;letter-spacing:10px;color:#121212">${esc(kode)}</div>`
    : '';
  const kotakTombol = tombol
    ? `<p style="margin:22px 0"><a href="${esc(tombol.href)}" style="display:inline-block;padding:12px 22px;border-radius:999px;background:#C89C4A;color:#121212;font-weight:700;text-decoration:none;letter-spacing:.06em;font-size:13px;text-transform:uppercase">${esc(tombol.label)}</a></p>`
    : '';
  const html = `<!doctype html><html lang="id"><body style="margin:0;padding:24px 12px;background:#F6F1E7;font-family:Arial,Helvetica,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#FFFCF6;border:1px solid #E3D9C4;border-radius:20px;overflow:hidden">
<tr><td style="background:#121212;padding:22px 28px;color:#C89C4A;font-family:Arial,Helvetica,sans-serif;font-weight:800;font-size:17px;letter-spacing:.14em;text-transform:uppercase">${esc(namaGereja)}</td></tr>
<tr><td style="padding:28px">
<h1 style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:24px;font-weight:600;color:#121212">${esc(judul)}</h1>
${isiParagraf}${kotakKode}${kotakTombol}
${catatan ? `<p style="margin:18px 0 0;font-size:13px;line-height:1.6;color:#8A8378">${esc(catatan)}</p>` : ''}
</td></tr>
<tr><td style="padding:16px 28px;border-top:1px solid #E3D9C4;font-size:12px;color:#8A8378">Gereja Bethel Indonesia · Kota Sorong</td></tr>
</table></td></tr></table></body></html>`;
  const teks = [judul, '', ...paragraf, ...(kode ? ['', `Kode: ${kode}`] : []), ...(tombol ? ['', `${tombol.label}: ${tombol.href}`] : []), ...(catatan ? ['', catatan] : [])].join('\n');
  return { html, teks };
}
