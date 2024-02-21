---
title: linux - 关于磁盘命令
date: 2024-02-11 19:23:54
tags:
---

#### linux查看磁盘使用情况命令
```sh
语法：
df [选项]... [FILE]...

-a, --all 包含所有的具有 0 Blocks 的文件系统
--block-size={SIZE} 使用 {SIZE} 大小的 Blocks
-h, --human-readable 使用人类可读的格式(预设值是不加这个选项的...)
-H, --si 很像 -h, 但是用 1000 为单位而不是用 1024
-i, --inodes 列出 inode 资讯，不列出已使用 block
-k, --kilobytes 就像是 --block-size=1024
-l, --local 限制列出的文件结构
-m, --megabytes 就像 --block-size=1048576
--no-sync 取得资讯前不 sync (预设值)
-P, --portability 使用 POSIX 输出格式
--sync 在取得资讯前 sync
-t, --type=TYPE 限制列出文件系统的 TYPE
-T, --print-type 显示文件系统的形式
-x, --exclude-type=TYPE 限制列出文件系统不要显示 TYPE
-v (忽略)
--help 显示这个帮手并且离开
--version 输出版本资讯并且离开
```

#### 使用命令举例

*说明*
Filesystem：代表该文件系统所有的分区
1K-blocks：说明下面的数字单位是1KB（默认），可利用-h或-m来改变容量
Used：已经使用的硬盘空间
Available：剩下的磁盘空间大小
Use%：磁盘使用率
Mounted on：磁盘挂载的目录所在（挂载点）

*以 MB 为单位查看磁盘占用情况*
```sh
root@ubuntu:~# df -m
Filesystem     1M-blocks  Used Available Use% Mounted on
udev               16072     0     16072   0% /dev
tmpfs               3217    10      3208   1% /run
/dev/vda1         396797 78460    318321  20% /
tmpfs              16085     0     16085   0% /dev/shm
tmpfs                  5     0         5   0% /run/lock
tmpfs              16085     0     16085   0% /sys/fs/cgroup
/dev/vda15           105     9        96   9% /boot/efi
overlay           396797 78460    318321  20% /var/lib/docker/overlay2/04c65d21c919fc334c6cf13c2c3f3f5246c68591ff99335016cc5a49a2da0118/merged
overlay           396797 78460    318321  20% /var/lib/docker/overlay2/9c36fd2e009478330599a29068dfdb363be16726381b52f120e233241f1b2790/merged
overlay           396797 78460    318321  20% /var/lib/docker/overlay2/b844f9a9ae8f4d8799a5c00960aa1011498e299a00246f81edb2a362fec82772/merged
overlay           396797 78460    318321  20% /var/lib/docker/overlay2/6176224b017c21cd8c2c290b1c1cb4b3adf3d464498a558271c837db4c9f7fc7/merged
overlay           396797 78460    318321  20% /var/lib/docker/overlay2/b7e90c6775a6d381fc028cd3b76a49b37743b888fb6045e8f6ebde6f582cae41/merged
tmpfs               3217     0      3217   0% /run/user/0
```

*使用人类友好的单位查看磁盘占用情况*
```sh
root@ubuntu:~# df -h
Filesystem      Size  Used Avail Use% Mounted on
udev             16G     0   16G   0% /dev
tmpfs           3.2G  9.1M  3.2G   1% /run
/dev/vda1       388G   77G  311G  20% /
tmpfs            16G     0   16G   0% /dev/shm
tmpfs           5.0M     0  5.0M   0% /run/lock
tmpfs            16G     0   16G   0% /sys/fs/cgroup
/dev/vda15      105M  8.9M   96M   9% /boot/efi
overlay         388G   77G  311G  20% /var/lib/docker/overlay2/04c65d21c919fc334c6cf13c2c3f3f5246c68591ff99335016cc5a49a2da0118/merged
overlay         388G   77G  311G  20% /var/lib/docker/overlay2/9c36fd2e009478330599a29068dfdb363be16726381b52f120e233241f1b2790/merged
overlay         388G   77G  311G  20% /var/lib/docker/overlay2/b844f9a9ae8f4d8799a5c00960aa1011498e299a00246f81edb2a362fec82772/merged
overlay         388G   77G  311G  20% /var/lib/docker/overlay2/6176224b017c21cd8c2c290b1c1cb4b3adf3d464498a558271c837db4c9f7fc7/merged
overlay         388G   77G  311G  20% /var/lib/docker/overlay2/b7e90c6775a6d381fc028cd3b76a49b37743b888fb6045e8f6ebde6f582cae41/merged
tmpfs           3.2G     0  3.2G   0% /run/user/0
```

*列出文件系统下所有特殊文件格式的磁盘使用情况*
```sh
root@ubuntu:~# df -aT
Filesystem     Type        1K-blocks     Used Available Use% Mounted on
sysfs          sysfs               0        0         0    - /sys
proc           proc                0        0         0    - /proc
udev           devtmpfs     16457540        0  16457540   0% /dev
devpts         devpts              0        0         0    - /dev/pts
tmpfs          tmpfs         3294040     9316   3284724   1% /run
/dev/vda1      ext4        406319508 80461588 325841536  20% /
securityfs     securityfs          0        0         0    - /sys/kernel/security
tmpfs          tmpfs        16470180        0  16470180   0% /dev/shm
tmpfs          tmpfs            5120        0      5120   0% /run/lock
tmpfs          tmpfs        16470180        0  16470180   0% /sys/fs/cgroup
```

*列出指定文件路径下的磁盘使用情况*
```sh
# df -h [路径]
root@ubuntu:~# df -h /usr
Filesystem      Size  Used Avail Use% Mounted on
/dev/vda1       388G   77G  311G  20% /
```

*输出版本咨询*
```sh
root@ubuntu:~# df --version
df (GNU coreutils) 8.28
Copyright (C) 2017 Free Software Foundation, Inc.
License GPLv3+: GNU GPL version 3 or later <http://gnu.org/licenses/gpl.html>.
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

Written by Torbjorn Granlund, David MacKenzie, and Paul Eggert.
```

#### du：列出文件系统下的目录大小，disk usage

*举例*
```sh
root@ubuntu:~# du
4       ./.cache
8       ./.ssh
24      ./quick-usage/upgrade
40      ./quick-usage/deploy/compose
28      ./quick-usage/deploy/dble
12      ./quick-usage/deploy/compose_v1
680     ./quick-usage/deploy
716     ./quick-usage
4       ./.gnupg/private-keys-v1.d
8       ./.gnupg
768     .
```

*du参数说明*
```sh
-a : 列出所有的文件与目录容量，因为默认仅统计目录下面的文件量而已；
-h : 以人们较易读的容量格式（G/M）显示；
-s : 列出总量，而不列出每个个别的目录占用了容量；
-S : 不包括子目录下的总计，与-s有点差别；
-k : 以KB列出容量显示；
-m : 以MB列出容量显示
```

*查看usr/下的所有文件大小并根据大小降序排列*
```sh
# 使用的时候，下面这几个命令展示的结果是一样的，但是less命令的展示效果类似查看文件
# du -sm /usr/* | sort -nr | less
# du -sm /usr/* | sort -nr | more
# du -sm /usr/* | sort -nr
root@ubuntu:~# du -sm /usr/* | sort -nr | less
root@ubuntu:~# du -sm /usr/* | sort -nr | more
468     /usr/lib
376     /usr/bin
271     /usr/src
202     /usr/share
31      /usr/sbin
13      /usr/local
1       /usr/include
1       /usr/games
```

*查看usr目录下占用前5的文件*
```sh
root@ubuntu:~# du -sm /usr/* | sort -nr | head -n 5
468     /usr/lib
376     /usr/bin
271     /usr/src
202     /usr/share
31      /usr/sbin
```

> df是查看文件系统的磁盘使用情况，包含已删除但为被OS释放的文件所占用的容量大小
> du是查看目录大小，不包含已删除的文件

#### 查看已被删除但未释放的文件
lsof (list opened files)
```sh
lsof -wn |grep deleted
systemd-l   731                   root  txt       REG              252,1     219272       2005 /lib/systemd/systemd-logind (deleted)
dbus-daem   769             messagebus  txt       REG              252,1     236584       4307 /usr/bin/dbus-daemon (deleted)
agetty     1682                   root  txt       REG              252,1      56552       3846 /sbin/agetty (deleted)
mysqld    20656                   5700    6u      REG              0,152          0    4394263 /opt/udb/mysql/tmp/iblcR0CS (deleted)
mysqld    20656                   5700    7u      REG              0,152          0    4394264 /opt/udb/mysql/tmp/ib9DHifd (deleted)
```

*注意*
如果使用 ( lsof -n |grep deleted ) 命令查看时，可能会出现以下错误
lsof: no pwd entry for UID 5701

错误原因
1.进程在用户被删除之前启动，并且从那以后一直在运行
2.进程在容器内被启动

解决方法
-w 是指忽略这些错误

#### 以上内容可在man手册中查看具体内容
man手册地址：https://man7.org

man手册分为man1-man8：
- man1:用户命令；
- man2:系统调用；
- man3:C库调用；
- man4:设备文件及特殊文件；
- man5:文件格式：(配置文件格式)；
- man6:游戏使用帮助；
- man7:杂项；
- man8:管理工具及守护进行。