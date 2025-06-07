import { merge } from 'webpack-merge';
import common from './webpack.common.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist'),
    },
    watchFiles: ['src/**/*', 'public/**/*'],
    open: true,
    hot: true,
    client: {
      overlay: true,
    },
  },
});