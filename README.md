# BUI-Template

## 简介

>这个工程文件是为了配合 buijs-cli 命令行工具而创建.

>通过安装该工具,可以快速创建 bui的常用模板, 具体请查看 [buijs-cli](https://github.com/imouou/buijs-cli)

通过命令行构建的工程,每次都会自动获取最新的BUI模板工程, 并且可以指定模板及平台. 更多模板请访问 [BUI模板](http://www.easybui.com/scenes/)

![buijs 创建工程预览](http://www.easybui.com/docs/images/router/buijs-create-demo_low.gif)

### 创建默认Webapp工程 (demo 为工程名称)
![默认模板](https://raw.githubusercontent.com/imouou/BUI-Template/master/preview.png)

```bash
buijs create demo 
```

### 创建某个模板工程 ( tab 为模板名称)
> 可以先查看有什么模板 `buijs list-template`

```bash

buijs create demo -t tab

```

### 创建侧边栏模板工程

```bash

buijs create demo -t sidebar

```


### 创建指定平台工程 ( dcloud 为平台名称 ) 
> 可以先查看有什么平台 `buijs list-platform`

```bash
buijs create demo -p dcloud
```


### 创建某个平台下的某个模板工程

```bash
buijs create demo -t sidebar -p link
```

### 创建指定版本工程
> 可以先查看有什么版本 `buijs list`

```bash
buijs create demo v1.0
```

更多使用方法请查看 [buijs-cli](https://github.com/imouou/buijs-cli)