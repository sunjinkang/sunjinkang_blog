---
title: Git - 常用的git命令
date: 2024-03-21 10:28:30
tags: [git, 常用命令]
---

#### Git批量删除分支命令
> git branch -a | grep '匹配文字' | xargs git branch -D

*注意*：上面这个命令的意思是
- git branch -a列出所有远程和本地分支
- grep '匹配文字'筛选出匹配该模式的分支
- xargs git branch -D将这些分支传递给git branch -D以批量删除

上面这个命令会同时删除远程的匹配到的分支，找不到时会提示，不建议使用，建议使用下面这个命令仅删除本地分支
> git branch | grep '匹配文字' | xargs git branch -D

PS: 上面的命令在vscode的终端中以powershell模式运行时会报错，可改为Git Bash模式运行。

