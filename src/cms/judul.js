// Judul di website memakai <em> (warna emas) dan <br/> (baris baru).
// Di panel CMS ditulis lebih mudah: *kata* untuk emas, Enter untuk baris baru.

export function keMarkup(html = '') {
  return String(html)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/?em>/gi, '*')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
}

// Judul HTML -> teks biasa (untuk alt gambar, meta description, dsb.)
export const teksPolos = (html = '') => keMarkup(html).replace(/\*/g, '').replace(/\s*\n\s*/g, ' ').trim();

export function keHtml(markup = '') {
  return String(markup)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*([^*\n]+)\*/g, '<em>$1</em>')
    .replace(/\r?\n/g, '<br/>');
}
