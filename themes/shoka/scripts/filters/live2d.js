/* global hexo */
'use strict';

// 排除 live2d 的 source map，不写入 public。
// sourcemap 仅在浏览器 devtools 打开时才会被请求，对普通访客无运行时性能价值，
// 却会额外部署 ~656KB 并暴露原始源码，故直接从路由层移除。
hexo.extend.filter.register('after_generate', function () {
  for (const path of hexo.route.list()) {
    if (path.startsWith('live2dw/') && path.endsWith('.map')) {
      hexo.route.remove(path);
    }
  }
});
