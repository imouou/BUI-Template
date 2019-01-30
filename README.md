# BUI-Template

## 更新日志
| **描述**            | **修改日期**    |
|:-------------------|-------------------:|
|去除link平台,整合在bingotouch工程    |2018-5-25    |
|模板更新为1.5.0版本,设计稿更新为750规范    |2018-10-31    |
|新增模板    |2019-01-30    |

> 重要更新,模板更新为1.5.0, 设计稿升级为750规范, 如果你的版本目前是1.4.7, 创建模板时,请指定对应版本,
如果你的模板还是旧版, 请尝试清空模板缓存.
```
# 更新buijs 0.5.1 才有清除缓存功能
$ npm update -g buijs

# 清除缓存
$ buijs clear
```

## 简介


这个模板工程文件是为了配合 [buijs](https://github.com/imouou/buijs-cli)  命令行工具而创建.
通过安装该工具,可以快速创建或增加模板, 具体请查看 [buijs使用说明](https://github.com/imouou/buijs-cli) .
> 通过命令行构建的工程,每次都会自动获取最新的BUI模板工程, 并且可以指定模板名称及指定平台.
BUI官网还有更多模板, 需要手动下载 [进入官网预览模板](http://www.easybui.com/scenes/).

![buijs 创建工程预览](http://www.easybui.com/docs/images/router/buijs-create-demo_low.gif)


## 创建某个模板工程

可以先查看有什么模板 `buijs list-template`, [BUI模板图片预览](https://github.com/imouou/BUI-Template/)

```bash
# 进入工程目录
$ cd demo

# 默认创建webapp工程模板
$ buijs create -t main-tab

```
> main-tab 为模板名称

> <strong style="color:red">注意:</strong>
1. 同一个工程可以多次创建模板;
模板名以 `main-`开头 会覆盖 main 模块, 例如: 模板名 `main-tab` 预览地址 `index.html`
模板名以 `page-`开头 会新增页面, 例如: 模板名 `page-login` 预览地址 `index.html#pages/login/login`;
2. `main-`开头的模板会覆盖main页面, `page-`开头的模板是新增页面;
3. 同一个工程只能创建一个平台, 多次创建会相互覆盖;

更多 [buijs使用说明](https://github.com/imouou/buijs-cli) ;

# 模板预览


<table>
    <tr>
        <td><div><img src="https://raw.githubusercontent.com/imouou/BUI-Template/master/templates/main-tab/preview.png" alt=""></div> <div style="font-size: 13px;">模板: main-tab</div> <div style="font-size: 13px;">预览: index.html</div></td>
        <td><div><img src="https://raw.githubusercontent.com/imouou/BUI-Template/master/templates/page-blog/preview.png" alt=""></div> <div style="font-size: 13px;">模板: page-blog </div> <div style="font-size: 13px;">预览: index.html#pages/blog/blog</div></td>
        <td><div><img src="https://raw.githubusercontent.com/imouou/BUI-Template/master/templates/page-icon/preview.png" alt=""></div> <div style="font-size: 13px;">模板: page-icon</div> <div style="font-size: 13px;">预览: index.html#pages/icon/icon</div></td>
    </tr>
    <tr>
        <td><div><img src="https://raw.githubusercontent.com/imouou/BUI-Template/master/templates/page-article/preview.png" alt=""></div> <div style="font-size: 13px;">模板: page-article</div> <div style="font-size: 13px;">预览: index.html#pages/article/article</div></td>
        <td><div><img src="https://raw.githubusercontent.com/imouou/BUI-Template/master/templates/page-article-list/preview.png" alt=""></div> <div style="font-size: 13px;">模板: page-article-list</div> <div style="font-size: 13px;">预览: index.html#pages/article-list/article-list</div></td>
        <td><div><img src="https://raw.githubusercontent.com/imouou/BUI-Template/master/templates/page-comment/preview.png" alt=""></div> <div style="font-size: 13px;">模板: page-comment</div> <div style="font-size: 13px;">预览: index.html#pages/comment/comment</div></td>
    </tr>
    <tr>
        <td><div><img src="https://raw.githubusercontent.com/imouou/BUI-Template/master/templates/page-list/preview.png" alt=""></div> <div style="font-size: 13px;">模板: page-list</div> <div style="font-size: 13px;">预览: index.html#pages/list/list</div></td>
        <td><div><img src="https://raw.githubusercontent.com/imouou/BUI-Template/master/templates/page-searchbar/preview.png" alt=""></div> <div style="font-size: 13px;">模板: page-searchbar</div> <div style="font-size: 13px;">预览: index.html#pages/searchbar/searchbar</div></td>
        <td><div><img src="https://raw.githubusercontent.com/imouou/BUI-Template/master/templates/page-history/preview.png" alt=""></div> <div style="font-size: 13px;">模板: page-history</div> <div style="font-size: 13px;">预览: index.html#pages/history/history</div></td>
    </tr>
    <tr>
        <td><div><img src="https://raw.githubusercontent.com/imouou/BUI-Template/master/templates/page-login/preview.png" alt=""></div> <div style="font-size: 13px;">模板: page-login</div> <div style="font-size: 13px;">预览: index.html#pages/login/login</div></td>
        <td><div><img src="https://raw.githubusercontent.com/imouou/BUI-Template/master/templates/page-register/preview.png" alt=""></div> <div style="font-size: 13px;">模板: page-register</div> <div style="font-size: 13px;">预览: index.html#pages/register/register</div></td>
        <td><div><img src="https://raw.githubusercontent.com/imouou/BUI-Template/master/templates/page-form/preview.png" alt=""></div> <div style="font-size: 13px;">模板: page-form</div> <div style="font-size: 13px;">预览: index.html#pages/form/form</div></td>
    </tr>
    <tr>
        <td><div><img src="https://raw.githubusercontent.com/imouou/BUI-Template/master/templates/page-chat/preview.png" alt=""></div> <div style="font-size: 13px;">模板: page-chat</div> <div style="font-size: 13px;">预览: index.html#pages/chat/chat</div></td>
        <td><div><img src="https://raw.githubusercontent.com/imouou/BUI-Template/master/templates/page-panel/preview.png" alt=""></div> <div style="font-size: 13px;">模板: page-panel</div> <div style="font-size: 13px;">预览: index.html#pages/panel/panel</div></td>
        <td><div><img src="https://raw.githubusercontent.com/imouou/BUI-Template/master/templates/page-personal/preview.png" alt=""></div> <div style="font-size: 13px;">模板: page-personal</div> <div style="font-size: 13px;">预览: index.html#pages/personal/personal</div></td>
    </tr>
    <tr>
        <td><div><img src="https://raw.githubusercontent.com/imouou/BUI-Template/master/templates/page-sidebar/preview.png" alt=""></div> <div style="font-size: 13px;">模板: page-sidebar</div> <div style="font-size: 13px;">预览: index.html#pages/sidebar/sidebar</div></td>
        <td><div><img src="https://raw.githubusercontent.com/imouou/BUI-Template/master/templates/page-photo/preview.png" alt=""></div> <div style="font-size: 13px;">模板: page-photo</div> <div style="font-size: 13px;">预览: index.html#pages/photo/photo</div></td>
        <td><div><img src="https://raw.githubusercontent.com/imouou/BUI-Template/master/templates/page-msg/preview.png" alt=""></div> <div style="font-size: 13px;">模板: page-msg</div> <div style="font-size: 13px;">预览: index.html#pages/msg/msg</div></td>
    </tr>
</table>
