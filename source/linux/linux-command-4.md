---
title: linux - grep命令
date: 2024-02-27 11:25:40
tags: [linux, grep]
---

#### Linux - grep命令

grep命令介绍
`grep` 是用于在文本中搜索匹配特定模式的行的 Unix 和 Linux 命令。grep也可用于搜索文件夹内的文件内容。

- 搜索包含关键字的行：
语法格式：`grep "关键字" 文件名`
例如：`grep "root" /etc/passwd` 会找到包含 "root" 这个关键字的行。


- 搜索以某关键字开头的行：
语法格式：`grep "^关键字" 文件名`
例如：`grep "^root" /etc/passwd` 会找到以 "root" 开头的行。


- 搜索以某关键字开头的，不区分大小写的行：
语法格式：`grep -i "^关键字" 文件名`
例如：`grep -i "^root" /etc/passwd` 会找到以 "root"、"Root"、"rOot"等开头的行。


- 搜索某关键字结尾的行：
语法格式：`grep "关键字$" 文件名`
例如：`grep "root$" /etc/passwd` 会找到以 "root" 结尾的行。
此外，`grep` 支持正则表达式和多个文件名的操作。


- 打印结果显示行号：
语法格式：`grep -n "关键字" 文件名`
例如：`grep -n "root" /etc/passwd` 会找到包含 "root" 的行，并显示具体行号。


- 在指定目录下多个文件内容中查找包含的关键字
语法格式：`grep -r "关键字" 目录`
例如：`grep -r "root" /etc` 查找etc目录下文件中包含 "root" 的行


- 查找包含关键字的文件名
语法格式：`ls | grep "关键字"`
例如：`ls | grep "root"` 查找当前目录下文件名中包含 "root" 的文件


man手册中关于 -r 与 -R 的解释：
```sh
-r, --recursive
Read all files under each directory, recursively, following symbolic links only if they are on the command line.  Note that if no file operand is  given,  grep  searches  the  working directory.  This is equivalent to the -d recurse option.
# 译文：递归地读取每个目录下的所有文件，仅当符号链接位于命令行中时才按照符号链接读取。注意，如果没有给出文件操作数，grep将搜索工作目录。这相当于-d递归选项。

-R, --dereference-recursive
Read all files under each directory, recursively.  Follow all symbolic links, unlike -r.
# 译文：递归地读取每个目录下的所有文件。遵循所有符号链接，不像-r。
```

linux系统中.bashrc文件作用？？














`grep -r` 和 `grep -R` 的区别？？？
