---
title: 关于docker的使用问题
date: 2024-01-29 16:10:54
tags:
---

**问题：删除docker网络，报错存在active endpoints**
例如： while removing network: network docker_dms_net id ec0611ba3525 has active endpoints

解决方法：
第一种：
重启docker
```js
sudo service docker restart
```

第二种：
1. 查看docker的网络
```js
docker network ls
```

2. 查看网络的endpoint, 停止使用网络的container
```js
docker network inspect <network-id>

// container-id 是Containers下对应的数据
// 例如：
// "Containers": {
//   "6bcc2418b08f9e1446053ab2e95bda066ec79bcbb0bd200c5e5110dc9bc637a3": {
//       "Name": "dms-mysql-2",
//       "EndpointID": "75b980a5ad52734eccf237b9bcef0b5c1b2b1426274326eb317d006aceac3eff",
//       "MacAddress": "02:42:ac:1f:86:03",
//       "IPv4Address": "172.31.134.3/24",
//       "IPv6Address": ""
//   }
// }
// container-id为：6bcc2418b08f9e1446053ab2e95bda066ec79bcbb0bd200c5e5110dc9bc637a3
docker container stop <container-id>
```

停止所有使用network的container之后，删除network即可。如果存在其他报错，建议google一下