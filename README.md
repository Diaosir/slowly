

## 简介
一个node.js命令行工具的框架，类似与egg，你可以像写egg一个写命令行工具，slowly的目的很简单，让你更专注业务代码的开发，剩下的交给slowly就行了。


## 快速入门


一步步教你搭建一个基于slowly框架的命令行工具

### 安装

```
npm i slowly --save
```

如果你需要使用typescript来开发，还需安装
```
npm i typescript -g
```

### 初始化

详情请查看https://github.com/Diaosir/slowly-examples/tree/master/ts

 ## 编写第一个command

```
使用的命令行参数解析工具是：[https://github.com/substack/minimist] (minimist)