// Preset Tailwind CSS untuk Gereja Alfa Omega.
// Pakai di tailwind.config.js:  presets: [require('./tailwind-preset.js')]
// Contoh kelas: bg-ao-hitam text-ao-emas font-logo font-judul font-teks rounded-ao
module.exports = {
  theme: {
    extend: {
      colors: {
        ao: {
          hitam: '#121212',
          emas: '#C8A25A',
          gading: '#F6F1E7',
          'emas-tua': '#9A7633',
          'emas-teks': '#7A5C22',
          'emas-muda': '#E6CF95',
          arang: '#2A2826',
          batu: '#8A8378',
          'batu-tua': '#5E5850',
          anggur: '#6E1E2A',
        },
      },
      fontFamily: {
        logo: ['Cinzel', 'Trajan Pro', 'Georgia', 'serif'],
        judul: ['Cormorant Garamond', 'Garamond', 'Georgia', 'serif'],
        teks: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: { ao: '6px' },
      backgroundImage: {
        'ao-emas': 'linear-gradient(135deg, #EBD9A6 0%, #C8A25A 38%, #A9843F 70%, #D8BC7A 100%)',
      },
      letterSpacing: { label: '.4em' },
    },
  },
};
