/* global hexo */

'use strict';
const { htmlTag, url_for } = require('hexo-util');
const theme_env = require('../../package.json');

hexo.extend.helper.register('hexo_env', function (type) {
  return this.env[type]
})

hexo.extend.helper.register('theme_env', function (type) {
  return theme_env[type]
})

hexo.extend.helper.register('_vendor_font', () => {
  const config = hexo.theme.config.font;

  if (!config || !config.enable) return '';

  const fontDisplay = '&display=swap';
  const fontSubset = '&subset=latin,latin-ext';
  // 精简字重：原 300/300italic/400/400italic/700/700italic 6 档 → 4 档（多数字族只用 400/700）
  const fontStyles = ':400,400italic,700,700italic';
  // 换国内镜像：fonts.googleapis.com 在大陆被墙，换 fonts.loli.net（Google Fonts 镜像）
  const fontHost = '//fonts.loli.net';

  //Get a font list from config
  let fontFamilies = ['global', 'logo', 'title', 'headings', 'posts', 'codes'].map(item => {
    if (config[item] && config[item].family && config[item].external) {
      return config[item].family + fontStyles;
    }
    return '';
  });

  fontFamilies = fontFamilies.filter(item => item !== '');
  fontFamilies = [...new Set(fontFamilies)];
  fontFamilies = fontFamilies.join('|');

  // Merge extra parameters to the final processed font string
  return fontFamilies ? htmlTag('link', { rel: 'stylesheet', href: `${fontHost}/css?family=${fontFamilies.concat(fontDisplay, fontSubset)}` }) : '';
});


hexo.extend.helper.register('_vendor_js', function () {
  const { statics, js } = hexo.theme.config;
  // 自托管：原 //cdn.jsdelivr.net/combine/pace,pjax,anime,lazyload,quicklink
  // 改为本地 /js/vendor.min.js（见 themes/shoka/source/js/vendor.min.js），消除 jsdelivr 单点 + defer 非阻塞。
  // 命名 .min.js 以复用 _config.yml 的 minify.js.exclude('**/*.min.js')，避免被 uglify 2.6.4 二次压缩（ES5 footgun）。
  // 重新生成 vendor.min.js 见 memory mublog-vendor-js-selfhosted。
  return htmlTag('script', { src: url_for.call(this, `${statics}${js}/vendor.min.js?v=${theme_env['version']}`), defer: true }, '');
});

hexo.extend.helper.register('_css', function(...urls) {
  const { statics, css } = hexo.theme.config;

  return urls.map(url => htmlTag('link', { rel: 'stylesheet', href: url_for.call(this, `${statics}${css}/${url}?v=${theme_env['version']}`) })).join('');
});


hexo.extend.helper.register('_js', function(...urls) {
  const { statics, js } = hexo.theme.config;

  return urls.map(url => htmlTag('script', { src: url_for.call(this, `${statics}${js}/${url}?v=${theme_env['version']}`), defer: true }, '')).join('');
});
