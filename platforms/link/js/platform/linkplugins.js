
; (function (window) {

    /**
     * Link平台功能接口，使用该模块必须先引入Cordova.js 和 bingotouch.js<br/>包含用户信息获取、通讯录、聊天、签到、应用、服务号等操作接口
     * @namespace app.link
    */
    window.app.link = window.app.link || {};

    /**
      * 获取登陆后的用户信息
      * @method app.link.getLoginInfo
      * @param {function} callback 回调函数，返回登录用户信息
      * @example
      * app.link.getLoginInfo(function(result){
      *      app.alert(result);
      * });
    */
    app.link.getLoginInfo = function (callback) {
        var successCallback = function (result) {
            callback(app.utils.toJSON(result));
        };
        Cordova.exec(successCallback, null, "LinkPlugin", "getLoginInfo", []);
    }


    /**
        * 获取登录用户的AccessToken
        * @method app.link.getToken
        * @param callback {function} 回调函数,返回json对象[{'accessToken': 'xxx'}]
        * @example
        * app.link.getToken(function (result) {
        *        app.alert(result);
        * });
    */
    app.link.getToken = function (callback) {
        var successCallback = function (result) {
            callback(app.utils.toJSON(result));
        };
        Cordova.exec(successCallback, null, "LinkPlugin", "getToken", []);
    }

    /**
      * 获取Link指定的用户(userId)信息
      * @method app.link.getUserInfo
      * @param success {function} 成功回调函数，返回json对象
      * @param fail {function} 失败回调函数，返回错误字符串
      * @param userId {string} 指定用户userId
      * @example
      *     app.link.getUserInfo(function(result){
      *         app.alert(result);
      *     },
      *     function(error){
      *         app.alert(error);
      *     },
      *     'ebdfe3b1-ed9c-425b-aac3-aa6c61d05d0e'
      *     );
    */
    app.link.getUserInfo = function (success, fail, userId) {
        var successCallback = function (result) {
            success(app.utils.toJSON(result));
        };
        Cordova.exec(successCallback, fail, "LinkPlugin", "getUserInfo", [userId]);
    }

    /**
      * 根据手机或者邮箱获取用户信息
      * @method app.link.getUserInfoByCellphoneOrEmail
      * @static
      * @param key {string} 手机号码或者邮箱
      * @param callback {function} 回调函数，返回用户信息
      * @example
      *     app.link.getUserInfoByCellphoneOrEmail("1380013800",function(result){
      *         app.alert(result);
      *     })
    */
    app.link.getUserInfoByCellphoneOrEmail = function (key, callback) {
        var successCallback = function (result) {
            callback(app.utils.toJSON(result));
        };
        Cordova.exec(successCallback, null, "LinkPlugin", "getUserInfoByCellphoneOrEmail", [key]);
    }

    /**
      * 根据loginId获取userId
      * @method app.link.getUserIdWithLoginId
      * @param success {Function} 成功回调，返回userId
      * @param fail {Function} 失败回调函数，返回错误字符串
      * @param loginId {String} 用户loginId
      * @example
      * app.link.getUserIdWithLoginId(function(res){
      *     app.alert(res);
      *  },function(error){
      *     app.alert(error);
      *  }, 'yulsh');
    */
    app.link.getUserIdWithLoginId = function (success, fail, loginId) {
        Cordova.exec(success, fail, "LinkPlugin", "getUserIdWithLoginId", [loginId]);
    }

    // *
    //  * 包括：获取部门成员数据、对通讯录的选人界面操作等
    //  * @class 通讯录


    /**
      * 打开通讯录页面
      * @method app.link.openContactPage
      * @example
      * app.link.openContactPage();
     */
    app.link.openContactPage = function () {
        var params = {
            code: "OpenBuiltIn",
            key: "Contact"
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }


    /**
     根据部门orgId获取用户信息以及子部门信息
     @method app.link.getChildListByOrgId
     @param callback {Function} 回调函数，返回某部门下的用户以及子部门
     @param orgId {String} 部门orgId
    */
    app.link.getChildListByOrgId = function (callback, orgId) {
        Cordova.exec(callback, null, "LinkPlugin", "getChildListByOrgId", [orgId]);
    }

    /**
      * 根据部门orgId获取该部门的信息
      * @method app.link.getDeptInfoByOrgId
      * @param callback {Function} 回调函数，返回部门信息
      * @param orgId {String} 部门orgId
    */
    app.link.getDeptInfoByOrgId = function (callback, orgId) {
        Cordova.exec(callback, null, "LinkPlugin", "getDeptInfoByOrgId", [orgId]);
    }

    /**
      * 调用Link选人页面(单选)
      * @method app.link.startContactSingleSelector
      * @param successCallback {Function} 成功回调函数,返回json对象
      * @param failCallback {Function} 失败回调函数，返回错误字符串
      * @param title {String} 选人窗口文字说明
      * @param dataType {String} 选择范围：1为用户,2为群组,3为用户+群组 4为部门(组织),5为用户+组织,8为服务号
      * @param extraParams json对象，方便后面扩展，目前有isIncludeDisableUser(是否包含禁用的用户，默认false)
      * hasLatelyChatConversation 是否展示默认联系人
      * isGetSourceId 获取用户的sourceId
      * @example
      * app.link.startContactSingleSelector(function(result){
      *     app.alert(result);
      * },function(){} ,'请选择用户','1');
    */
    app.link.startContactSingleSelector = function (successCallback, failCallback, title, dataType, extraParams) {
        extraParams = $.extend({
            isIncludeDisableUser: false
        }, extraParams);
        if (extraParams.isGetSourceId && dataType == 1) {
            function success(res) {
                app.link.getServerConfigs((params) => {
                    app.get(params.uamUri + '/api/user/by/ids', {
                        ids: res.id
                    }, function (res) {
                        successCallback(res)
                    }, function (err) {
                        failCallback(err)
                    })
                }, (err) => {
                    failCallback(err)
                })
            }
            Cordova.exec(success, failCallback, "LinkPlugin", "startContactSingleSelector", [title, dataType, extraParams]);
        } else {
            Cordova.exec(successCallback, failCallback, "LinkPlugin", "startContactSingleSelector", [title, dataType, extraParams]);
        }
    }

    /**
      * 调用Link选人界面(多选)
      * @method app.link.startContactMulitSelector
      * @param successCallback {Function} 成功回调函数,返回json对象
      * @param failCallback {Function} 失败回调函数，返回错误字符串
      * @param title {String} 选人窗口文字说明
      * @param dataType {String} 选择范围：1为用户,2为群组,3为用户+群组 4为部门(组织),5为用户+组织
      * @param extraParams {Object} json对象,具体可以传入哪些请参看代码
      * isGetSourceId 获取用户的sourceId
      * @example
      * app.link.startContactMulitSelector(
      *    function(result){
      *        app.alert(result);
      *    },
      *    function(error){
      *        app.alert(error);
      *    },
      *    '请选择用户/群组(多选)',
      *    '1',
      *    {
      *      userSelected: [],          //默认选中的用户 id
      *      groupSelected: [],         //默认选中的群组id
      *      organizationSelected: [],  //默认选中的部门id
      *      userIgnore: [],            //禁止选择的用户id
      *      groupIgnore: [],           //禁止选择的群组id
      *      organizationIgnore: [],    //禁止选择的部门id
      *      isIncludeDisableUser:false //是否包含被禁用的人员， 默认是false
      *    }
      * );
    */
    app.link.startContactMulitSelector = function (successCallback, failCallback, title, dataType, extraParams) {
        extraParams = $.extend({
            userSelected: [],
            groupSelected: [],
            organizationSelected: [],
            userIgnore: [],
            groupIgnore: [],
            organizationIgnore: [],
            isIncludeDisableUser: false
        }, extraParams);
        if (extraParams.isGetSourceId && dataType == 1) {
            function success(res) {
                var ids = []
                for (let index = 0; index < res.user.length; index++) {
                    let item = res.user[index];
                    ids.push(item.userId)
                }
                app.link.getServerConfigs((params) => {
                    app.get(params.uamUri + '/api/user/by/ids', {
                        ids: ids.join(',')
                    }, function (res) {
                        successCallback(res)
                    }, function (err) {
                        failCallback(err)
                    })
                }, (err) => {
                    failCallback(err)
                })
            }
            Cordova.exec(success, failCallback, "LinkPlugin", "startContactMulitSelector", [title, dataType, extraParams]);
        } else {
            Cordova.exec(successCallback, failCallback, "LinkPlugin", "startContactMulitSelector", [title, dataType, extraParams]);
        }
    }

    /**
        调用Link里面用户的名片页面
        @method app.link.startUserCard
        @param userId {String} 用户id
        @example
            app.link.startUserCard('ebdfe3b1-ed9c-425b-aac3-aa6c61d05d0e');
    */
    app.link.startUserCard = function (userId) {
        Cordova.exec(null, null, "LinkPlugin", "startUserCard", [userId]);
    }


    /**
      * 打开部门列表
      * @method app.link.openOrgList
      * @param orgId {String} 部门id（可不传）
      * @example
      *     app.link.openOrgList();
     */
    app.link.openOrgList = function (orgId) {
        var params = {
            code: "OpenBuiltIn",
            key: "OrganizationList",
            orgId: orgId || ''
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }

    /**
      * 查看部门名片页
      * @method app.link.openOrgCard
      * @param orgId {String} 部门id
      * @example
      *     app.link.openOrgCard('02af68fb-dc53-4411-b6c8-d6480cce2234');
     */
    app.link.openOrgCard = function (orgId) {
        var params = {
            code: "OpenBuiltIn",
            key: "OrganizationCard",
            orgId: orgId
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }

    // *
    //  * 包括：创建群组、打开群组列表等操作
    //  * @class 群组


    /**
        调用Link里面群组的名片页面
        @method app.link.startGroupCard
        @param groupId {String} 群组id
        @example
            app.link.startGroupCard('1456fa37-ebc9-4123-88c0-8b494bab7377');
    */
    app.link.startGroupCard = function (groupId) {
        Cordova.exec(null, null, "LinkPlugin", "startGroupCard", [groupId]);
    }

    /**
      * 创建群组
      * @method app.link.createGroup
      * @param successCallback {Function} 成功回调函数,返回json对象
      * @param failCallback {Function} 失败回调函数，返回错误字符串
      * @param userIds {Array} 默认添加的用户id
      * @example
      * app.link.createGroup(
      *   function(result){
      *       app.alert(result);
      *       //todo
      *   },
      *   function(error){
      *       //app.alert(error);
      *   },
      *   []  //默认选择的用户id
      * );
     */
    app.link.createGroup = function (successCallback, failCallback, userIds) {
        var params = {
            code: "OpenBuiltIn",
            key: "CreateGroup",
            userSelected: userIds || []
        };
        Cordova.exec(successCallback, failCallback, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }

    /**
        打开群组列表
        @method app.link.openGroupList
        @param eCode {String} 企业编码eCode，默认不传，企业互联才需要传
        @example
            app.link.openGroupList();
     */
    app.link.openGroupList = function (eCode) {
        var params = {
            code: "OpenBuiltIn",
            key: "GroupList"
        };
        if (eCode) {
            params.eCode = eCode;
        }
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }

    /**
        打开群组发公告页面
        @method app.link.sendGroupNotice
        @param groupId {String} 群组id
        @example
            app.link.sendGroupNotice('1456fa37-ebc9-4123-88c0-8b494bab7377');
     */
    app.link.sendGroupNotice = function (groupId) {
        var params = {
            code: "OpenBuiltIn",
            key: "PublishGroupAnnouncement",
            groupId: groupId
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }

    /**
        打开群组公告列表
        @method app.link.openGroupNoticeList
        @param groupId {String} 群组id
        @example
            app.link.openGroupNoticeList('1456fa37-ebc9-4123-88c0-8b494bab7377');
     */
    app.link.openGroupNoticeList = function (groupId) {
        var params = {
            code: "OpenBuiltIn",
            key: "GroupAnnouncementList",
            groupId: groupId
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }

    /**
        打开群组签到列表
        @method app.link.openGroupCheckInList
        @param groupId {String} 群组id
        @example
            app.link.openGroupCheckInList('1456fa37-ebc9-4123-88c0-8b494bab7377');
     */
    app.link.openGroupCheckInList = function (groupId) {
        var params = {
            code: "OpenBuiltIn",
            key: "MyCheckIn",
            groupId: groupId
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }

    // *
    //  * 包括：添加服务号、打开服务号相关界面操作
    //  * @class 服务号


    /**
      * 查看服务号名片页
      * @method app.link.openServiceAccountCard
      * @param accountId {String} 服务号id
      * @example
      *     app.link.openServiceAccountCard("43b80351-2c0a-4e84-a3d0-43eb7d35bc00");
     */
    app.link.openServiceAccountCard = function (accountId) {
        var params = {
            code: "OpenBuiltIn",
            key: "ServiceAccountCard",
            accountId: accountId
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }

    /**
      * 查看已关注服务号列表
      * @method app.link.openServiceAccountList
      * @example
      *     app.link.openServiceAccountList();
     */
    app.link.openServiceAccountList = function () {
        var params = {
            code: "OpenBuiltIn",
            key: "ServiceAccountList"
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }

    /**
        打开添加服务号页面
        @method app.link.addServiceAcccount
        @example
            app.link.addServiceAcccount();
     */
    app.link.addServiceAcccount = function () {
        var params = {
            code: "OpenBuiltIn",
            key: "AddServiceAccount"
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }

    /**
        发送服务号公告
        @method app.link.sendServiceAccountNotice
        @param accountId {String} 服务号id
        @param bulletinType {Int} 公告类型(1文字,2图片,3语音) | 不传此参数时先进入公告类型选择页面
        @example
            app.link.sendServiceAccountNotice("43b80351-2c0a-4e84-a3d0-43eb7d35bc00");
     */
    app.link.sendServiceAccountNotice = function (accountId, bulletinType) {
        var params = {
            code: "OpenBuiltIn",
            key: "SendBulletin",
            accountId: accountId,
            bulletinType: bulletinType
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }

    // *
    //  * 跟聊天窗口相关的接口
    //  * @class 聊天消息


    /**
      * 打开消息中心页面
      * @method app.link.openMsgCenter
      * @param isShowService {Boolean} 废弃不用
      * @example
        app.link.openMsgCenter();
      */
    app.link.openMsgCenter = function (isShowService) {
        var params = {
            code: "OpenBuiltIn",
            key: "MessageCenter",
            isShowService: isShowService
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }

    /**
      * 获取未读消息总数
      * @method app.link.getUnreadMessageCount
      * @param success {Function} 成功回调，返回数字
      * @param fail {Function} 失败回调,返回失败信息
      * @example
      * app.link.getUnreadMessageCount(function(result){
      *      app.alert(result);
      * },function(error){
      *      app.alert(error);
      * });
    */
    app.link.getUnreadMessageCount = function (success, fail) {
        Cordova.exec(success, fail, "LinkPlugin", "getUnreadMessageCount", []);
    }

    /**
      * 获取指定帐号id的未读消息数
      * @method app.link.getUnreadMessageCountById
      * @param success {Function} 成功回调函数，返回未读消息数
      * @param talkWithId {String} 这里的帐号包括：用户的id，服务号的id，部门的id，群组的id
      * @example
      *  app.link.getUnreadMessageCountById(function(result){
      *      alert(result);
      *  }, 'ebdfe3b1-ed9c-425b-aac3-aa6c61d05d0e');
    */
    app.link.getUnreadMessageCountById = function (success, talkWithId) {
        var callback = function (result) {
            success(result, talkWithId);
        }
        Cordova.exec(callback, null, "LinkPlugin", "getUnreadMessageCountById", [talkWithId]);
    }

    /**
        调用Link的用户聊天页面
        @method app.link.startUserChat
        @param userId {String} 用户id
        @param userName {String} 用户名称(可选)
        @example
            app.link.startUserChat('ebdfe3b1-ed9c-425b-aac3-aa6c61d05d0e');
    */
    app.link.startUserChat = function (userId, userName) {
        Cordova.exec(null, null, "LinkPlugin", "startUserChat", [userId, userName]);
    }

    /**
        调用Link的群组聊天页面
        @method app.link.startGroupChat
        @static
        @param groupId {String} 群组id
        @param groupName {String} 群组名称(可选)
        @example
            app.link.startGroupChat('1456fa37-ebc9-4123-88c0-8b494bab7377');
    */
    app.link.startGroupChat = function (groupId, groupName) {
        Cordova.exec(null, null, "LinkPlugin", "startGroupChat", [groupId, groupName]);
    }

    /**
        打开服务号聊天界面
        @method app.link.startServiceAccountChat
        @param accountId {String} 服务号id
        @example
            app.link.startServiceAccountChat("43b80351-2c0a-4e84-a3d0-43eb7d35bc00");
     */
    app.link.startServiceAccountChat = function (accountId) {
        Cordova.exec(null, null, "LinkPlugin", "startServiceAccountChat", [accountId]);
    }

    /**
        发送邀约消息（主要用在消息窗口，待补充）
        @method app.link.sendInviteMessage
        @param params {Object} json对象，包含:<br/>toId:发送邀约消息对象id，要看toType是什么类型 <br/>toType:0系统1私聊2群组4部门5服务号 <br/>title:邀约标题 <br/>desc:邀约内容 <br/>action_params：操作指令，具体请咨询产品组
        @example
            var params={toId:'ebdfe3b1-ed9c-425b-aac3-aa6c61d05d0e',toType:1,title:'发送邀约',desc:'邀约描述',action_params:''};
            app.link.sendInviteMessage(params);
     */
    app.link.sendInviteMessage = function (params) {
        params = params || {};
        Cordova.exec(null, null, "LinkPlugin", "sendInviteMessage", [params]);
    }


    // *
    //  * 包括：发表动态，打开群组，个人，工作等动态详情界面
    //  * @class 动态


    /**
      * 发表动态
      * @method app.link.publishMicroblog
      * @param successCallback {Function} 成功回调
      * @param failCallback {Function} 失败回调,返回失败信息
      * @param options {Object} JSON格式，动态参数，具体如下：<br/>
      *     authorID {String} 发表动态的对象id ， 可以是用户或用户运营的服务号 （不写默认是当前用户）<br/>
      *     content {String} 动态内容<br/>
      *     privateType {Int}  私密类型 ， 0 群组，1 部门， 2 个人 ， 3 项目  ， 4公开 （默认类型）<br/>
      *     privateInstanceID {String}  私密对象id<br/>
      *     privateName {String} 私密对象名称<br/>
      *     images {Array}  动态图片 （相册图片地址， 建议到动态发表界面再选择图片，这样更加方便）
      * @example
      * app.link.publishMicroblog(function(res){
      *     app.alert(res);
      * },function (error) {
      *     app.alert(error);
      * },{
      *     content : '这是发布到link的一条动态!!'
      * });
    */
    app.link.publishMicroblog = function (successCallback, failCallback, options) {
        var params = $.extend({
            code: "OpenBuiltIn",
            key: "PublishMicroBlog"
        }, options);
        Cordova.exec(successCallback, failCallback, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }

    /**
        打开动态主页
        @method app.link.openMicroblogPage
        @param displayType {Int} 显示类型<br/>
        0 全部<br/>
        1 官方<br/>
        2 群组<br/>
        3 个人<br/>
        4 我的动态<br/>
        5 相互关注<br/>
        6 项目<br/>
        7 随便逛逛
        @example
            app.link.openMicroblogPage(0);
    */
    app.link.openMicroblogPage = function () {
        var params = {
            code: "OpenBuiltIn",
            key: "DcMicroBlog"
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }

    /**
        打开某人动态主页
        @method app.link.openUserMicroblog
        @param accountId {String} 用户Id
        @example
            app.link.openUserMicroblog('张武韬');
    */
    app.link.openUserMicroblog = function (accountId) {
        var params = {
            code: "OpenBuiltIn",
            key: "BlogCard",
            accountId: accountId
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }

    /**
         打开某群组动态主页
        @method app.link.openGroupMicroblog
        @param groupId {String} 群组id
        @example
            app.link.openGroupMicroblog('1456fa37-ebc9-4123-88c0-8b494bab7377');
    */
    app.link.openGroupMicroblog = function (groupId) {
        var params = {
            code: "OpenBuiltIn",
            key: "GroupBlogList",
            groupId: groupId
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }

    /**
      * 打开某项目动态主页
      * @method app.link.startProjectDetail
      * @deprecated
      * @param: projectId{String} 项目id
      * @example
      *     app.link.startProjectDetail('projectId');
    */
    app.link.startProjectDetail = function (projectId) {
        Cordova.exec(null, null, "LinkPlugin", "startProjectDetail", [projectId]);
    }

    /**
        打开某服务号动态主页
        @method app.link.openServiceAccountMicroblog
        @param serviceId {String} 服务号Id
        @param accountName {String} 服务号名称，可省略
        @example
            app.link.openServiceAccountMicroblog('Id');
    */
    app.link.openServiceAccountMicroblog = function (serviceId, accountName) {
        var params = {
            code: "OpenBuiltIn",
            key: "BlogCard",
            accountType: 3,
            serviceId: serviceId,
            accountName: accountName || ''
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }

    /**
        打开某话题动态主页
        @method app.link.openTopicMicroblog
        @param topic {String} 话题名称
        @example
            app.link.openTopicMicroblog('Link发布会');
    */
    app.link.openTopicMicroblog = function (topic) {
        var params = {
            code: "OpenBuiltIn",
            key: "TopicBlogList",
            topic: topic
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }

    /**
        打开动态广场
        @method app.link.openBlogSquare
        @deprecated
        @example
            app.link.openBlogSquare();
    */
    app.link.openBlogSquare = function () {
        var params = {
            code: "OpenBuiltIn",
            key: "BlogSquare"
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }

    /**
        打开动态详情
        @method app.link.openMicroblogDetail
        @param {String} blogId - 动态Id
        @example
            app.link.openMicroblogDetail('0683ecc7-560f-4b7e-92a3-6ce9d690e5be');//这里填写你的动态id
    */
    app.link.openMicroblogDetail = function (blogId) {
        var params = {
            code: "OpenBuiltIn",
            key: "BlogDetail",
            blogId: blogId
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }

    /**
      * 打开我的动态
      * @method app.link.openMyMicroblog
      * @example
      *     app.link.openMyMicroblog();
    */
    app.link.openMyMicroblog = function () {
        var params = {
            code: "OpenBuiltIn",
            key: "MyBlogCard"
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }

    // *
    //  * 包括：应用启动、应用市场／中心的相关界面操作
    //  * @class 轻应用


    /**
      * 启动应用市场App
      * @method app.link.runApp
      * @param params{Object} 启动应用的参数，key-value格式为
      *     <br/> { appCode:"应用市场中填写的编码", appUrl:"启动页面相对地址", data:{name:"张三",sex:"male":age:25} }
      *     <br/> 其中data参数也是json对象，启动目标应用后，能够在app.getPageParams里面获取到。
      * @example
      * var params={
      *     appCode:"com.bingo.touch",
      *     data:{
      *         name:"张三",
      *         sex:"male",
      *         gender:23
      *     }
      * }
      * app.link.runApp(params);
    */
    app.link.runApp = function (params) {
        var dataStr = "";
        if (params.data) {
            for (var key in params.data) {
                dataStr += ("\n" + key + "=" + params.data[key]);
            };
        }
        params = "[OpenApp]\nappCode=" + params.appCode + (params.appUrl ? "\nappUrl=" + params.appUrl : "") + dataStr;
        Cordova.exec(null, null, "LinkPlugin", "launchLinkService", [params]);
    }

    /**
     * 启动应用市场App
     * @method app.link.startApp
     * @param params{Object} 启动应用的参数，key-value格式为
     *     <br/> { appCode:"应用市场中填写的编码", appUrl:"启动页面相对地址", data:{name:"张三",sex:"male":age:25} }
     *     <br/> 其中data参数也是json对象，启动目标应用后，能够在app.getPageParams里面获取到。
     * @example
     * var params={
     *     appCode:"com.bingo.touch",
     *     data:{
     *         name:"张三",
     *         sex:"male",
     *         gender:23
     *     }
     * }
     * app.link.startApp(params);
   */
    app.link.startApp = function (params) {
        var dataStr = "";
        if (params.data) {
            for (var key in params.data) {
                dataStr += ("\n" + key + "=" + params.data[key]);
            };
        }
        params = "[OpenApp]\nappCode=" + params.appCode + (params.appUrl ? "\nappUrl=" + params.appUrl : "") + dataStr;
        Cordova.exec(null, null, "LinkPlugin", "startApp", [params]);
    }

    /**
        打开应用桌面
        @method app.link.openAppDesktop
        @deprecated
        @param
        @example
            app.link.openAppDesktop();
    */
    app.link.openAppDesktop = function () {
        var params = {
            code: "OpenBuiltIn",
            key: "DcApp"
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }

    /**
        打开应用市场
        @method app.link.openAppMarket
        @deprecated
        @example
            app.link.openAppMarket();
    */
    app.link.openAppMarket = function () {
        var params = {
            code: "OpenBuiltIn",
            key: "AppMarket"
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }

    /**
        打开应用详情页面
        @method app.link.openAppCard
        @deprecated
        @param {String} appCode 应用编码
        @example
            app.link.openAppCard("com.bingo.touch");
    */
    app.link.openAppCard = function (appCode) {
        var params = {
            code: "OpenBuiltIn",
            key: "AppDetail",
            AppCode: appCode
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }

    // *
    //  * 包括：发起签到、打开签到列表等操作
    //  * @class 签到



    /**
        调用Link的“我要签到”界面
        @method app.link.startCheckIn
        @example
            app.link.startCheckIn();
    */
    app.link.startCheckIn = function () {
        var params = "[StartCheckin]\npushToListOnComplete=false";
        Cordova.exec(null, null, "LinkPlugin", "launchLinkService", [params]);
    }

    /**
        调用Link的“签到列表”界面
        @method app.link.openCheckInList
        @example
            app.link.openCheckInList();
    */
    app.link.openCheckInList = function () {
        var params = "[OpenBuiltIn]\nkey=MyCheckIn";
        Cordova.exec(null, null, "LinkPlugin", "launchLinkService", [params]);
    }

    /**
        打开签到详情页面
        @method app.link.openCheckInDetail
        @param checkinId {String} 签到id
        @example
            app.link.openCheckInDetail('04f612d2-0931-48ea-ade8-6de5a382f8fc');
    */
    app.link.openCheckInDetail = function (checkinId) {
        var params = {
            code: "OpenBuiltIn",
            key: "CheckinDetail",
            checkinId: checkinId
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }

    // *
    //  * 个人相关设置界面调用接口
    //  * @class 设置


    /**
      * 打开个人信息修改页面
      * @method app.link.openPersonEdit
      * @example
      *     app.link.openPersonEdit();
    */
    app.link.openPersonEdit = function () {
        var params = {
            code: "OpenBuiltIn",
            key: "EditPersonInfo"
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }

    /**
      * 打开个人设置页面
      * @method app.link.openSetting
      * @example
      *     app.link.openSetting();
    */
    app.link.openSetting = function () {
        var params = {
            code: "OpenSubMenu",
            key: "setting",
            module: "MySelf"
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }

    /**
        打开关于页面
        @method app.link.openAbout
        @example
            app.link.openAbout();
    */
    app.link.openAbout = function () {
        var params = {
            code: "OpenBuiltIn",
            key: "MyAbout"
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }

    /**
        打开设置消息通知页面
        @method app.link.openStNotification
        @example
            app.link.openStNotification();
    */
    app.link.openStNotification = function () {
        var params = {
            code: "OpenBuiltIn",
            key: 'StNotification'
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }

    /**
      * 打开设置手势锁屏页面
      * @method app.link.openStGestureLock
      * @example
      *     app.link.openStGestureLock();
    */
    app.link.openStGestureLock = function () {
        var params = {
            code: "OpenBuiltIn",
            key: 'StGestureLock'
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }


    /**
      *打开手势锁屏页面，如果没有设置，会先弹出设置界面，如果有设置，则直接弹出解锁页面
      * @method app.link.openCheckGestureLock
      * @param successCallback {function} 成功回调函数
      * @param failCallback {function} 失败回调函数
      * @example app.link.openCheckGestureLock();
    */
    app.link.openCheckGestureLock = function (successCallback, failCallback) {
        var params = {
            code: "OpenBuiltIn",
            key: 'CheckGestureLock'
        };
        Cordova.exec(successCallback, failCallback, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }

    /**
      * 打开设置字体大小页面
      * @method app.link.openStFont
      * @example
      *     app.link.openStFont();
    */
    app.link.openStFont = function () {
        var params = {
            code: "OpenBuiltIn",
            key: 'StFont'
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }

    /**
      * 打开设备管理页面
      * @method app.link.openStDevice
      * @example
      *     app.link.openStDevice();
    */
    app.link.openStDevice = function () {
        var params = {
            code: "OpenBuiltIn",
            key: 'StDevice'
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }

    /**
        打开手工同步页面
        @method app.link.openStSync
        @example
            app.link.openStSync();
    */
    app.link.openStSync = function () {
        var params = {
            code: "OpenBuiltIn",
            key: 'StSync'
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }

    /**
      * 打开清除缓存页面
      * @method app.link.openStCleanCache
      * @example
      *     app.link.openStCleanCache();
    */
    app.link.openStCleanCache = function () {
        var params = {
            code: "OpenBuiltIn",
            key: 'StCleanCache'
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }

    /**
        打开修改密码页面
        @method app.link.openStModifyPassword
        @example
            app.link.openStModifyPassword();
    */
    app.link.openStModifyPassword = function () {
        var params = {
            code: "OpenBuiltIn",
            key: 'StModifyPassword'
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }

    /**
      * 打开邀请好友页面
      * @method app.link.openStInvite
      * @example
      *     app.link.openStInvite();
    */
    app.link.openStInvite = function () {
        var params = {
            code: "OpenBuiltIn",
            key: 'StInvite'
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }

    /**
        打开Link二维码页面
        @method app.link.openStQrcode
        @example
            app.link.openStQrcode();
    */
    app.link.openStQrcode = function () {
        var params = {
            code: "OpenBuiltIn",
            key: 'StQrcode'
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }

    /**
        注销Link
        @method app.link.logout
        @example
            app.link.logout();
    */
    app.link.logout = function () {
        var params = {
            code: "OpenBuiltIn",
            key: 'StLogout'
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }


    // *
    //  * 包括：服务同步、自由流、分享、发现服务等界面操作、获取收藏的服务数据、选择网盘文件、小视频、扫一扫等
    //  * @class 其他


    /**
    执行Link同步服务
    @method app.link.execSyncService
    @param type {int} 同步类型。 0：用户信息同步，1：群组信息同步，2：部门信息同步，3：服务号信息同步，4：好友企业同步，5：应用同步
    */
    app.link.execSyncService = function (type) {
        Cordova.exec(null, null, "LinkPlugin", "execSyncService", [type]);
    }

    /**
        打开自由流程页面
        @method app.link.startProcess
        @param processId {String} 流程id
        @param serviceName  {String} 流程名称
        @example
            app.link.startProcess('4b4db781-bdc2-4cfa-a6c0-03cc93bbef3f', '用户反馈');
    */
    app.link.startProcess = function (processId, serviceName) {
        var params = {
            code: "OpenProcess",
            processId: processId,
            serviceName: serviceName
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }

    /**
      * 打开我的工作页面
      * @method app.link.openProcessMywork
      * @example
      *     app.link.openProcessMywork();
    */
    app.link.openProcessMywork = function () {
        var params = {
            code: "OpenBuiltIn",
            key: "MyWork"
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }

    /**
        更新Link底部tab角标的数字
        @method app.link.updateTabBadge
        @param badgeValue {String} 角标的内容，这个内容直接更新到tab里面（当不传此值时去除角标）
        @example
            app.link.updateTabBadge('12');
    */
    app.link.updateTabBadge = function (badgeValue) {
        Cordova.exec(null, null, "LinkPlugin", "updateTabBadge", [badgeValue]);
    }

    /**
      * 获取当前Link的主题颜色值
      * @method app.link.getThemeColor
      * @param successCallback{Function} 成功回调，返回颜色值
      * @example
      * app.link.getThemeColor(function(res){
      *     app.alert(res);
      * });
    */
    app.link.getThemeColor = function (successCallback) {

        var callback = function (result) {
            result.background_color = "#" + result.background_color.substring(3);
            successCallback(result); //"#ff0072c6"
        }
        Cordova.exec(callback, null, "LinkPlugin", "getThemeColor", []);
    }

    /**
        启动link里面的服务(待补充)
        @method app.link.launchLinkService
        @param serviceParam{Object} 组合参数(需要用到请联系产品组)
    */
    app.link.launchLinkService = function (serviceParam) {
        Cordova.exec(null, null, "LinkPlugin", "launchLinkService", [serviceParam]);
    }


    /**
      * 注册系统消息监听<br/>注册完成后在页面声明 function nativeCallback(key, param) 就能够监听到消息了。param里面返回  accountType和 accountInstanceId
      * @method app.link.registerReceiver
      * @param key{String} link内部的key，例如 link_unreadMessageChanged 表示未读消息
    */
    app.link.registerReceiver = function (key) {
        Cordova.exec(null, null, "NativeBroadCast", "registerReceiver", [key]);
    }

    /**
      * 外部内容分享到Link里面(待补充)
      * @method app.link.share
      * @param params{Object}
      *     <br/>title: {string} 标题
      *     <br/>content: {string} 分享内容摘要
      *     <br/>icon: {string} 分享的图标地址，支持远程地址，或本地图片
      *     <br/>type: {string} WEBSITE,PICTURE
    */
    app.link.share = function (params, success, fail) {
        params = params || {};
        params.type = params.type || "WEBSITE";
        params.content = params.content || "";
        params.title = params.title || "";
        params.icon = params.icon || "";
        Cordova.exec(success, fail, "LinkPlugin", "share", [params]);
    }

    /**
      * 分享到聊天界面(个人/群组)
      * @method app.link.shareToMessage
      * @param params{Object}
      *     <br/>title: {string} 标题
      *     <br/>content: {string} 分享内容摘要
      *     <br/>icon: {string} 分享的图标地址，支持远程地址，或本地图片
      *     <br/>type: {string} WEBSITE,PICTURE
    */
    app.link.shareToMessage = function (params, success, fail) {
        params = params || {};
        params.type = params.type || "WEBSITE";
        params.content = params.content || "";
        params.title = params.title || "";
        params.icon = params.icon || "";
        Cordova.exec(success, fail, "LinkPlugin", "shareToMessage", [params]);
    }

    /**
      * 分享到动态
      * @method app.link.shareToBlog
      * @param params{Object}
      *     <br/>title: {string} 标题
      *     <br/>content: {string} 分享内容摘要
      *     <br/>icon: {string} 分享的图标地址，支持远程地址，或本地图片
      *     <br/>type: {string} WEBSITE,PICTURE。（4.6.8版本才支持PICTURE类型）
    */
    app.link.shareToBlog = function (params, success, fail) {
        params = params || {};
        params.type = params.type || "WEBSITE";
        params.content = params.content || "";
        params.title = params.title || "";
        params.icon = params.icon || "";
        if(params.type == 'PICTURE'){
			if(window.devicePlatform == "iOS"){
				params.content = params.icon;
			}
		}
        Cordova.exec(success, fail, "LinkPlugin", "shareToBlog", [params]);
    }

    /**
      * 分享到系统(Link 4.6.3 以上)
      * @method app.link.shareToSystem
      * @param params{Object}
      *     <br/>title: {string} 标题
      *     <br/>content: {string} 分享内容摘要
      *     <br/>icon: {string} 分享的图标地址，支持远程地址，或本地图片
      *     <br/>type: {string} WEBSITE,PICTURE。（4.6.8版本才支持PICTURE类型）
    */
    app.link.shareToSystem = function (params, success, fail) {
        params = params || {};
        params.type = params.type || "WEBSITE";
        params.content = params.content || "";
        params.title = params.title || "";
        params.icon = params.icon || "";
        params.text = params.content;
		
		if(params.type == 'PICTURE'){
			if(window.devicePlatform == "iOS"){
				params.content = params.icon;
			} else {
				params.filePath = params.icon;
			}
		}
        Cordova.exec(success, fail, "LinkPlugin", "shareToSystem", [params]);
    }

    /**
      * 打开小视频
      * @method app.link.openVideoRecord
    */
    app.link.openVideoRecord = function () {
        var params = {
            code: "OpenBuiltIn",
            key: "VideoCapture"
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }

    /**
    打开应用中心（旧版叫发现服务）
    @method app.link.openDiscoveryService
    */
    app.link.openDiscoveryService = function () {
        var params = {
            code: "OpenBuiltIn",
            key: "DcService"
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }

    /**
      * 打开扫一扫
      * @method app.link.scanCode
    */
    app.link.scanCode = function () {
        var params = {
            code: "OpenBuiltIn",
            key: "ScanCode"
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }

    /**
    打开Link内置浏览器
    @method app.link.openLinkBroswer
    @static
    */
    app.link.openLinkBroswer = function (title, url) {
        var params = {
            code: "OpenUrl",
            title: title,
            url: url
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }

    /**
    使用BT容器加载页面
    @method app.link.openBtBroswer
    @static
    @param {string} url 页面地址
    */
    app.link.openBtBroswer = function (url) {
        var params = "[BingoTouch]\nurl=" + url;
        Cordova.exec(null, null, "LinkPlugin", "launchLinkService", [params]);
    }


    /**
      * 打开pdf文件：url支持本地以及远程的地址
      * @method app.link.openPdfBroswer
      * @param title {Sting} 标题
      * @param url {Sting} url支持本地以及远程的地址
      * @static
    */
    app.link.openPdfBroswer = function (title, url) {
        var params = {
            name: title,
            uri: url
        }
        if (window.devicePlatform == "android") {
            Cordova.exec(null, null, "LinkPlugin", "fileBrowse", [params]);
        } else if (window.devicePlatform == "iOS") {
            app.link.openLinkBroswer(title, url);
        }
    }

    /**
    获取本地收藏的服务数据
    @method app.link.getFavoriteService
    @param callback {Function} 回调函数，返回json对象
    */
    app.link.getFavoriteService = function (callback) {
        var params = {
            code: "Data",
            key: "GetFavoriteService"
        };
        Cordova.exec(callback, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }

    /**
    获取全部收藏数据
    @method app.link.getAllServices
    @param callback {Function} 回调函数，返回json对象
    */
    app.link.getAllServices = function (callback) {
        var params = {
            code: "Data",
            key: "GetAllServices"
        };
        Cordova.exec(callback, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }

    /**
       选择文件
       @method app.link.chooseFile
       @param callback {Function} 回调函数，返回文件物理地址字符串
       @example
           app.link.chooseFile(function(result){
               app.alert(result);
           });
   */
    app.link.chooseFile = function (callback) {
        Cordova.exec(callback, null, "LinkPlugin", "chooseFile", []);
    }

    /**
     * 发起选择图片
     * @method app.link.imagePicker
     * @param {array} params.oldFileList  已选择的图片路径 ,只需要 resourceLocal对应的路径即可
     * @param {number} params.maxSelectCount  允许选择图片最大数量
     * @param {function} success [成功回调] [{"resourceSize":100kb,"resourceLocal":"/storage/emulated/0/xxxx", "fullSize": 100000, resourceType: 0}]
     * @param {function} fail    [失败回调]
     */
    app.link.imagePicker = function (success, fail, params) {
        var type = 1;
        params = params || {};
        params.oldFileList = params.oldFileList || [];
        params.maxSelectCount = params.maxSelectCount || 9;
        Cordova.exec(success, fail, "LinkPlugin", "selectResourceFiles", [type, params]);
    }


    /**
     * 压缩图片
     * @method app.link.compressImage
     * @param  {number} quality 图片压缩后的质量1~100,100为不压缩
     * @param  {array} pathArr 图片路径，里面每个元素都是对象 {path:"...",width:200,height:300}
     * @param  {function} success 成功回调函数
     * @param  {function} fail    失败回调函数
     */
    app.link.compressImage = function (quality, pathArr, success, fail) {
        Cordova.exec(success, fail, "LinkPlugin", "compressImage", [quality, pathArr]);
    }

    /**
     * 把本地图片保存到相册
     * @method app.link.saveToGallery
     * @param  {string} sourcePath 本地文件的路径
     * @param  {function} success 成功回调函数。 {path: '相册路径'}
     * @param  {function} fail    失败回调函数
     */
    app.link.saveToGallery = function (sourcePath, success, fail) {
        var params = {
            source: sourcePath
        };
        Cordova.exec(success, fail, "FilePlugin", "saveToGallery", [params]);
    }

    /**
     * 获取语言
     * @method app.link.getLanguage
     * @param  {Function} callback 回调函数,返回 en, zh-cn
     */
    app.link.getLanguage = function (callback) {
        Cordova.exec(callback, null, "LinkPlugin", "getLanguage", []);
    }


    /**
     * 打开云盘
     * @method app.link.openDisk
     */
    app.link.openDisk = function () {
        var params = {
            code: "OpenBuiltIn",
            key: "StartNewDisk",
            naviStyle: 3
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }

    /**
     * 打开语音助手
     * @method app.link.openSpeechAssistant
     */
    app.link.openSpeechAssistant = function () {
        var params = {
            code: "OpenBuiltIn",
            key: "SpeechAssistant"
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }


    /**
     * 发起聊天
     * @method app.link.startChat
     */
    app.link.startChat = function () {
        var params = {
            code: "StartChat"
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }

    /**
     * 打开待办待阅
     * @method app.link.openTodo
     * @param {object} options
     * @param {int} options.defaultIndex 0(待办)/1（待阅）/2（已办）
     */
    app.link.openTodo = function (options) {
        var params = {
            code: "UnityTodo",
            defaultIndex: options.defaultIndex
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }


    /**
     * 打开邮箱
     * @method app.link.startEmail
     */
    app.link.startEmail = function () {
        var params = {
            code: "OpenBuiltIn",
            key: "StartEmail"
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }

    /**
     * 打开在线客服
     * @method app.link.openOnlineServicer
     */
    app.link.openOnlineServicer = function () {
        var params = {
            code: "OpenBuiltIn",
            key: "OnlineServicer"
        };
        Cordova.exec(null, null, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }

    /**
     * 获取配置的服务器地址
     * @method app.link.getServerConfigs
     * @param {function} success 成功回调函数，返回json对象，所有的配置地址
     * @param {function} fail 失败回调函数，返回失败错误信息
     */
    app.link.getServerConfigs = function (success, fail) {
        Cordova.exec(success, fail, "LinkPlugin", "getServerConfigs", []);
    }


    /**
     * 浏览多媒体资源，包括图片、视频(android)
     * @method app.link.browseMultiMedia
     * @param {object} params 参数
     * @param {array} params.data 媒体数据对象数组，数据对象{url:"",thumbUrl:"",fileSize:100,fileType:1} fileType: 1图片2视频
     * @param {integer} params.position 初始化位置，默认是0
     * @param {bool} params.isVideoMuteOnFirstPlay 是否静音播放点击进来的视频，默认 false
     * @param {bool} params.isOptionEnable  是否允许进行保存网盘，分享聊天等操作，默认 true
     */
    app.link.browseMultiMedia = function (params) {
        params = $.extend({
            data: [],
            position: 0,
            isVideoMuteOnFirstPlay: false,
            isOptionEnable: true
        }, params);

        Cordova.exec(null, null, "LinkPlugin", "browseMultiMedia", [params]);
    }

    /**
    * sourceId转userId
    * @method app.link.sourceIdToUserId
    * @param {string} sourceId sourceId
    * @param {Function} successCallback 成功回调函数,返回用户信息/服务地址
    * @param {Function} failCallback 失败回调函数，返回错误字符串
    * @param {Object} option 参数
    * @param {string} option.isGetParams 是否传回服务地址
    */
    app.link.sourceIdToUserId = function (sourceId, successCallback, failCallback, option) {
        app.link.getServerConfigs((params) => {
            app.get(params.uamApiUri + '/v1/users/info', {
                sourceId
            }, function (res) {
                if (option && option.isGetParams) {
                    successCallback(res, params)
                } else {
                    successCallback(res)
                }
            }, function (err) {
                failCallback(err)
            })
        }, (err) => {
            failCallback(err)
        })
    }
    /**
    * 根据单个sourceId获取头像
    * @method app.link.getHPicture
    * @param {string} sourceId sourceId
    * @param {Function} successCallback 成功回调函数,返回图片地址
    * @param {Function} failCallback 失败回调函数，返回错误字符串
    */
    app.link.getHPicture = function (sourceId, successCallback, failCallback) {
        app.link.sourceIdToUserId(sourceId, (res, params) => {
            if (res.code == 200) {
                bui.alert(res)
                try {
                    let par = typeof res.returnValue == "string" ? JSON.parse(res.returnValue) : res.returnValue
                    let img = par.data.picture.split('||')[0]
                    if (img != '') {
                        let imgUrl = params.uamUri + '/ui/upload?action=download&filepath=' + img
                        successCallback(imgUrl)
                    } else {
                        successCallback('')
                    }
                } catch (error) {
                    failCallback(error)
                }
            } else {
                failCallback(res)
            }
        }, (err) => {
            failCallback(err)
        }, { isGetParams: true })
    }
    /**
    * 根据sourceId批量获取头像并设置到dom元素方法
    * @method app.link.getHPictures
    * @param className {string} dom元素类名
    */
    app.link.getHPictures = function (className) {
        $.each($(className), (index, item) => {
            if (item.getAttribute('isSuccess') == 'true') return
            app.link.getHPicture(item.getAttribute('sourceId'), (res) => {
                item.src = res
                item.setAttribute('isSuccess', 'true')
            }, (err) => {
                item.setAttribute('isSuccess', 'false')
            })
        })
    }
    /**
    * 固定横竖屏(安卓4.4.2)
    * @method app.link.setScreenOrientation
    * @param params {object} 参数
    * @param params.type {string} 参数值 portrait:竖屏/landscape:横屏/auto:自动
    * @param successCallback {function} 成功回调函数
    * @param failCallback {function} 失败回调函数
    */
    app.link.setScreenOrientation = function (params, successCallback, failCallback) {
        Cordova.exec(successCallback, failCallback, "LinkPlugin", "setScreenOrientation", [params]);
    }

    /**
   * 部门选择用户控件-单选(4.4.2)
   * @method app.link.startOrganUserSingleSelector
   * @param params {object} 参数
   * @param params.title {string} 提示
   * @param params.orgId {string} 部门id
   * @param params.userIgnoreList {Array} 忽略某些用户
   * @param params.userFixSelectedList {Array} 固定选中用户
   * @param successCallback {function} 成功回调函数
   * @param failCallback {function} 失败回调函数
   */
    app.link.startOrganUserSingleSelector = function (successCallback, failCallback, params) {
        Cordova.exec(successCallback, failCallback, "LinkPlugin", "startOrganUserSingleSelector", [params]);
    }

    /**
     * 部门选择控件-多选
     * @method app.link.startOrganUserMultiSelector
     * @param params {object} 参数
     * @param params.title {string} 提示
     * @param params.orgId {string} 部门id
     * @param params.userIgnoreList {Array} 忽略某些用户
     * @param params.userFixSelectedList {Array} 固定选中用户
     * @param successCallback {function} 成功回调函数
     * @param failCallback {function} 失败回调函数
     */
    app.link.startOrganUserMultiSelector = function (successCallback, failCallback, params) {
        Cordova.exec(successCallback, failCallback, "LinkPlugin", "startOrganUserMultiSelector", [params]);
    }

    /**
     * 获取app安装信息
     * @method app.link.getSdcardAppDir
     * @param successCallback {function} 成功回调函数
     * @param failCallback {function} 失败回调函数
     */
    app.link.getSdcardAppDir = function (successCallback, failCallback) {
        Cordova.exec(successCallback, failCallback, "LinkPlugin", "getSdcardAppDir", []);
    }

    /**
     * zoom加入视频会议(4.5.1)
     * @method app.link.joinMeeting
     * @param params {object} 参数
     * @param params.meetingNo {string} 视频会议ID
     * @param params.meetingPwd {string} 视频会议密码
     * @param params.nickName {string} 视频会议名称
     * @param successCallback {function} 成功回调函数
     * @param failCallback {function} 失败回调函数
     */
    app.link.joinMeeting = function (successCallback, failCallback, params) {
        Cordova.exec(successCallback, failCallback, "HuaweiMeeting", "joinMeeting", [params]);
    }

    //   app.fuZhouWpsPlugin.openFile = function (successCallback,failCallback,option) {
    //     Cordova.exec(successCallback, failCallback, "FuZhouWpsPlugin", "openFile",[option]);
    //   }
    /**
    * 设置全屏（安卓）
    * @method app.link.setFullScreen
    * @param successCallback {function} 成功回调函数,返回json对象
    * @param failCallback {function} 失败回调函数，返回错误字符串
    * @param params {object} 参数
    * @param params.isEnable {Boolean} true 全屏 false 取消全屏
    */
    app.link.setFullScreen = function (successCallback, failCallback, params) {
        Cordova.exec(successCallback, failCallback, "LinkPlugin", "setFullScreen", [params]);
    }

    /**
     * Link平台功能接口，使用该模块必须先引入Cordova.js 和 bingotouch.js<br/>获取步数相关操作接口
     * @namespace app.todayStepCount
    */
    window.app.todayStepCount = window.app.todayStepCount || {};

    /**
     * 获取今天的步数
     *
     * 如果需要持续获取步数变化，可以js启用一个定时器，定时调用这个方法
     *   app.todayStepCount.getTodayStepCount(function (data) {
     *      bui.alert("成功回调 data:"+data.stepCount);
     *   },function (data) {
     *       bui.alert("错误回调"+data);
     *   });
     *
     *	成功回调值 
     *  {
     *		"from":	"com.huawei.health",//如果是"from"="com.huawei.health"，则是从华为运动健康获取到的数据，否则没有这一个字段
     *      "stepCount":10000,//如果"from"="com.huawei.health"，则是从华为健康读取到的步数，否则是原来旧逻辑的步数（非华为手机一般都没有华为健康应用，但用户手动下载华为运动健康应用也可以读取到）
     *	    "nativeStepCount":20000,//原来旧逻辑的步数，如果"from"="com.huawei.health"，则有这一个字段，否则没有这一个字段。
     *	}
     *
     *  失败回调值 
     *  {
     *	   "errorMsg":"失败回调说明"，
     *     "errorCode":失败回调code,
     *     "from":"com.huawei.health",//为了以后区分是三星健康还是华为运动健康用的。
     *     "nativeStepCount":10000,原来旧逻辑的步数
     *  }
     errorCode和errorMsg对接列表
         1 调用失败 典型场景:没有安装华为运动健康App或者未启动
         2 参数异常 典型场景:不支持某项查询
         4 API调用异常 典型场景:如：一个应用多次注册运动而未进行解注册
         1001 隐私权限校验异常 典型场景:用户未授权，需要提醒用户打开相关权限
         1002 scope校验异常 典型场景:华为未授权对应的scope权限，需要三方开发者到开发者联盟申请。参见申请 HiHealth Kit 服务。
         3  数据校验失败 典型场景:查询参数为 null 或回调函数为 null
         7  参数错误 典型场景:插入数据时起止时间不同，如：插入体重数据
         1003  APP隐私协议未同意异常 典型场景:用户未在华为运动健康App 上同意隐私协议
         -100  没有获取到读取步数的权限（android10上没有华为运动健康的手机，需要申请”获取设备中的健身运动信息“权限才可以获取步数，如果没有权限则报这一个错）
     */
    /**
    * 获取今天步数
    * @method app.todayStepCount.getTodayStepCount
    * @param successCallback {function} 成功回调函数,返回json对象
    * @param failCallback {function} 失败回调函数，返回错误字符串
    */
    app.todayStepCount.getTodayStepCount = function (successCallback, failCallback) {
        Cordova.exec(successCallback, failCallback, "StepCounter", "getTodayStepCount", []);
    }


    /**
     * 只取旧逻辑步数不读华为健康等第三方的步数。（避免如果一直读取华为运动健康步数，但用户又一直拒绝给权限的问题）
     * @method app.todayStepCount.getNativeTodayStepCount
     * @param successCallback {function} 成功回调函数,返回json对象
     * @param failCallback {function} 失败回调函数，返回错误字符串
     */
    app.todayStepCount.getNativeTodayStepCount = function (successCallback, failCallback) {
        Cordova.exec(successCallback, failCallback, "StepCounter", "getTodayStepCount", [{ "from": "native" }]);
    }

    /**
     * 获取除了旧的计步逻辑外，可以对接的第三方运动健康步数来源
     * 例如华为手机上装有运动健康的话就是返回"['com.huawei.health']"
     * @method app.todayStepCount.getStepCountFrom
     * @param successCallback {function} 成功回调函数,返回可用来源：['com.huawei.health']
     */
    app.todayStepCount.getStepCountFrom = function (successCallback) {
        Cordova.exec(successCallback, null, "StepCounter", "getStepCountFrom", []);
    }


    /**
     * 保存步数来源
     * @method app.todayStepCount.savedFrom
     * @param from {Array} 步数来源
     * @param successCallback {function} 成功回调函数
     */
    app.todayStepCount.savedFrom = function (from, successCallback) {
        Cordova.exec(successCallback, null, "StepCounter", "savedFrom", [{ "from": from }]);
    }

    /**
     * 获取已经保存的步数来源
     * @method app.todayStepCount.getStepCountSavedFrom
     * @param successCallback {function} 成功回调函数
     */
    app.todayStepCount.getStepCountSavedFrom = function (successCallback) {
        Cordova.exec(successCallback, null, "StepCounter", "getStepCountSavedFrom", []);
    }

    /**
     * Link平台功能接口，使用该模块必须先引入Cordova.js 和 bingotouch.js<br/>通讯交互相关操作接口
     * @namespace app.broadcast
    */
    window.app.broadcast = window.app.broadcast || {};
    /**
     * 事件注册-跨技术（weex/bt）
     * @method app.broadcast.registerReceiverEvent
     * @param successCallback {function} 成功回调函数,返回json对象
     * @param failCallback {function} 失败回调函数，返回错误字符串
     * @param eventName {string} 事件名称
     * @param receiver {string} 事件回调名称-如：receiver值为callback，那么将触发window.callback()
     */
    app.broadcast.registerReceiverEvent = function (successCallback, failCallback, eventName, receiver) {
        Cordova.exec(successCallback, failCallback, "BroadcastPlugin", "registerReceiver", [{ "receiverId": null, eventName, receiver }]);
    }
    /**
    * 取消事件注册-跨技术（weex/bt）
    * @method app.broadcast.unregisterReceiver
    * @param successCallback {function} 成功回调函数,返回json对象
    * @param failCallback {function} 失败回调函数，返回错误字符串
    * @param receiverId {string} 注册id
    */
    app.broadcast.unregisterReceiver = function (successCallback, failCallback, receiverId) {
        Cordova.exec(successCallback, failCallback, "BroadcastPlugin", "unregisterReceiver", [{ receiverId }]);
    }
    /**
     * 发送注册事件-跨技术（weex/bt）
     * @method app.broadcast.sendBroadcast
     * @param successCallback {function} 成功回调函数,返回json对象
     * @param failCallback {function} 失败回调函数，返回错误字符串
     * @param eventName {string} 事件名称
     * @param params {object} 传参参数
     */
    app.broadcast.sendBroadcast = function (successCallback, failCallback, eventName, params) {
        Cordova.exec(successCallback, failCallback, "BroadcastPlugin", "sendBroadcast", [{ eventName, params }]);
    }

    /**
     * 获取指定文件大小
     * @method app.link.getFlieSize
     * @param successCallback {function} 成功回调函数,返回文件大小
     * @param failCallback {function} 失败回调函数，返回错误字符串
     * @param path {string} 文件路径
     */

    app.link.getFlieSize = function (path, successCallback, failCallback) {
        Cordova.exec(successCallback, failCallback, "FilePlugin", "getSize", [path]);
    }

    /**
     * 删除指定文件
     * @method app.link.deleteFile
     * @param successCallback {function} 成功回调函数
     * @param failCallback {function} 失败回调函数，返回错误字符串
     * @param path {string} 文件路径
    */

    app.link.deleteFile = function (path, successCallback, failCallback) {
        Cordova.exec(successCallback, failCallback, "FilePlugin", "delete", [path]);
    }

    /**
     * 调用手势
     * @method app.link.startGestureLockValidation
     * @param successCallback {function} 成功回调函数
     * @param failCallback {function} 失败回调函数
    */

    app.link.startGestureLockValidation = function (successCallback, failCallback) {
        Cordova.exec(successCallback, failCallback, "LinkPlugin", "startGestureLockValidation", []);
    }

    /**
     * 录屏方法，具有倒计时能力（4.5.6）
     * @method app.link.captureVideo
     * @param successCallback {function} 成功回调函数 返回文件信息 fullPath：文件保存路径 name：文件名称 size: 文件大小
     * @param failCallback {function} 失败回调函数
     * @param params {object} 传参参数
     * @param params.duration {number} 录制时长
     */
    app.link.captureVideo = function (successCallback, failCallback, params) {
        navigator.device.capture.captureVideo(successCallback, failCallback, params);
    }

    /**
     * 压缩方法(在部分的安卓手机上不兼容)
     * @method app.link.transcodeVideo
     * @param successCallback {function} 成功回调函数
     * @param failCallback {function} 失败回调函数
     * @param params {Object}
     * @param params.fileUri {string} 设备上视频的路径
     * @param params.outputFileName {string} 输出文件名称
     */
    app.link.transcodeVideo = function (successCallback, failCallback, params) {
        Cordova.exec(successCallback, failCallback, 'VideoEditor', 'transcodeVideo', [params]);
    }

    /**
     * 获取终端设置的字体大小 小、中、大的值分别对应的是13，16，20（安卓端 4.5.5）
     * @method app.link.getTextSizeSetting
     * @param successCallback {function} 成功回调函数
     * @param failCallback {function} 失败回调函数
    */
    app.link.getTextSizeSetting = function (successCallback, failCallback) {
        Cordova.exec(successCallback, failCallback, 'LinkPlugin', 'getTextSizeSetting', []);
    }

    /**
      * 打开轻应用调试模式（安卓端 4.5.5）
      * @method app.link.startDevMain
      * @param successCallback {function} 成功回调函数
      * @param failCallback {function} 失败回调函数
    */
    app.link.startDevMain = function (successCallback, failCallback) {
        var params = {
            code: "OpenBuiltIn",
            key: "startDevMain"
        };
        Cordova.exec(successCallback, failCallback, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }

    /**
     * 获取link版本（安卓 4.5.5）
     * @method app.link.getVersionInfo
     * @param successCallback {function}  成功回调函数，返回版本信息
     * @param failCallback {function}  失败回调函数
     */
    app.link.getVersionInfo = function (successCallback, failCallback) {
        Cordova.exec(successCallback, failCallback, 'LinkPlugin', 'getVersionInfo', []);
    }

    /**
     * 检测link是否有新版本（安卓端 4.5.5）
     * @method app.link.checkVersion
     * @param successCallback {function}  成功回调函数
     * @param failCallback {function}  失败回调函数
     */
    app.link.checkVersion = function (successCallback, failCallback) {
        var params = {
            code: "OpenBuiltIn",
            key: "CheckVersion"
        };
        Cordova.exec(successCallback, failCallback, "LinkPlugin", "launchLinkServiceWithDictionary", [params]);
    }

    /**
     * 发起选择文件资源
     * @method app.link.selectFiles
     * @param type {number} 范围0~5，0：拍照 1：选择图片  2 本地文件单选  3：云盘文件  4: 界与聊天里的文件跳转后界面相同，选择最近聊天文件和本地文件(仅支持安卓)  5: 本地文件多选
     * @param successCallback {function} 成功回调函数 [{"resourceSize":100kb,"resourceLocal":"/storage/emulated/0/xxxx"}]
     * @param failCallback {function}    失败回调函数
     */
    app.link.selectFiles = function (successCallback, failCallback, type) {
        Cordova.exec(successCallback, failCallback, "LinkPlugin", "selectResourceFiles", [type]);
    }

    /**
     *  根据文件路径转base64
     *  @method app.link.pathToBase64
     *  @param successCallback {function} 成功回调函数 返回base64
     *  @param failCallback {function} 失败回调函数
    */
    app.link.pathToBase64 = function (successCallback, failCallback, params) {
        var fullPath = params.fullPath,
            size = params.size;
        Cordova.exec(successCallback, failCallback, "File", "readAsDataURL", [fullPath, 0, size]);
    }

    /**
     *  根据文件路径获取文件信息
     *  @method app.link.getFileMetadata
     *  @param successCallback {function} 成功回调函数 [{"size":100000,"fullPath":"/storage/emulated/0/xxxx", type: "image/jpeg", "name": "XXX", "lastModifiedDate": "更新时间"}]
     *  @param failCallback {function} 失败回调函数
     *  @param path {string} 文件路径
     */
    app.link.getFileMetadata = function (successCallback, failCallback, path) {
        Cordova.exec(successCallback, failCallback, "File", "getFileMetadata", [path]);
    }

    /**
     * 开始录音（安卓4.5.6）
     * @method app.link.recordStart
     * @param params {Object}  参数对象
     * @param params.savePath {string}  录音的保存路径
     * @param successCallback {function} 成功回调
     * @param failCallback {function} 失败回调
     */
    app.link.recordStart = function (successCallback, failCallback, params) {
        Cordova.exec(successCallback, failCallback, "RecordVoice", "recordStart", [params.savePath]);
    }

    /**
     * 结束录音（安卓4.5.6）
     * @method app.link.recordStop
     * @param successCallback {function} 成功回调，返回录音信息
     * @param failCallback {function} 失败回调
     */
    app.link.recordStop = function (successCallback, failCallback) {
        Cordova.exec(successCallback, failCallback, "RecordVoice", "recordStop", []);
    }

    /**
     * 视频压缩能力（安卓4.5.6）
     * @method app.link.compressedVideo
     * @param successCallback {function} 成功回调函数 返回文件信息 fullPath：文件保存路径 name：文件名称 size: 文件大小
     * @param failCallback {function} 失败回调函数
     * @param params {Object}  参数对象
     * @param params.inputFile {string} 设备上视频的路径
     * @param params.outputFile {string} 输出文件路径
     */
    app.link.compressedVideo = function (successCallback, failCallback, params) {
        var param = {
            args: ['-i', params.inputFile, "-vcodec", "mpeg4", '-b:v', '500k', '-r', '15', params.outputFile, '-y']
        }
        Cordova.exec(successCallback, failCallback, "MediaProcessPlugin", "ffmpeg", [param]);
    }

    /**
     * 云学堂直播-SDK初始化
     * @method app.link.initYXTLiveSdk
     * @param environment {string}  运行环境，值有Develop、Ucstable、Production、Feature
     * @param accessType {string} 接入模式，值有Inner、ForeignMiniCourse、ForeignLive。（该参数iOS无效）
     * @param enableLog {boolean} 日志是否打开。（该参数iOS无效）
     * @param successCallback {function} 成功回调函数
     * @param failCallback {function} 失败回调函数
     * @example
     *  app.link.initYXTLiveSdk(example_environment, example_accessType, example_enableLog, result => {
     *      bui.alert('sdk init success')
     *  },
     *  error => {
     *      bui.alert(error);
     *  })
     */
    app.link.initYXTLiveSdk = function (environment, accessType, enableLog, successCallback, failCallback) {
        if(window.devicePlatform == "iOS"){
            switch(environment){
                case 'Develop':
                    environment = 0;
                break;
                case 'Feature':
                    environment = 1;
                break;
                case 'Ucstable':
                    environment = 2;
                break;
                case 'Production':
                    environment = 3;
                break;
            }
        }
        Cordova.exec(successCallback, failCallback, "YXTLivePlugin", "initLiveSdk", [{environment, accessType, enableLog}]);
    }

    /**
     * 云学堂直播-打开直播
     * @method app.link.openYXTLiveScene
     * @param scene {string} 直播场景，值有 liveRoom（直播间）、liveReplay（直播回放）、miniCourse（微课）
     * @param roomId {string}  直播间 id
     * @param token {string} 鉴权 token
     * @param title {string} 直播或微课的标题。直播回放、微课需要传，直播间不需要传
     * @param successCallback {function} 成功回调函数
     * @param failCallback {function} 失败回调函数
     * @example
     *  app.link.openYXTLiveScene(example_scene, example_roomId, example_token, example_title, result => {
     *      bui.alert('openYXTLiveScene success')
     *  },
     *  error => {
     *      bui.alert(error);
     *  })
     */
    app.link.openYXTLiveScene = function (scene, roomId, token, title, successCallback, failCallback) {
        Cordova.exec(successCallback, failCallback, "YXTLivePlugin", "openYXTLiveScene", [{scene, roomId, token, title}]);
    }
})(window);