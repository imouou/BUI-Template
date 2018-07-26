
// 离线应用的相关API

    //判断浏览器是否能够连接互联网，online表示能够联网，offline表示不能联网；根据浏览器状态自动监听并进行响应【通过断开或开启本地连接进行测试】  
    window.addEventListener("online", function() {  
        alert("您已变成在线状态")  
    }, true);  
    window.addEventListener("offline", function() {  
        alert("您已变成离线状态")  
    }, true);  
    //手动判断浏览器的联网状态  
    /*  if(navigator.onLine){  
        alert("在线");  
    }else{  
        alert("离线");  
    } */  
    //alert("navigator.onLine:"+navigator.onLine);  
    //当index.manifest内容更新时，浏览器检查到存在更新，并进行提示  
    function init() {  
        setInterval("toUpdateCache()", 3000);  
    }  
    function toUpdateCache() {  
        //强制检查服务器上的manifest文件是否有更新  
        applicationCache.update();  
    }  
    applicationCache.onupdateready = function() {  
        if (confirm("本地缓存已被更新,需要刷新页面来获取应用程序最新版本")) {  
            //手动更新本地缓存，只能在onupdateready事件触发时调用  
            applicationCache.swapCache();  
            location.reload();  
        }  
    }  
  
    /* function test(){  
    var msg=document.getElementById("msg");  
    applicationCache.onchecking=function(){  
        msg.innerHTML+="onchecking<br/>";  
    }  
    applicationCache.ondownloading=function(){  
        msg.innerHTML+="ondownloading<br/>";  
    }  
    applicationCache.onprogress=function(){  
        msg.innerHTML+="onprogress<br/>";  
    }  
    applicationCache.onupdateready=function(){  
        msg.innerHTML+="onupdateready<br/>";  
    }  
    applicationCache.oncached=function(){  
        msg.innerHTML+="oncached<br/>";  
    }  
    applicationCache.onerror=function(){  
        msg.innerHTML+="onerror<br/>";  
    }  
      
    } */  