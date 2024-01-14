import utwm from 'unplugin-tailwindcss-mangle/webpack';

let generatedStrings = new Map();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ウェブパックの設定
  webpack: (config, { dev }) => {
    config.infrastructureLogging = {
      // Must be checked before deploying
      level: 'error',
    };

    // 開発環境の場合は実行されない
    if (!dev) {
      config.plugins.push(
        // Tailwind CSS のクラス名を短縮する
        utwm({
          classGenerator: {
            classPrefix: '', // クラス名の先頭に付ける文字列
            // 関数
            customGenerate: (original, opts, _context) => {
              if (generatedStrings.has(original)) {
                return generatedStrings.get(original);
              }

              let result;
              const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
              do {
                result = '';
                for (let i = 0; i < 6; i++) {
                  result +=
                    opts.classPrefix + characters.charAt(Math.floor(Math.random() * characters.length));
                }
              } while (Array.from(generatedStrings.values()).includes(result));
              generatedStrings.set(original, result);
              return result;
            },
          },
        })
      );
    }

    return config;
  },

  //   カスタムヘッダー
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
