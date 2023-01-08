---
title: mac系统安装pnpm添加到全局
date: 2023/01/07
categories:
 - [pnpm]
tags:
 - pnpm
description: "mac系统下安装pnpm报错 zsh: command not found: pnpm 解决办法"
---

1. 执行`echo 'source ~/.bash_profile' >> ~/.zshrc`
2. 项目下新建.bash_profile，输入`export PATH=~/.npm-global/bin:${PATH}`
