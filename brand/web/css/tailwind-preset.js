// Preset Tailwind CSS untuk GBI Kapernaum Sorong.
// Pakai di tailwind.config.js:  presets: [require('./tailwind-preset.js')]
// Contoh kelas: bg-kp-hitam text-kp-emas font-logo font-judul font-teks rounded-kp
module.exports = {
  theme: {
    extend: {
      colors: {
        kp: {
          hitam: '#121212',
          emas: '#C89C4A',
          gading: '#F6F1E7',
          'emas-tua': '#94702B',
          'emas-teks': '#76561C',
          'emas-muda': '#E8CB86',
          arang: '#2A2826',
          batu: '#8A8378',
          'batu-tua': '#5E5850',
        },
      },
      fontFamily: {
        logo: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        // logo: KAPERNAUM selalu kapital, ExtraBold 800
        judul: ['Cormorant Garamond', 'Garamond', 'Georgia', 'serif'],
        teks: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: { kp: '6px' },
      backgroundImage: {
        'kp-emas': 'linear-gradient(135deg, #F0D99E 0%, #C89C4A 38%, #A27A2E 70%, #DDB86A 100%)',
      },
      letterSpacing: { label: '.4em' },
    },
  },
};
