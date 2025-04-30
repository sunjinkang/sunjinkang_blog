hexo.extend.console.register(
  'new-post',
  'Create a new post with custom logic',
  function (args) {
    // 这里放置你的脚本逻辑
    console.log('Creating new post...');

    const { execSync } = require('child_process');
    execSync('./generateScripts/index.js', { stdio: 'inherit' });
  }
);
