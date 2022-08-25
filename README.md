# BUI-Template

## 简介


这个模板工程文件是为了配合 [buijs](https://easybui.com/products/267.html)  命令行工具而创建.
通过安装该工具,可以快速创建或增加模板, 具体请查看 [buijs使用说明](https://easybui.com/products/267.html) .
> 通过命令行构建的工程,每次都会自动获取最新的BUI模板工程, 并且可以指定模板名称及指定平台.
BUI官网还有更多模板, 需要手动下载 [进入官网预览模板](http://www.easybui.com/scenes/).

![buijs 创建工程预览](https://easybui.com/uploads/20220824/840073aa263350c62685e6de4aab39e9.png)


## 创建某个模板工程

可以先查看有什么模板 `buijs list-template`, [BUI模板图片预览](https://easybui.com/products/268.html)

```bash
# 进入工程目录
$ cd demo

# 默认创建webapp工程模板
$ buijs create -t main-tab

```
> main-tab 为模板名称

> <strong style="color:red">注意:</strong>
1. 同一个工程可以多次创建模板;
模板名以 `main-`开头 会覆盖 main 模块, 例如: 模板名 `main-tab` 预览地址 `index.html`;
模板名以 `page-`开头 会新增页面, 例如: 模板名 `page-login` 预览地址 `index.html#pages/login/login`;
**1.6.x 新增**
模板名以 `case-`开头 会覆盖工程, 例如: 模板名 `case-login` 预览地址 `index.html`;
2. `main-`开头的模板会覆盖main页面, `page-`开头的模板是新增页面, `case-`开头是一个完整的小案例;
3. 同一个工程只能创建一个平台, 多次创建会相互覆盖;

更多 [buijs使用说明](https://easybui.com/products/267.html) ;

# 模板预览

## 通用及常用的案例类
- case-login: 全局登录权限处理
- case-tablogin: tab局部登录处理
- case-163: 163新闻案例
<table>
    <tr>
        <td><div><img src="https://easybui.com/uploads/20220824/28788a0fe609853be0fad57c26b6a677.png" alt=""></div> <div style="font-size: 13px;">案例: case-login</div> <div style="font-size: 13px;">预览: index.html</div></td>
        <td><div><img src="https://easybui.com/uploads/20220824/d01eeb9065a289551e0a610d711aac8a.png" alt=""></div> <div style="font-size: 13px;">案例: case-tablogin </div> <div style="font-size: 13px;">预览: index.html</div></td>
        <td><div><img src="https://easybui.com/uploads/20220824/81515afe62a5b08fa92543a4ffbb41f0.png" alt=""></div> <div style="font-size: 13px;">案例: case-163</div> <div style="font-size: 13px;">预览: index.html</div></td>
    </tr>
</table>

## 覆盖main模块的模板
- main-tab: tab底部动态加载
- main-tab-head: tab顶部动态加载Component
- main-tab-foot: tab底部动态加载Component

<table>
    <tr>
        <td><div><img src="https://easybui.com/uploads/20220824/b231a9261693e4985873808585a4fadc.png" alt=""></div> <div style="font-size: 13px;">模板: main-tab</div> <div style="font-size: 13px;">预览: index.html</div></td>
        <td><div><img src="https://easybui.com/uploads/20220824/6576d3ae085d0c8945d70a1fd54ba22c.png" alt=""></div> <div style="font-size: 13px;">模板: main-tab-head</div> <div style="font-size: 13px;">预览: index.html</div></td>
        <td><div><img src="https://easybui.com/uploads/20220824/b231a9261693e4985873808585a4fadc.png" alt=""></div> <div style="font-size: 13px;">模板: main-tab-foot </div> <div style="font-size: 13px;">预览: index.html</div></td>
    </tr>
</table>

## 新增页面模板

<table>
    <tr>
        <td><div><img src="https://easybui.com/uploads/20220824/d104e85c823979a8f1f99dcbae60deb3.png" alt=""></div> <div style="font-size: 13px;">模板: page-addressbook</div> <div style="font-size: 13px;">预览: index.html#pages/addressbook/addressbook</div></td>
        <td><div><img src="https://easybui.com/uploads/20220824/b99b350e200a531bff80ca7592567799.png" alt=""></div> <div style="font-size: 13px;">模板: page-blog </div> <div style="font-size: 13px;">预览: index.html#pages/blog/blog</div></td>
        <td><div><img src="https://easybui.com/uploads/20220824/6e0885af55a550364e1f91c121891607.png" alt=""></div> <div style="font-size: 13px;">模板: page-icon</div> <div style="font-size: 13px;">预览: index.html#pages/icon/icon</div></td>
    </tr>
    <tr>
        <td><div><img src="https://easybui.com/uploads/20220824/42768c05259c90a81d355591e26323c3.png" alt=""></div> <div style="font-size: 13px;">模板: page-article</div> <div style="font-size: 13px;">预览: index.html#pages/article/article</div></td>
        <td><div><img src="https://easybui.com/uploads/20220824/12f3e0f246ae0036394e87a1381ffaf5.png" alt=""></div> <div style="font-size: 13px;">模板: page-article-list</div> <div style="font-size: 13px;">预览: index.html#pages/article-list/article-list</div></td>
        <td><div><img src="https://easybui.com/uploads/20220824/a498cdabb7916b85b215b5c6e056adb4.png" alt=""></div> <div style="font-size: 13px;">模板: page-comment</div> <div style="font-size: 13px;">预览: index.html#pages/comment/comment</div></td>
    </tr>
    <tr>
        <td><div><img src="https://easybui.com/uploads/20220824/c9df20a6d3c1c22df62dd601632585d8.png" alt=""></div> <div style="font-size: 13px;">模板: page-list</div> <div style="font-size: 13px;">预览: index.html#pages/list/list</div></td>
        <td><div><img src="https://easybui.com/uploads/20220824/b2e3132554c10b9cc05e21ad63cdbbad.png" alt=""></div> <div style="font-size: 13px;">模板: page-search</div> <div style="font-size: 13px;">预览: index.html#pages/search/search</div></td>
        <td><div><img src="https://easybui.com/uploads/20220824/f311298c8e09ca8a1081accb3f39720b.png" alt=""></div> <div style="font-size: 13px;">模板: page-history</div> <div style="font-size: 13px;">预览: index.html#pages/history/history</div></td>
    </tr>
    <tr>
        <td><div><img src="https://easybui.com/uploads/20220824/28788a0fe609853be0fad57c26b6a677.png" alt=""></div> <div style="font-size: 13px;">模板: page-login</div> <div style="font-size: 13px;">预览: index.html#pages/login/login</div></td>
        <td><div><img src="https://easybui.com/uploads/20220824/8c5913248f9ae0b2d9b0be5eabf778e3.png" alt=""></div> <div style="font-size: 13px;">模板: page-register</div> <div style="font-size: 13px;">预览: index.html#pages/register/register</div></td>
        <td><div><img src="https://easybui.com/uploads/20220824/7a16b301cceb65bd54fa6c54d2247e6c.png" alt=""></div> <div style="font-size: 13px;">模板: page-form</div> <div style="font-size: 13px;">预览: index.html#pages/form/form</div></td>
    </tr>
    <tr>
        <td><div><img src="https://easybui.com/uploads/20220824/ae14f3b365b9a7166ad910b40d667b9e.png" alt=""></div> <div style="font-size: 13px;">模板: page-chat</div> <div style="font-size: 13px;">预览: index.html#pages/chat/chat</div></td>
        <td><div><img src="https://easybui.com/uploads/20220824/d55aebba6821f70cf6906ec497d9ad4f.png" alt=""></div> <div style="font-size: 13px;">模板: page-panel</div> <div style="font-size: 13px;">预览: index.html#pages/panel/panel</div></td>
        <td><div><img src="https://easybui.com/uploads/20220824/af48b152840824534f968ff0e136d877.png" alt=""></div> <div style="font-size: 13px;">模板: page-personal</div> <div style="font-size: 13px;">预览: index.html#pages/personal/personal</div></td>
    </tr>
    <tr>
        <td><div><img src="https://easybui.com/uploads/20220824/8caed3f0ba628d1301a506d2eafc1164.png" alt=""></div> <div style="font-size: 13px;">模板: page-sidebar</div> <div style="font-size: 13px;">预览: index.html#pages/sidebar/sidebar</div></td>
        <td><div><img src="https://easybui.com/uploads/20220824/92d60646aced4b77660b7b5137762b3c.png" alt=""></div> <div style="font-size: 13px;">模板: page-photo</div> <div style="font-size: 13px;">预览: index.html#pages/photo/photo</div></td>
        <td><div><img src="https://easybui.com/uploads/20220824/c8897e3d3b35d173fea835ca2d29f2d1.png" alt=""></div> <div style="font-size: 13px;">模板: page-msg</div> <div style="font-size: 13px;">预览: index.html#pages/msg/msg</div></td>
    </tr>
</table>
