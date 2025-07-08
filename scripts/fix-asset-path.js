hexo.extend.filter.register('after_post_render', function(data) {
  const year = data.date.format('YYYY'); // 获取文章年份
  const pattern = /(<img\s+[^>]*src=")\/(\d{2}\/\d{2}\/[^"]+)"/g;

  data.content = data.content.replace(pattern, (match, prefix, path) => {
    if (!path.startsWith(`${year}/`)) {
      return `${prefix}/${year}/${path}"`;
    }
    return match;
  });

  return data;
});
