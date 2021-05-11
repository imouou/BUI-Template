/**
 * 解析传进来的url地址，返回一个对象, 一般用于分享
 * @param {string} url [ url地址，必填 ]
 * @param {boolean} bool [是否中文转码，默认true ｜ false,可选 ]
 * @return {object} 
 * @example 
 * // bui webview操作的方法
 * const webview = require('../../bui/webview.js');
 * let params = webview.getUrlParams("http://easybui.com/demo/index.html#pages/ui_controls/bui.tab?id=tab1&index=1"); id,index 为示例参数，非必须
 * console.log(params);
 * // 结果
 * params.module = "pages/ui_controls/bui.tab"
 * params.id = "tab1"
 * params.index = "1"
 * // 把这个对象拼接成 域名/index.html?module=pages/ui_controls/bui.tab&id=tab1&index=1  bui的单页路由就会自动解析到对应的页面及参数。
 * 
 */
const getUrlParams = (url, bool)=> {
  // 获取url地址后的object参数, 包括模块名
      bool = bool == false ? false : true;
      url = url || ""; //获取url中"?"符后的字串

  let hasParam = url.indexOf("?");
  let obj = {};
    if (hasParam > -1) {
      let str = url.substr(hasParam + 1);

      obj = keyStringToObject(str, bool);
      // 把模块也解析
      let hash = url.split("#")[1] || "";
      obj.module = hash.split("?")[0] || "main";
    }
  return obj;
}

/**
 * 把url地址，跟参数，合并成一个url字符串 返回一个新的url地址，用于传参
 * @param {string} url [ url地址，必填 ]
 * @param {object} param [参数，例如：{module:"pages/xxx",id:1}  ]
 * @param {boolean} bool [是否中文转码，默认true ｜ false,可选 ]
 * @return {string} 
 * @example 
 * // bui webview操作的方法
 * const webview = require('../../bui/webview.js');
 * // 小程序跳转的地址，及传参数
 * let url = webview.setUrlParams("pages/webapp/index",{module:"pages/xxx",id:1});
 * console.log(url);
 * // 结果
 * url = "pages/webapp/index?module=pages/xxx&id=1"
 * pages/webapp/index.js 会根据bui的单页路由就会自动解析到对应的页面及参数。
 * 
 */
const setUrlParams = (url, param, bool)=>{
  // 设置url变成?号传参的地址
    bool = bool == false ? false : true;
    param = typeof(param) == 'object' ? param : {};

  let newurl;

  let params = objectToKeyString(param, bool);
    //有对象字面量才修改url地址
    if (params == "") {
      newurl = url;
    } else {
      newurl = url + '?' + params; //取第1位到结束的字符
    }
    
  return newurl;
}
// url的传参处理成对象
const keyStringToObject = (str, bool)=>{
  var obj = {},
    strs = [],
    i;
  try {

    strs = str.split("&");
    for (i = 0; i < strs.length; i++) {
      var val = bool ? decodeURIComponent(strs[i].split("=")[1]) : strs[i].split("=")[1];

      obj[strs[i].split("=")[0]] = val;
    }
  } catch (e) {
    ui.showLog(e);
  }

  return obj;
};
// 对象处理成url传参的格式
const objectToKeyString = (obj, bool)=> {
  var str = '';
  //用javascript的for/in循环遍历对象的属性
  for (let i in obj) {
    let val = bool ? encodeURIComponent(obj[i]) : obj[i];

    str += '&' + i + '=' + val;
  }
  return str.substr(1);
};

module.exports = {
    getUrlParams,
    setUrlParams
}
