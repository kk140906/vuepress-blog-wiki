---
title: github push 代码出现拒绝连接
date: 2022-06-03
isOriginal: false
category:
  - github
tag:
  - ssh
  - connection refused
icon: github
---

转自 [github push 代码 Connection refused 解决办法](https://foofish.net/github-push-connection-refused.html)。

tldr😉!

windows 在 C 盘用户目录下的 .ssh 目录中新建 config 文件, 将 github 最新解析出来的 ip 地址添加到 config 文件中。

```bash
# config 文件位置 - C:\Users\{username}\.ssh\config
Host github.com
# 修改此处 IP 即可
Hostname: 140.82.114.36
Port 443
```

github 最新 IP 获取可以通过 <https://ipaddress.com/website/ssh.github.com> 查询, 这个网站似乎需要使用魔法打败魔法。

话说回来，测试 IP 是否可以通过 ssh 连接到 github 的方法值得一学，记录一下命令:

```bash
ssh -T -p 443 git@140.82.114.36
```
