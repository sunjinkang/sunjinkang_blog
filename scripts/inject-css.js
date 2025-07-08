hexo.extend.filter.register('after_render:html', function(str, data){
  if (!data.path.endsWith('.html')) return str;
  return str.replace(
    '</head>',
    '<link rel="stylesheet" href="/css/custom.css"></head>'
  );
});
