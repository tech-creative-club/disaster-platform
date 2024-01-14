module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    cssnano: {
      preset: [
        'default',
        {
          calc: true,
          colormin: true,
          convertValues: true,
          minifyFontValues: true,
          normalizeUnicode: true,
          normalizeUrl: true,
          svgo: false,
          discardComments: {
            removeAll: true,
          },
        },
      ],
    },
  },
};
