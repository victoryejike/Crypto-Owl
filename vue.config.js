const path = require('path');

const resolve = (dir) => path.join(__dirname, dir);

module.exports = {
  crossorigin: 'anonymous',
  integrity: true,
  productionSourceMap: false,
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@img', resolve('src/assets/image'))
      .set('@svg', resolve('src/assets/svg'))
      .set('@view', resolve('src/views'))
      .set('@ui', resolve('src/components/UI'))
      .set('@util', resolve('src/utils'))
      .set('@type', resolve('src/types'))
      .set('vue-i18n', 'vue-i18n/dist/vue-i18n.cjs.js'); // fix i18n development warning
  },
  publicPath: '/',
  pages: {
    index: {
      entry: 'src/main.ts',
      filename: 'index.html',
      template: 'public/index.html',
      title: '',
    },
  },
};
