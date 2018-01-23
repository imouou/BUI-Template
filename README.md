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
> 可以先查看有什么模板 `buijs list-template`, 
**注意:** 
main 开头创建的模板每次都会覆盖 main 模块, 双击根目录 index.html 就可以预览;
page 开头的模板会往pages增加文件夹, 预览地址 index.html#pages/list/list ;

```bash

buijs create demo -t main-tab

```


### 创建指定平台工程 ( dcloud 为平台名称 ) 
> 可以先查看有什么平台 `buijs list-platform`

```bash
buijs create demo -p dcloud
```

### 创建某个平台下的某个模板工程

```bash
buijs create demo -t main-tab -p link
```

更多使用方法请查看 [buijs-cli](https://github.com/imouou/buijs-cli)

# 模板预览
<table>
    <tr>
        <td><div><img src="https://raw.githubusercontent.com/imouou/BUI-Template/master/preview.png" alt=""></div> <div style="font-size: 12px;">模板名称: 默认</div> <div style="font-size: 12px;">预览地址: index.html</div></td>
        <td><div><img src="https://raw.githubusercontent.com/imouou/BUI-Template/master/templates/main-tab/preview.png" alt=""></div> <div style="font-size: 12px;">模板名称: main-tab</div> <div style="font-size: 12px;">预览地址: index.html</div></td>
        <td><div><img src="https://raw.githubusercontent.com/imouou/BUI-Template/master/templates/page-icon/preview.png" alt=""></div> <div style="font-size: 12px;">模板名称: page-icon</div> <div style="font-size: 12px;">预览地址: index.html#pages/icon/icon</div></td>
    </tr>
    <tr>
        <td><div>![头部动态加载导航](https://raw.githubusercontent.com/imouou/BUI-Template/master/templates/page-tab-head/preview.png)</div> <div style="font-size: 12px;">模板名称: page-tab-head</div> <div style="font-size: 12px;">预览地址: index.html#pages/tab-head/index</div></td>
        <td><div>![中间动态加载导航](https://raw.githubusercontent.com/imouou/BUI-Template/master/templates/page-tab-main/preview.png)</div> <div style="font-size: 12px;">模板名称: page-tab-main</div> <div style="font-size: 12px;">预览地址: index.html#pages/tab-main/index</div></td>
        <td><div>![中间滚动动态加载导航](https://raw.githubusercontent.com/imouou/BUI-Template/master/templates/page-tab-scroll/preview.png)</div> <div style="font-size: 12px;">模板名称: page-tab-scroll</div> <div style="font-size: 12px;">预览地址: index.html#pages/tab-scroll/index</div></td>
    </tr>
    <tr>
        <td><div>![头部动态加载导航](https://raw.githubusercontent.com/imouou/BUI-Template/master/templates/page-tab-head/preview.png)</div> <div style="font-size: 12px;">模板名称: page-tab-head</div> <div style="font-size: 12px;">预览地址: index.html#pages/tab-head/index</div></td>
        <td><div>![中间动态加载导航](https://raw.githubusercontent.com/imouou/BUI-Template/master/templates/page-tab-main/preview.png)</div> <div style="font-size: 12px;">模板名称: page-tab-main</div> <div style="font-size: 12px;">预览地址: index.html#pages/tab-main/index</div></td>
        <td><div>![中间滚动动态加载导航](https://raw.githubusercontent.com/imouou/BUI-Template/master/templates/page-tab-scroll/preview.png)</div> <div style="font-size: 12px;">模板名称: page-tab-scroll</div> <div style="font-size: 12px;">预览地址: index.html#pages/tab-scroll/index</div></td>
    </tr>
</table>
