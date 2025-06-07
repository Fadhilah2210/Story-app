import { merge } from 'webpack-merge';
import common from './webpack.common.js';
import { GenerateSW } from 'workbox-webpack-plugin';

export default merge(common, {
  mode: 'production',
  devtool: false,
  plugins: [
    new GenerateSW({
      swDest: 'sw.js',
      clientsClaim: true,
      skipWaiting: true,
      runtimeCaching: [
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif|css|js|woff2?|ttf|eot)$/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'assets-cache',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 30 * 24 * 60 * 60,
            },
          },
        },
        {
          urlPattern: /^https:\/\/(cdn|api)\./,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
          },
        },
      ],
    }),
  ],
});
