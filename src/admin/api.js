// Pemanggil API CMS. Header X-CMS wajib (dicek server sebagai pelindung CSRF).
export async function api(jalur, { metode = 'GET', data } = {}) {
  const res = await fetch(`/api${jalur}`, {
    method: metode,
    credentials: 'same-origin',
    headers: { 'X-CMS': '1', ...(data !== undefined ? { 'Content-Type': 'application/json' } : {}) },
    body: data !== undefined ? JSON.stringify(data) : undefined,
  });
  const isi = (res.headers.get('content-type') || '').includes('json') ? await res.json().catch(() => null) : null;
  if (!res.ok) {
    if (res.status === 401 && jalur !== '/masuk') window.dispatchEvent(new Event('cms:sesi-berakhir'));
    const e = new Error(isi?.pesan || `Gagal menghubungi server (${res.status}).`);
    e.status = res.status;
    throw e;
  }
  return isi;
}

export async function unduh(jalur, namaBerkas) {
  const res = await fetch(`/api${jalur}`, { credentials: 'same-origin', headers: { 'X-CMS': '1' } });
  if (!res.ok) throw new Error('Gagal mengunduh berkas.');
  const url = URL.createObjectURL(await res.blob());
  const a = Object.assign(document.createElement('a'), { href: url, download: namaBerkas });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
