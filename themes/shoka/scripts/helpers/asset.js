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
  const fontSubset = '&subset=latin';
  // 精简字重：仅 400/700（去 italic，ZCOOL 无 italic、代码 italic 罕用），减少未用 @font-face
  const fontStyles = ':400,700';
  // 换国内镜像：fonts.googleapis.com 在大陆被墙，换 fonts.loli.net（Google Fonts 镜像）
  const fontHost = 'https://fonts.loli.net';

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
  // 非阻塞加载：display=swap 已保证文字不阻塞，CSS 用 media=print+onload 异步加载，省 ~1.6s 渲染阻塞
  if (!fontFamilies) return '';
  const fontHref = `${fontHost}/css?family=${fontFamilies.concat(fontDisplay, fontSubset)}`;
  return htmlTag('link', { rel: 'stylesheet', href: fontHref, media: 'print', onload: "this.media='all'" });
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
