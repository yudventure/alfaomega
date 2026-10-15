// Alat bantu Kalender Kegiatan (src/components/KalenderKegiatan.jsx), dipakai juga oleh CMS dan server.
// Tanggal ditulis 'YYYY-MM-DD' dan dihitung dalam UTC supaya tidak bergeser oleh zona waktu peramban;
// "hari ini" mengikuti Waktu Indonesia Timur (WIT), zona waktu gereja.

export const ZONA = 'Asia/Jayapura';
export const HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
export const HARI_SINGKAT = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
export const BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
export const BULAN_SINGKAT = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

// Pilihan di CMS (nilai disimpan sebagai teks)
export const JENIS_HARI_BESAR = [
  { nilai: 'gerejawi', label: 'Hari raya gerejawi' },
  { nilai: 'nasional', label: 'Libur nasional' },
  { nilai: 'cuti', label: 'Cuti bersama' },
  { nilai: 'daerah', label: 'Hari besar daerah' },
];
export const PEKAN = [
  { nilai: '1', label: 'Pertama' },
  { nilai: '2', label: 'Kedua' },
  { nilai: '3', label: 'Ketiga' },
  { nilai: '4', label: 'Keempat' },
  { nilai: 'akhir', label: 'Terakhir' },
];
export const PILIHAN_HARI = HARI.map((h, i) => ({ nilai: String(i), label: h }));

const SEHARI = 86400000;
const dua = (n) => String(n).padStart(2, '0');

// 'YYYY-MM-DD' -> milidetik UTC, atau null bila bukan tanggal yang ada
export function urai(s) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(typeof s === 'string' ? s.trim() : '');
  if (!m) return null;
  const [th, bl, tg] = [Number(m[1]), Number(m[2]) - 1, Number(m[3])];
  if (th < 2000 || th > 2100) return null;
  const t = Date.UTC(th, bl, tg);
  const d = new Date(t);
  return d.getUTCMonth() === bl && d.getUTCDate() === tg ? t : null;
}
export const tanggalSah = (s) => urai(s) !== null;
export const keTeks = (t) => new Date(t).toISOString().slice(0, 10);
const bagian = (s) => { const d = new Date(urai(s)); return { th: d.getUTCFullYear(), bl: d.getUTCMonth(), tg: d.getUTCDate(), hari: d.getUTCDay() }; };

// Tanggal hari ini menurut WIT
export function hariIni(sekarang = new Date()) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', { timeZone: ZONA, year: 'numeric', month: '2-digit', day: '2-digit' })
      .formatToParts(sekarang).map((x) => [x.type, x.value]),
  );
  return `${p.year}-${p.month}-${p.day}`;
}

// Bulan sebagai satu angka (tahun*12 + bulan) supaya mudah maju/mundur
export const indeksBulan = (s) => { const { th, bl } = bagian(s); return th * 12 + bl; };
export const dariIndeks = (i) => ({ th: Math.floor(i / 12), bl: i % 12 });
const jumlahHari = (th, bl) => new Date(Date.UTC(th, bl + 1, 0)).getUTCDate();

// Sel kalender satu bulan: null untuk kotak kosong sebelum tanggal 1, lalu 'YYYY-MM-DD'
export function selBulan(th, bl) {
  const awal = new Date(Date.UTC(th, bl, 1)).getUTCDay();
  return [...Array(awal).fill(null), ...Array.from({ length: jumlahHari(th, bl) }, (_, i) => `${th}-${dua(bl + 1)}-${dua(i + 1)}`)];
}

// Tanggal agenda rutin bulanan di bulan tertentu, mis. Minggu pertama -> '2026-10-04'
export function tanggalRutin(r, th, bl) {
  const hari = Number(r.hari);
  if (r.hari === '' || !(hari >= 0 && hari <= 6)) return null;
  const pertama = 1 + ((hari - new Date(Date.UTC(th, bl, 1)).getUTCDay() + 7) % 7);
  const n = r.pekan === 'akhir' ? Math.floor((jumlahHari(th, bl) - pertama) / 7) + 1 : Number(r.pekan);
  if (!(n >= 1 && n <= 5)) return null;
  return `${th}-${dua(bl + 1)}-${dua(pertama + 7 * (n - 1))}`;
}

// "Minggu · 09.00 WIT" -> { hari: 0, jam: '09.00 WIT' }
function uraiWaktu(waktu) {
  const m = /\b(Minggu|Senin|Selasa|Rabu|Kamis|Jum'?at|Sabtu)\b/i.exec(waktu ?? '');
  if (!m) return null;
  const hari = HARI.findIndex((h) => h.toLowerCase() === m[1].toLowerCase().replace("'", ''));
  const jam = `${waktu.slice(0, m.index)} ${waktu.slice(m.index + m[0].length)}`.replace(/^[\s·•,:|–—-]+|[\s·•,:|–—-]+$/g, '').trim();
  return { hari, jam };
}

// Merapikan isi kalender dari CMS: membuang butir yang tanggalnya tidak sah, mengurutkan agenda,
// dan mengambil ibadah mingguan dari Jadwal Ibadah (hari dibaca dari teks "Hari & jam").
export function siapkan(kalender, jadwal) {
  const agenda = (kalender?.agenda ?? [])
    .map((a) => {
      const m = urai(a?.mulai);
      if (m === null || !a.judul) return null;
      const s = Math.max(m, urai(a.selesai) ?? m);
      return { ...a, m, s, mulai: keTeks(m), selesai: keTeks(s) };
    })
    .filter(Boolean)
    .sort((a, b) => a.m - b.m || a.s - b.s || String(a.jam).localeCompare(String(b.jam)));
  const hariBesar = (kalender?.hariBesar ?? [])
    .filter((h) => tanggalSah(h?.tanggal) && h.nama)
    .map((h) => ({ ...h, jenis: JENIS_HARI_BESAR.some((j) => j.nilai === h.jenis) ? h.jenis : 'gerejawi' }))
    .sort((a, b) => a.tanggal.localeCompare(b.tanggal));
  const bulanan = (kalender?.bulanan ?? []).filter((r) => r?.judul && tanggalRutin(r, 2026, 0)); // pekan & hari terisi
  const mingguan = (jadwal?.daftar ?? [])
    .map((j) => { const w = uraiWaktu(j?.waktu); return w && j.nama ? { judul: j.nama, ...w } : null; })
    .filter(Boolean);
  return { agenda, hariBesar, bulanan, mingguan };
}

// Rentang tahun yang bisa dijelajahi: tahun ini sampai tahun terakhir yang punya agenda/hari besar
export function rentangTahun(data, hari) {
  const th = [hari, ...data.agenda.flatMap((a) => [a.mulai, a.selesai]), ...data.hariBesar.map((h) => h.tanggal)].map((s) => Number(s.slice(0, 4)));
  return { awal: Math.min(...th), akhir: Math.max(...th) };
}

// Semua yang terjadi pada satu tanggal
export function isiTanggal(data, s) {
  const t = urai(s);
  const { th, bl, hari } = bagian(s);
  return {
    hariBesar: data.hariBesar.filter((h) => h.tanggal === s),
    agenda: data.agenda.filter((a) => a.m <= t && t <= a.s)
      .map((a) => ({ ...a, ke: Math.round((t - a.m) / SEHARI) + 1, lama: Math.round((a.s - a.m) / SEHARI) + 1 })),
    bulanan: data.bulanan.filter((r) => tanggalRutin(r, th, bl) === s),
    mingguan: data.mingguan.filter((r) => r.hari === hari),
  };
}

const adalahAgenda = (b) => Number(b.jenis === 'agenda' || b.jenis === 'bulanan');

// Ringkasan satu bulan: daftar agenda & hari besar (urut tanggal) dan jumlah ibadah rutin
export function isiBulan(data, th, bl) {
  const awal = Date.UTC(th, bl, 1);
  const akhir = Date.UTC(th, bl, jumlahHari(th, bl));
  const awalan = `${th}-${dua(bl + 1)}-`;
  const butir = [
    ...data.agenda.filter((a) => a.m <= akhir && a.s >= awal)
      .map((a) => ({ jenis: 'agenda', judul: a.judul, tanggal: keTeks(Math.max(a.m, awal)), m: a.m, s: a.s, jam: a.jam })),
    ...data.bulanan.map((r) => ({ jenis: 'bulanan', judul: r.judul, tanggal: tanggalRutin(r, th, bl), jam: r.jam }))
      .map((r) => ({ ...r, m: urai(r.tanggal), s: urai(r.tanggal) })),
    ...data.hariBesar.filter((h) => h.tanggal.startsWith(awalan))
      .map((h) => ({ jenis: h.jenis, judul: h.nama, tanggal: h.tanggal, m: urai(h.tanggal), s: urai(h.tanggal) })),
  ].sort((a, b) => a.tanggal.localeCompare(b.tanggal) || adalahAgenda(a) - adalahAgenda(b));
  const hariDalamBulan = selBulan(th, bl).filter(Boolean).map((s) => bagian(s).hari);
  const rutin = data.mingguan.reduce((n, r) => n + hariDalamBulan.filter((h) => h === r.hari).length, 0);
  return {
    butir,
    rutin,
    khusus: butir.filter(adalahAgenda).length,
    hariBesar: butir.filter((b) => !adalahAgenda(b)).length,
  };
}

// Agenda pertama setelah tanggal s (untuk tanggal tanpa agenda)
export function agendaBerikutnya(data, s) {
  const t = urai(s);
  const { th, bl } = bagian(s);
  const calon = [
    ...data.agenda.filter((a) => a.m > t).map((a) => ({ tanggal: a.mulai, judul: a.judul })),
    ...[0, 1].flatMap((n) => data.bulanan.map((r) => {
      const { th: t2, bl: b2 } = dariIndeks(th * 12 + bl + n);
      return { tanggal: tanggalRutin(r, t2, b2), judul: r.judul };
    })).filter((r) => r.tanggal > s),
  ].sort((a, b) => a.tanggal.localeCompare(b.tanggal));
  return calon[0] ?? null;
}

// Format tanggal Indonesia
export const formatPanjang = (s) => { const d = bagian(s); return `${HARI[d.hari]}, ${d.tg} ${BULAN[d.bl]} ${d.th}`; };
export const formatSingkat = (s) => { const d = bagian(s); return `${d.tg} ${BULAN_SINGKAT[d.bl]} ${d.th}`; };

// 19–23 Oktober 2026 · 30 Oktober – 1 November 2026 · 30 Desember 2026 – 2 Januari 2027
export function formatRentang(mulai, selesai = mulai) {
  const a = bagian(mulai);
  const b = bagian(selesai);
  if (mulai === selesai) return `${a.tg} ${BULAN[a.bl]} ${a.th}`;
  if (a.th !== b.th) return `${a.tg} ${BULAN[a.bl]} ${a.th} – ${b.tg} ${BULAN[b.bl]} ${b.th}`;
  if (a.bl !== b.bl) return `${a.tg} ${BULAN[a.bl]} – ${b.tg} ${BULAN[b.bl]} ${b.th}`;
  return `${a.tg}–${b.tg} ${BULAN[a.bl]} ${a.th}`;
}

// Label kotak tanggal di daftar bulanan: { angka: '19–23', bulan: 'Okt' }
export function labelKotak(mulai, selesai = mulai) {
  const a = bagian(mulai);
  const b = bagian(selesai);
  if (mulai === selesai) return { angka: String(a.tg), bulan: BULAN_SINGKAT[a.bl] };
  return { angka: `${a.tg}–${b.tg}`, bulan: a.bl === b.bl ? BULAN_SINGKAT[a.bl] : `${BULAN_SINGKAT[a.bl]}–${BULAN_SINGKAT[b.bl]}` };
}
