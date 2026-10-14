// Ambil ID video dari link YouTube apa pun (watch?v=, youtu.be/, shorts/, live/, embed/) atau ID langsung.
// Dipakai situs, panel CMS, dan server (validasi).
export function idYouTube(sumber = '') {
  const s = String(sumber).trim();
  if (/^[\w-]{11}$/.test(s)) return s;
  const m = s.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/|v\/))([\w-]{11})/);
  return m ? m[1] : '';
}
