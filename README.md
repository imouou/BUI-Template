# BUI-Template

>这个工程文件是为了配合 buijs-cli 命令行工具而创建.

>通过安装该工具,可以快速创建 bui的常用模板, 具体请查看 [buijs-cli](https://github.com/imouou/buijs-cli)默认为单页模板

### 创建默认工程 (demo 为工程名称, 单页工程)

```bash
buijs create demo 
```

### 创建微信示例工程 (demo 为工程名称, 单页工程)

```bash
buijs create demo -t weixin
```

### 创建Link模板工程 (demo 为工程名称, 单页工程)

```bash
buijs create demo -t link
```

### 创建Bingotouch模板工程 (demo 为工程名称, 多页工程)

```bash
buijs create demo -t bingotouch
```

### 创建指定版本工程 (demo 为工程名称) 
> 可以先查看有什么版本 `buijs list`

```bash
buijs create demo v1.0
```

如果未安装该工具,也可以直接下载以后,复制templates目录下的某个文件夹,作为开发目录
