---
title: service - 连接数据库及对数据库的常规操作
date: 2025-06-26 17:08:34
cover: https://cdn.pixabay.com/photo/2017/07/27/02/23/space-2543838_640.jpg
tags: [mysql]
---

## 前言

以下用于记录针对mysql数据库的一些操作


## 操作

*连接数据库*
```mysql
# 按照下面的命令输入密码即可，root需要替换为实际的数据库用户
mysql -u root -p
```

*查看、切换数据库*
```mysql
mysql> show databases;
+--------------------------+
| Database                 |
+--------------------------+
| information_schema       |
| mysql                    |
| performance_schema       |
| quotes_management_system |
| sys                      |
+--------------------------+
5 rows in set (0.00 sec)

mysql> use mysql;
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Database changed
```

*注意：名言管理系统相关的表和数据都在quotes_management_system这个数据库中*
```mysql
mysql> use quotes_management_system;
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Database changed
mysql> show tables;
+------------------------------------+
| Tables_in_quotes_management_system |
+------------------------------------+
| categories                         |
| danmaku                            |
| danmaku_likes                      |
| danmaku_reports                    |
| quote_tags                         |
| quotes                             |
| tags                               |
| v_danmaku_details                  |
| v_quote_details                    |
| v_statistics                       |
| v_video_details                    |
| video_danmaku_settings             |
| videos                             |
+------------------------------------+
13 rows in set (0.00 sec)
```

*查看表格的数据*
```mysql
mysql> select * from videos;
+--------------------------------------+------+---------------+----------+----------+--------+----------------------------------------------------------------------+---------------+---------------------+---------------------+---------------------+
| id                                   | name | original_name | size     | duration | format | url                                                                  | thumbnail_url | upload_date         | create_time         | update_time         |
+--------------------------------------+------+---------------+----------+----------+--------+----------------------------------------------------------------------+---------------+---------------------+---------------------+---------------------+
| 4dd9c620-cd23-4432-9bc7-6e74ff93a70f | 鹬   | é¹¬.mp4       | 36129041 |     NULL | mp4    | http://8.153.174.230:3000/uploads/videos/1755139090430_863227707.mp4 | NULL          | 2025-08-14 10:38:13 | 2025-08-14 10:38:12 | 2025-08-14 10:38:12 |
+--------------------------------------+------+---------------+----------+----------+--------+----------------------------------------------------------------------+---------------+---------------------+---------------------+---------------------+
1 row in set (0.00 sec)
```

*查看MySQL表数据的几种方法*
查看所有数据
```sql
SELECT * FROM 表名;

# 例如
SELECT * FROM users;
```

查看特定列
```sql
SELECT 列名1, 列名2 FROM 表名;

# 例如
SELECT id, name FROM users;
```

带条件的查询
```sql
SELECT * FROM 表名 WHERE 条件;

# 例如
SELECT * FROM users WHERE age > 18;
```

限制返回行数
```sql
SELECT * FROM 表名 LIMIT 数量;

# 例如
SELECT * FROM users LIMIT 10;
```

排序后查看
```sql
SELECT * FROM 表名 ORDER BY 列名 [ASC|DESC];

# 例如
SELECT * FROM users ORDER BY create_time DESC;
```
