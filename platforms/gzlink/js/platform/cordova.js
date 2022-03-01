var userAgent = navigator.userAgent.toLowerCase();
if (/android/.test(userAgent)) {
(function(){window.devicePlatform="android";var require,define;(function(){var modules={};var requireStack=[];var inProgressModules={};function build(module){var factory=module.factory;module.exports={};delete module.factory;factory(require,module.exports,module);return module.exports}require=function(id){if(!modules[id]){throw"module "+id+" not found"}else{if(id in inProgressModules){var cycle=requireStack.slice(inProgressModules[id]).join("->")+"->"+id;throw"Cycle in require graph: "+cycle}}if(modules[id].factory){try{inProgressModules[id]=requireStack.length;requireStack.push(id);return build(modules[id])}finally{delete inProgressModules[id];requireStack.pop()}}return modules[id].exports};define=function(id,factory){if(modules[id]){throw"module "+id+" already defined"}modules[id]={id:id,factory:factory}};define.remove=function(id){delete modules[id]};define.moduleMap=modules})();if(typeof module==="object"&&typeof require==="function"){module.exports.require=require;module.exports.define=define}define("cordova",function(require,exports,module){var channel=require("cordova/channel");document.addEventListener("DOMContentLoaded",function(){channel.onDOMContentLoaded.fire()},false);if(document.readyState=="complete"||document.readyState=="interactive"){channel.onDOMContentLoaded.fire()}var m_document_addEventListener=document.addEventListener;var m_document_removeEventListener=document.removeEventListener;var m_window_addEventListener=window.addEventListener;var m_window_removeEventListener=window.removeEventListener;var documentEventHandlers={},windowEventHandlers={};document.addEventListener=function(evt,handler,capture){var e=evt.toLowerCase();if(typeof documentEventHandlers[e]!="undefined"){documentEventHandlers[e].subscribe(handler)}else{m_document_addEventListener.call(document,evt,handler,capture)}};window.addEventListener=function(evt,handler,capture){var e=evt.toLowerCase();if(typeof windowEventHandlers[e]!="undefined"){windowEventHandlers[e].subscribe(handler)}else{m_window_addEventListener.call(window,evt,handler,capture)}};document.removeEventListener=function(evt,handler,capture){var e=evt.toLowerCase();if(typeof documentEventHandlers[e]!="undefined"){documentEventHandlers[e].unsubscribe(handler)}else{m_document_removeEventListener.call(document,evt,handler,capture)}};window.removeEventListener=function(evt,handler,capture){var e=evt.toLowerCase();if(typeof windowEventHandlers[e]!="undefined"){windowEventHandlers[e].unsubscribe(handler)}else{m_window_removeEventListener.call(window,evt,handler,capture)}};function createEvent(type,data){var event=document.createEvent("Events");event.initEvent(type,false,false);if(data){for(var i in data){if(data.hasOwnProperty(i)){event[i]=data[i]}}}return event}if(typeof window.console==="undefined"){window.console={log:function(){}}}var cordova={define:define,require:require,addWindowEventHandler:function(event){return(windowEventHandlers[event]=channel.create(event))},addStickyDocumentEventHandler:function(event){return(documentEventHandlers[event]=channel.createSticky(event))},addDocumentEventHandler:function(event){return(documentEventHandlers[event]=channel.create(event))},removeWindowEventHandler:function(event){delete windowEventHandlers[event]},removeDocumentEventHandler:function(event){delete documentEventHandlers[event]},getOriginalHandlers:function(){return{"document":{"addEventListener":m_document_addEventListener,"removeEventListener":m_document_removeEventListener},"window":{"addEventListener":m_window_addEventListener,"removeEventListener":m_window_removeEventListener}}},fireDocumentEvent:function(type,data,bNoDetach){var evt=createEvent(type,data);if(typeof documentEventHandlers[type]!="undefined"){if(bNoDetach){documentEventHandlers[type].fire(evt)}else{setTimeout(function(){documentEventHandlers[type].fire(evt)},0)}}else{document.dispatchEvent(evt)}},fireWindowEvent:function(type,data){var evt=createEvent(type,data);if(typeof windowEventHandlers[type]!="undefined"){setTimeout(function(){windowEventHandlers[type].fire(evt)},0)}else{window.dispatchEvent(evt)}},callbackId:Math.floor(Math.random()*2000000000),callbacks:{},callbackStatus:{NO_RESULT:0,OK:1,CLASS_NOT_FOUND_EXCEPTION:2,ILLEGAL_ACCESS_EXCEPTION:3,INSTANTIATION_EXCEPTION:4,MALFORMED_URL_EXCEPTION:5,IO_EXCEPTION:6,INVALID_ACTION:7,JSON_EXCEPTION:8,ERROR:9},callbackSuccess:function(callbackId,args){try{cordova.callbackFromNative(callbackId,true,args.status,[args.message],args.keepCallback)}catch(e){console.log("Error in error callback: "+callbackId+" = "+e)}},callbackError:function(callbackId,args){try{cordova.callbackFromNative(callbackId,false,args.status,[args.message],args.keepCallback)}catch(e){console.log("Error in error callback: "+callbackId+" = "+e)}},callbackFromNative:function(callbackId,success,status,args,keepCallback){var callback=cordova.callbacks[callbackId];if(callback){if(success&&status==cordova.callbackStatus.OK){callback.success&&callback.success.apply(null,args)}else{if(!success){callback.fail&&callback.fail.apply(null,args)
}}if(!keepCallback){delete cordova.callbacks[callbackId]}}},addConstructor:function(func){channel.onCordovaReady.subscribe(function(){try{func()}catch(e){console.log("Failed to run constructor: "+e)}})}};channel.onPause=cordova.addDocumentEventHandler("pause");channel.onResume=cordova.addDocumentEventHandler("resume");channel.onDeviceReady=cordova.addStickyDocumentEventHandler("deviceready");module.exports=cordova});define("cordova/argscheck",function(require,exports,module){var exec=require("cordova/exec");var utils=require("cordova/utils");var moduleExports=module.exports;var typeMap={"A":"Array","D":"Date","N":"Number","S":"String","F":"Function","O":"Object"};function extractParamName(callee,argIndex){return(/.*?\((.*?)\)/).exec(callee)[1].split(", ")[argIndex]}function checkArgs(spec,functionName,args,opt_callee){if(!moduleExports.enableChecks){return}var errMsg=null;var typeName;for(var i=0;i<spec.length;++i){var c=spec.charAt(i),cUpper=c.toUpperCase(),arg=args[i];if(c=="*"){continue}typeName=utils.typeName(arg);if((arg===null||arg===undefined)&&c==cUpper){continue}if(typeName!=typeMap[cUpper]){errMsg="Expected "+typeMap[cUpper];break}}if(errMsg){errMsg+=", but got "+typeName+".";errMsg='Wrong type for parameter "'+extractParamName(opt_callee||args.callee,i)+'" of '+functionName+": "+errMsg;if(typeof jasmine=="undefined"){console.error(errMsg)}throw TypeError(errMsg)}}function getValue(value,defaultValue){return value===undefined?defaultValue:value}moduleExports.checkArgs=checkArgs;moduleExports.getValue=getValue;moduleExports.enableChecks=true});define("cordova/builder",function(require,exports,module){var utils=require("cordova/utils");function each(objects,func,context){for(var prop in objects){if(objects.hasOwnProperty(prop)){func.apply(context,[objects[prop],prop])}}}function clobber(obj,key,value){exports.replaceHookForTesting(obj,key);obj[key]=value;if(obj[key]!==value){utils.defineGetter(obj,key,function(){return value})}}function assignOrWrapInDeprecateGetter(obj,key,value,message){if(message){utils.defineGetter(obj,key,function(){console.log(message);delete obj[key];clobber(obj,key,value);return value})}else{clobber(obj,key,value)}}function include(parent,objects,clobber,merge){each(objects,function(obj,key){try{var result=obj.path?require(obj.path):{};if(clobber){if(typeof parent[key]==="undefined"){assignOrWrapInDeprecateGetter(parent,key,result,obj.deprecated)}else{if(typeof obj.path!=="undefined"){if(merge){recursiveMerge(parent[key],result)}else{assignOrWrapInDeprecateGetter(parent,key,result,obj.deprecated)}}}result=parent[key]}else{if(typeof parent[key]=="undefined"){assignOrWrapInDeprecateGetter(parent,key,result,obj.deprecated)}else{result=parent[key]}}if(obj.children){include(result,obj.children,clobber,merge)}}catch(e){utils.alert("Exception building cordova JS globals: "+e+' for key "'+key+'"')}})}function recursiveMerge(target,src){for(var prop in src){if(src.hasOwnProperty(prop)){if(target.prototype&&target.prototype.constructor===target){clobber(target.prototype,prop,src[prop])}else{if(typeof src[prop]==="object"&&typeof target[prop]==="object"){recursiveMerge(target[prop],src[prop])}else{clobber(target,prop,src[prop])}}}}}exports.buildIntoButDoNotClobber=function(objects,target){include(target,objects,false,false)};exports.buildIntoAndClobber=function(objects,target){include(target,objects,true,false)};exports.buildIntoAndMerge=function(objects,target){include(target,objects,true,true)};exports.recursiveMerge=recursiveMerge;exports.assignOrWrapInDeprecateGetter=assignOrWrapInDeprecateGetter;exports.replaceHookForTesting=function(){}});define("cordova/channel",function(require,exports,module){var utils=require("cordova/utils"),nextGuid=1;var Channel=function(type,sticky){this.type=type;this.handlers={};this.state=sticky?1:0;this.fireArgs=null;this.numHandlers=0;this.onHasSubscribersChange=null},channel={join:function(h,c){var len=c.length,i=len,f=function(){if(!(--i)){h()}};for(var j=0;j<len;j++){if(c[j].state===0){throw Error("Can only use join with sticky channels.")}c[j].subscribe(f)}if(!len){h()}},create:function(type){return channel[type]=new Channel(type,false)},createSticky:function(type){return channel[type]=new Channel(type,true)},deviceReadyChannelsArray:[],deviceReadyChannelsMap:{},waitForInitialization:function(feature){if(feature){var c=channel[feature]||this.createSticky(feature);this.deviceReadyChannelsMap[feature]=c;this.deviceReadyChannelsArray.push(c)}},initializationComplete:function(feature){var c=this.deviceReadyChannelsMap[feature];if(c){c.fire()}}};function forceFunction(f){if(typeof f!="function"){throw"Function required as first argument!"}}Channel.prototype.subscribe=function(f,c){forceFunction(f);if(this.state==2){f.apply(c||this,this.fireArgs);return}var func=f,guid=f.observer_guid;if(typeof c=="object"){func=utils.close(c,f)}if(!guid){guid=""+nextGuid++}func.observer_guid=guid;f.observer_guid=guid;if(!this.handlers[guid]){this.handlers[guid]=func;this.numHandlers++;
if(this.numHandlers==1){this.onHasSubscribersChange&&this.onHasSubscribersChange()}}};Channel.prototype.unsubscribe=function(f){forceFunction(f);var guid=f.observer_guid,handler=this.handlers[guid];if(handler){delete this.handlers[guid];this.numHandlers--;if(this.numHandlers===0){this.onHasSubscribersChange&&this.onHasSubscribersChange()}}};Channel.prototype.fire=function(e){var fail=false,fireArgs=Array.prototype.slice.call(arguments);if(this.state==1){this.state=2;this.fireArgs=fireArgs}if(this.numHandlers){var toCall=[];for(var item in this.handlers){toCall.push(this.handlers[item])}for(var i=0;i<toCall.length;++i){toCall[i].apply(this,fireArgs)}if(this.state==2&&this.numHandlers){this.numHandlers=0;this.handlers={};this.onHasSubscribersChange&&this.onHasSubscribersChange()}}};channel.createSticky("onDOMContentLoaded");channel.createSticky("onNativeReady");channel.createSticky("onCordovaReady");channel.createSticky("onCordovaInfoReady");channel.createSticky("onCordovaConnectionReady");channel.createSticky("onPluginsReady");channel.createSticky("onDeviceReady");channel.create("onResume");channel.create("onPause");channel.createSticky("onDestroy");channel.waitForInitialization("onCordovaReady");channel.waitForInitialization("onCordovaConnectionReady");module.exports=channel});define("cordova/commandProxy",function(require,exports,module){var CommandProxyMap={};module.exports={add:function(id,proxyObj){console.log("adding proxy for "+id);CommandProxyMap[id]=proxyObj;return proxyObj},remove:function(id){var proxy=CommandProxyMap[id];delete CommandProxyMap[id];CommandProxyMap[id]=null;return proxy},get:function(service,action){return(CommandProxyMap[service]?CommandProxyMap[service][action]:null)}}});define("cordova/exec",function(require,exports,module){var cordova=require("cordova"),nativeApiProvider=require("cordova/plugin/android/nativeapiprovider"),utils=require("cordova/utils"),jsToNativeModes={PROMPT:0,JS_OBJECT:1,LOCATION_CHANGE:2},nativeToJsModes={POLLING:0,LOAD_URL:1,ONLINE_EVENT:2,PRIVATE_API:3},jsToNativeBridgeMode,nativeToJsBridgeMode=nativeToJsModes.ONLINE_EVENT,pollEnabled=false,messagesFromNative=[];function androidExec(success,fail,service,action,args){if(jsToNativeBridgeMode===undefined){androidExec.setJsToNativeBridgeMode(jsToNativeModes.JS_OBJECT)}for(var i=0;i<args.length;i++){if(utils.typeName(args[i])=="ArrayBuffer"){args[i]=window.btoa(String.fromCharCode.apply(null,new Uint8Array(args[i])))}}var callbackId=service+cordova.callbackId++,argsJson=JSON.stringify(args),returnValue;function captureReturnValue(value){returnValue=value;success&&success(value)}cordova.callbacks[callbackId]={success:captureReturnValue,fail:fail};if(jsToNativeBridgeMode==jsToNativeModes.LOCATION_CHANGE){window.location="http://cdv_exec/"+service+"#"+action+"#"+callbackId+"#"+argsJson}else{var messages=nativeApiProvider.get().exec(service,action,callbackId,argsJson);androidExec.processMessages(messages)}if(cordova.callbacks[callbackId]){if(success||fail){cordova.callbacks[callbackId].success=success}else{delete cordova.callbacks[callbackId]}}return returnValue}function pollOnce(){var msg=nativeApiProvider.get().retrieveJsMessages();androidExec.processMessages(msg)}function pollingTimerFunc(){if(pollEnabled){pollOnce();setTimeout(pollingTimerFunc,50)}}function hookOnlineApis(){function proxyEvent(e){cordova.fireWindowEvent(e.type)}window.addEventListener("online",pollOnce,false);window.addEventListener("offline",pollOnce,false);cordova.addWindowEventHandler("online");cordova.addWindowEventHandler("offline");document.addEventListener("online",proxyEvent,false);document.addEventListener("offline",proxyEvent,false)}hookOnlineApis();androidExec.jsToNativeModes=jsToNativeModes;androidExec.nativeToJsModes=nativeToJsModes;androidExec.setJsToNativeBridgeMode=function(mode){if(mode==jsToNativeModes.JS_OBJECT&&!window._cordovaNative){console.log("Falling back on PROMPT mode since _cordovaNative is missing. Expected for Android 3.2 and lower only.");mode=jsToNativeModes.PROMPT}nativeApiProvider.setPreferPrompt(mode==jsToNativeModes.PROMPT);jsToNativeBridgeMode=mode};androidExec.setNativeToJsBridgeMode=function(mode){if(mode==nativeToJsBridgeMode){return}if(nativeToJsBridgeMode==nativeToJsModes.POLLING){pollEnabled=false}nativeToJsBridgeMode=mode;nativeApiProvider.get().setNativeToJsBridgeMode(mode);if(mode==nativeToJsModes.POLLING){pollEnabled=true;setTimeout(pollingTimerFunc,1)}};function processMessage(message){try{var firstChar=message.charAt(0);if(firstChar=="J"){eval(message.slice(1))}else{if(firstChar=="S"||firstChar=="F"){var success=firstChar=="S";var keepCallback=message.charAt(1)=="1";var spaceIdx=message.indexOf(" ",2);var status=+message.slice(2,spaceIdx);var nextSpaceIdx=message.indexOf(" ",spaceIdx+1);var callbackId=message.slice(spaceIdx+1,nextSpaceIdx);var payloadKind=message.charAt(nextSpaceIdx+1);var payload;if(payloadKind=="s"){payload=message.slice(nextSpaceIdx+2)}else{if(payloadKind=="t"){payload=true}else{if(payloadKind=="f"){payload=false
}else{if(payloadKind=="N"){payload=null}else{if(payloadKind=="n"){payload=+message.slice(nextSpaceIdx+2)}else{if(payloadKind=="A"){var data=message.slice(nextSpaceIdx+2);var bytes=window.atob(data);var arraybuffer=new Uint8Array(bytes.length);for(var i=0;i<bytes.length;i++){arraybuffer[i]=bytes.charCodeAt(i)}payload=arraybuffer.buffer}else{if(payloadKind=="S"){payload=window.atob(message.slice(nextSpaceIdx+2))}else{payload=JSON.parse(message.slice(nextSpaceIdx+1))}}}}}}}cordova.callbackFromNative(callbackId,success,status,[payload],keepCallback)}else{console.log("processMessage failed: invalid message:"+message)}}}catch(e){console.log("processMessage failed: Message: "+message);console.log("processMessage failed: Error: "+e);console.log("processMessage failed: Stack: "+e.stack)}}androidExec.processMessages=function(messages){if(messages){messagesFromNative.push(messages);while(messagesFromNative.length){messages=messagesFromNative.shift();if(messages=="*"){window.setTimeout(pollOnce,0);continue}var spaceIdx=messages.indexOf(" ");var msgLen=+messages.slice(0,spaceIdx);var message=messages.substr(spaceIdx+1,msgLen);messages=messages.slice(spaceIdx+msgLen+1);if(messages){messagesFromNative.unshift(messages)}if(message){processMessage(message)}}}};module.exports=androidExec});define("cordova/modulemapper",function(require,exports,module){var builder=require("cordova/builder"),moduleMap=define.moduleMap,symbolList,deprecationMap;exports.reset=function(){symbolList=[];deprecationMap={}};function addEntry(strategy,moduleName,symbolPath,opt_deprecationMessage){if(!(moduleName in moduleMap)){throw new Error("Module "+moduleName+" does not exist.")}symbolList.push(strategy,moduleName,symbolPath);if(opt_deprecationMessage){deprecationMap[symbolPath]=opt_deprecationMessage}}exports.clobbers=function(moduleName,symbolPath,opt_deprecationMessage){addEntry("c",moduleName,symbolPath,opt_deprecationMessage)};exports.merges=function(moduleName,symbolPath,opt_deprecationMessage){addEntry("m",moduleName,symbolPath,opt_deprecationMessage)};exports.defaults=function(moduleName,symbolPath,opt_deprecationMessage){addEntry("d",moduleName,symbolPath,opt_deprecationMessage)};function prepareNamespace(symbolPath,context){if(!symbolPath){return context}var parts=symbolPath.split(".");var cur=context;for(var i=0,part;part=parts[i];++i){cur=cur[part]=cur[part]||{}}return cur}exports.mapModules=function(context){var origSymbols={};context.CDV_origSymbols=origSymbols;for(var i=0,len=symbolList.length;i<len;i+=3){var strategy=symbolList[i];var moduleName=symbolList[i+1];var symbolPath=symbolList[i+2];var lastDot=symbolPath.lastIndexOf(".");var namespace=symbolPath.substr(0,lastDot);var lastName=symbolPath.substr(lastDot+1);var module=require(moduleName);var deprecationMsg=symbolPath in deprecationMap?"Access made to deprecated symbol: "+symbolPath+". "+deprecationMsg:null;var parentObj=prepareNamespace(namespace,context);var target=parentObj[lastName];if(strategy=="m"&&target){builder.recursiveMerge(target,module)}else{if((strategy=="d"&&!target)||(strategy!="d")){if(!(symbolPath in origSymbols)){origSymbols[symbolPath]=target}builder.assignOrWrapInDeprecateGetter(parentObj,lastName,module,deprecationMsg)}}}};exports.getOriginalSymbol=function(context,symbolPath){var origSymbols=context.CDV_origSymbols;if(origSymbols&&(symbolPath in origSymbols)){return origSymbols[symbolPath]}var parts=symbolPath.split(".");var obj=context;for(var i=0;i<parts.length;++i){obj=obj&&obj[parts[i]]}return obj};exports.loadMatchingModules=function(matchingRegExp){for(var k in moduleMap){if(matchingRegExp.exec(k)){require(k)}}};exports.reset()});define("cordova/platform",function(require,exports,module){module.exports={id:"android",initialize:function(){var channel=require("cordova/channel"),cordova=require("cordova"),exec=require("cordova/exec"),modulemapper=require("cordova/modulemapper");modulemapper.loadMatchingModules(/cordova.*\/symbols$/);modulemapper.clobbers("cordova/plugin/android/app","navigator.app");modulemapper.mapModules(window);var backButtonChannel=cordova.addDocumentEventHandler("backbutton");backButtonChannel.onHasSubscribersChange=function(){exec(null,null,"App","overrideBackbutton",[this.numHandlers==1])};cordova.addDocumentEventHandler("menubutton");cordova.addDocumentEventHandler("searchbutton");channel.join(function(){exec(null,null,"App","show",[])},[channel.onCordovaReady])}}});define("cordova/plugin/Acceleration",function(require,exports,module){var Acceleration=function(x,y,z,timestamp){this.x=x;this.y=y;this.z=z;this.timestamp=timestamp||(new Date()).getTime()};module.exports=Acceleration});define("cordova/plugin/Camera",function(require,exports,module){var argscheck=require("cordova/argscheck"),exec=require("cordova/exec"),Camera=require("cordova/plugin/CameraConstants"),CameraPopoverHandle=require("cordova/plugin/CameraPopoverHandle");var cameraExport={};for(var key in Camera){cameraExport[key]=Camera[key]}cameraExport.getPicture=function(successCallback,errorCallback,options){argscheck.checkArgs("fFO","Camera.getPicture",arguments);
options=options||{};var getValue=argscheck.getValue;var quality=getValue(options.quality,50);var destinationType=getValue(options.destinationType,Camera.DestinationType.FILE_URI);var sourceType=getValue(options.sourceType,Camera.PictureSourceType.CAMERA);var targetWidth=getValue(options.targetWidth,-1);var targetHeight=getValue(options.targetHeight,-1);var encodingType=getValue(options.encodingType,Camera.EncodingType.JPEG);var mediaType=getValue(options.mediaType,Camera.MediaType.PICTURE);var allowEdit=!!options.allowEdit;var correctOrientation=!!options.correctOrientation;var saveToPhotoAlbum=!!options.saveToPhotoAlbum;var popoverOptions=getValue(options.popoverOptions,null);var cameraDirection=getValue(options.cameraDirection,Camera.Direction.BACK);var args=[quality,destinationType,sourceType,targetWidth,targetHeight,encodingType,mediaType,allowEdit,correctOrientation,saveToPhotoAlbum,popoverOptions,cameraDirection];exec(successCallback,errorCallback,"Camera","takePicture",args);return new CameraPopoverHandle()};cameraExport.cleanup=function(successCallback,errorCallback){exec(successCallback,errorCallback,"Camera","cleanup",[])};module.exports=cameraExport});define("cordova/plugin/CameraConstants",function(require,exports,module){module.exports={DestinationType:{DATA_URL:0,FILE_URI:1,NATIVE_URI:2},EncodingType:{JPEG:0,PNG:1},MediaType:{PICTURE:0,VIDEO:1,ALLMEDIA:2},PictureSourceType:{PHOTOLIBRARY:0,CAMERA:1,SAVEDPHOTOALBUM:2},PopoverArrowDirection:{ARROW_UP:1,ARROW_DOWN:2,ARROW_LEFT:4,ARROW_RIGHT:8,ARROW_ANY:15},Direction:{BACK:0,FRONT:1}}});define("cordova/plugin/CameraPopoverHandle",function(require,exports,module){var exec=require("cordova/exec");var CameraPopoverHandle=function(){this.setPosition=function(popoverOptions){console.log("CameraPopoverHandle.setPosition is only supported on iOS.")}};module.exports=CameraPopoverHandle});define("cordova/plugin/CameraPopoverOptions",function(require,exports,module){var Camera=require("cordova/plugin/CameraConstants");var CameraPopoverOptions=function(x,y,width,height,arrowDir){this.x=x||0;this.y=y||32;this.width=width||320;this.height=height||480;this.arrowDir=arrowDir||Camera.PopoverArrowDirection.ARROW_ANY};module.exports=CameraPopoverOptions});define("cordova/plugin/CaptureAudioOptions",function(require,exports,module){var CaptureAudioOptions=function(){this.limit=1;this.duration=0;this.mode=null};module.exports=CaptureAudioOptions});define("cordova/plugin/CaptureError",function(require,exports,module){var CaptureError=function(c){this.code=c||null};CaptureError.CAPTURE_INTERNAL_ERR=0;CaptureError.CAPTURE_APPLICATION_BUSY=1;CaptureError.CAPTURE_INVALID_ARGUMENT=2;CaptureError.CAPTURE_NO_MEDIA_FILES=3;CaptureError.CAPTURE_NOT_SUPPORTED=20;module.exports=CaptureError});define("cordova/plugin/CaptureImageOptions",function(require,exports,module){var CaptureImageOptions=function(){this.limit=1;this.mode=null};module.exports=CaptureImageOptions});define("cordova/plugin/CaptureVideoOptions",function(require,exports,module){var CaptureVideoOptions=function(){this.limit=1;this.duration=0;this.mode=null};module.exports=CaptureVideoOptions});define("cordova/plugin/CompassError",function(require,exports,module){var CompassError=function(err){this.code=(err!==undefined?err:null)};CompassError.COMPASS_INTERNAL_ERR=0;CompassError.COMPASS_NOT_SUPPORTED=20;module.exports=CompassError});define("cordova/plugin/CompassHeading",function(require,exports,module){var CompassHeading=function(magneticHeading,trueHeading,headingAccuracy,timestamp){this.magneticHeading=magneticHeading;this.trueHeading=trueHeading;this.headingAccuracy=headingAccuracy;this.timestamp=timestamp||new Date().getTime()};module.exports=CompassHeading});define("cordova/plugin/ConfigurationData",function(require,exports,module){function ConfigurationData(){this.type=null;this.height=0;this.width=0}module.exports=ConfigurationData});define("cordova/plugin/Connection",function(require,exports,module){module.exports={UNKNOWN:"unknown",ETHERNET:"ethernet",WIFI:"wifi",CELL_2G:"2g",CELL_3G:"3g",CELL_4G:"4g",CELL:"cellular",NONE:"none"}});define("cordova/plugin/Contact",function(require,exports,module){var argscheck=require("cordova/argscheck"),exec=require("cordova/exec"),ContactError=require("cordova/plugin/ContactError"),utils=require("cordova/utils");function convertIn(contact){var value=contact.birthday;try{contact.birthday=new Date(parseFloat(value))}catch(exception){console.log("Cordova Contact convertIn error: exception creating date.")}return contact}function convertOut(contact){var value=contact.birthday;if(value!==null){if(!utils.isDate(value)){try{value=new Date(value)}catch(exception){value=null}}if(utils.isDate(value)){value=value.valueOf()}contact.birthday=value}return contact}var Contact=function(id,displayName,name,nickname,phoneNumbers,emails,addresses,ims,organizations,birthday,note,photos,categories,urls){this.id=id||null;this.rawId=null;this.displayName=displayName||null;this.name=name||null;this.nickname=nickname||null;
this.phoneNumbers=phoneNumbers||null;this.emails=emails||null;this.addresses=addresses||null;this.ims=ims||null;this.organizations=organizations||null;this.birthday=birthday||null;this.note=note||null;this.photos=photos||null;this.categories=categories||null;this.urls=urls||null};Contact.prototype.remove=function(successCB,errorCB){argscheck.checkArgs("FF","Contact.remove",arguments);var fail=errorCB&&function(code){errorCB(new ContactError(code))};if(this.id===null){fail(ContactError.UNKNOWN_ERROR)}else{exec(successCB,fail,"Contacts","remove",[this.id])}};Contact.prototype.clone=function(){var clonedContact=utils.clone(this);clonedContact.id=null;clonedContact.rawId=null;function nullIds(arr){if(arr){for(var i=0;i<arr.length;++i){arr[i].id=null}}}nullIds(clonedContact.phoneNumbers);nullIds(clonedContact.emails);nullIds(clonedContact.addresses);nullIds(clonedContact.ims);nullIds(clonedContact.organizations);nullIds(clonedContact.categories);nullIds(clonedContact.photos);nullIds(clonedContact.urls);return clonedContact};Contact.prototype.save=function(successCB,errorCB){argscheck.checkArgs("FFO","Contact.save",arguments);var fail=errorCB&&function(code){errorCB(new ContactError(code))};var success=function(result){if(result){if(successCB){var fullContact=require("cordova/plugin/contacts").create(result);successCB(convertIn(fullContact))}}else{fail(ContactError.UNKNOWN_ERROR)}};var dupContact=convertOut(utils.clone(this));exec(success,fail,"Contacts","save",[dupContact])};module.exports=Contact});define("cordova/plugin/ContactAddress",function(require,exports,module){var ContactAddress=function(pref,type,formatted,streetAddress,locality,region,postalCode,country){this.id=null;this.pref=(typeof pref!="undefined"?pref:false);this.type=type||null;this.formatted=formatted||null;this.streetAddress=streetAddress||null;this.locality=locality||null;this.region=region||null;this.postalCode=postalCode||null;this.country=country||null};module.exports=ContactAddress});define("cordova/plugin/ContactError",function(require,exports,module){var ContactError=function(err){this.code=(typeof err!="undefined"?err:null)};ContactError.UNKNOWN_ERROR=0;ContactError.INVALID_ARGUMENT_ERROR=1;ContactError.TIMEOUT_ERROR=2;ContactError.PENDING_OPERATION_ERROR=3;ContactError.IO_ERROR=4;ContactError.NOT_SUPPORTED_ERROR=5;ContactError.PERMISSION_DENIED_ERROR=20;module.exports=ContactError});define("cordova/plugin/ContactField",function(require,exports,module){var ContactField=function(type,value,pref){this.id=null;this.type=(type&&type.toString())||null;this.value=(value&&value.toString())||null;this.pref=(typeof pref!="undefined"?pref:false)};module.exports=ContactField});define("cordova/plugin/ContactFindOptions",function(require,exports,module){var ContactFindOptions=function(filter,multiple){this.filter=filter||"";this.multiple=(typeof multiple!="undefined"?multiple:false)};module.exports=ContactFindOptions});define("cordova/plugin/ContactName",function(require,exports,module){var ContactName=function(formatted,familyName,givenName,middle,prefix,suffix){this.formatted=formatted||null;this.familyName=familyName||null;this.givenName=givenName||null;this.middleName=middle||null;this.honorificPrefix=prefix||null;this.honorificSuffix=suffix||null};module.exports=ContactName});define("cordova/plugin/ContactOrganization",function(require,exports,module){var ContactOrganization=function(pref,type,name,dept,title){this.id=null;this.pref=(typeof pref!="undefined"?pref:false);this.type=type||null;this.name=name||null;this.department=dept||null;this.title=title||null};module.exports=ContactOrganization});define("cordova/plugin/Coordinates",function(require,exports,module){var Coordinates=function(lat,lng,alt,acc,head,vel,altacc){this.latitude=lat;this.longitude=lng;this.accuracy=acc;this.altitude=(alt!==undefined?alt:null);this.heading=(head!==undefined?head:null);this.speed=(vel!==undefined?vel:null);if(this.speed===0||this.speed===null){this.heading=NaN}this.altitudeAccuracy=(altacc!==undefined)?altacc:null};module.exports=Coordinates});define("cordova/plugin/DirectoryEntry",function(require,exports,module){var argscheck=require("cordova/argscheck"),utils=require("cordova/utils"),exec=require("cordova/exec"),Entry=require("cordova/plugin/Entry"),FileError=require("cordova/plugin/FileError"),DirectoryReader=require("cordova/plugin/DirectoryReader");var DirectoryEntry=function(name,fullPath){DirectoryEntry.__super__.constructor.call(this,false,true,name,fullPath)};utils.extend(DirectoryEntry,Entry);DirectoryEntry.prototype.createReader=function(){return new DirectoryReader(this.fullPath)};DirectoryEntry.prototype.getDirectory=function(path,options,successCallback,errorCallback){argscheck.checkArgs("sOFF","DirectoryEntry.getDirectory",arguments);var win=successCallback&&function(result){var entry=new DirectoryEntry(result.name,result.fullPath);successCallback(entry)};var fail=errorCallback&&function(code){errorCallback(new FileError(code))};exec(win,fail,"File","getDirectory",[this.fullPath,path,options])
};DirectoryEntry.prototype.removeRecursively=function(successCallback,errorCallback){argscheck.checkArgs("FF","DirectoryEntry.removeRecursively",arguments);var fail=errorCallback&&function(code){errorCallback(new FileError(code))};exec(successCallback,fail,"File","removeRecursively",[this.fullPath])};DirectoryEntry.prototype.getFile=function(path,options,successCallback,errorCallback){argscheck.checkArgs("sOFF","DirectoryEntry.getFile",arguments);var win=successCallback&&function(result){var FileEntry=require("cordova/plugin/FileEntry");var entry=new FileEntry(result.name,result.fullPath);successCallback(entry)};var fail=errorCallback&&function(code){errorCallback(new FileError(code))};exec(win,fail,"File","getFile",[this.fullPath,path,options])};module.exports=DirectoryEntry});define("cordova/plugin/DirectoryReader",function(require,exports,module){var exec=require("cordova/exec"),FileError=require("cordova/plugin/FileError");function DirectoryReader(path){this.path=path||null}DirectoryReader.prototype.readEntries=function(successCallback,errorCallback){var win=typeof successCallback!=="function"?null:function(result){var retVal=[];for(var i=0;i<result.length;i++){var entry=null;if(result[i].isDirectory){entry=new (require("cordova/plugin/DirectoryEntry"))()}else{if(result[i].isFile){entry=new (require("cordova/plugin/FileEntry"))()}}entry.isDirectory=result[i].isDirectory;entry.isFile=result[i].isFile;entry.name=result[i].name;entry.fullPath=result[i].fullPath;retVal.push(entry)}successCallback(retVal)};var fail=typeof errorCallback!=="function"?null:function(code){errorCallback(new FileError(code))};exec(win,fail,"File","readEntries",[this.path])};module.exports=DirectoryReader});define("cordova/plugin/Entry",function(require,exports,module){var argscheck=require("cordova/argscheck"),exec=require("cordova/exec"),FileError=require("cordova/plugin/FileError"),Metadata=require("cordova/plugin/Metadata");function Entry(isFile,isDirectory,name,fullPath,fileSystem){this.isFile=!!isFile;this.isDirectory=!!isDirectory;this.name=name||"";this.fullPath=fullPath||"";this.filesystem=fileSystem||null}Entry.prototype.getMetadata=function(successCallback,errorCallback){argscheck.checkArgs("FF","Entry.getMetadata",arguments);var success=successCallback&&function(lastModified){var metadata=new Metadata(lastModified);successCallback(metadata)};var fail=errorCallback&&function(code){errorCallback(new FileError(code))};exec(success,fail,"File","getMetadata",[this.fullPath])};Entry.prototype.setMetadata=function(successCallback,errorCallback,metadataObject){argscheck.checkArgs("FFO","Entry.setMetadata",arguments);exec(successCallback,errorCallback,"File","setMetadata",[this.fullPath,metadataObject])};Entry.prototype.moveTo=function(parent,newName,successCallback,errorCallback){argscheck.checkArgs("oSFF","Entry.moveTo",arguments);var fail=errorCallback&&function(code){errorCallback(new FileError(code))};var srcPath=this.fullPath,name=newName||this.name,success=function(entry){if(entry){if(successCallback){var result=(entry.isDirectory)?new (require("cordova/plugin/DirectoryEntry"))(entry.name,entry.fullPath):new (require("cordova/plugin/FileEntry"))(entry.name,entry.fullPath);successCallback(result)}}else{fail&&fail(FileError.NOT_FOUND_ERR)}};exec(success,fail,"File","moveTo",[srcPath,parent.fullPath,name])};Entry.prototype.copyTo=function(parent,newName,successCallback,errorCallback){argscheck.checkArgs("oSFF","Entry.copyTo",arguments);var fail=errorCallback&&function(code){errorCallback(new FileError(code))};var srcPath=this.fullPath,name=newName||this.name,success=function(entry){if(entry){if(successCallback){var result=(entry.isDirectory)?new (require("cordova/plugin/DirectoryEntry"))(entry.name,entry.fullPath):new (require("cordova/plugin/FileEntry"))(entry.name,entry.fullPath);successCallback(result)}}else{fail&&fail(FileError.NOT_FOUND_ERR)}};exec(success,fail,"File","copyTo",[srcPath,parent.fullPath,name])};Entry.prototype.toURL=function(){return this.fullPath};Entry.prototype.toURI=function(mimeType){console.log("DEPRECATED: Update your code to use 'toURL'");return this.toURL()};Entry.prototype.remove=function(successCallback,errorCallback){argscheck.checkArgs("FF","Entry.remove",arguments);var fail=errorCallback&&function(code){errorCallback(new FileError(code))};exec(successCallback,fail,"File","remove",[this.fullPath])};Entry.prototype.getParent=function(successCallback,errorCallback){argscheck.checkArgs("FF","Entry.getParent",arguments);var win=successCallback&&function(result){var DirectoryEntry=require("cordova/plugin/DirectoryEntry");var entry=new DirectoryEntry(result.name,result.fullPath);successCallback(entry)};var fail=errorCallback&&function(code){errorCallback(new FileError(code))};exec(win,fail,"File","getParent",[this.fullPath])};module.exports=Entry});define("cordova/plugin/File",function(require,exports,module){var File=function(name,fullPath,type,lastModifiedDate,size){this.name=name||"";this.fullPath=fullPath||null;
this.type=type||null;this.lastModifiedDate=lastModifiedDate||null;this.size=size||0;this.start=0;this.end=this.size};File.prototype.slice=function(start,end){var size=this.end-this.start;var newStart=0;var newEnd=size;if(arguments.length){if(start<0){newStart=Math.max(size+start,0)}else{newStart=Math.min(size,start)}}if(arguments.length>=2){if(end<0){newEnd=Math.max(size+end,0)}else{newEnd=Math.min(end,size)}}var newFile=new File(this.name,this.fullPath,this.type,this.lastModifiedData,this.size);newFile.start=this.start+newStart;newFile.end=this.start+newEnd;return newFile};module.exports=File});define("cordova/plugin/FileEntry",function(require,exports,module){var utils=require("cordova/utils"),exec=require("cordova/exec"),Entry=require("cordova/plugin/Entry"),FileWriter=require("cordova/plugin/FileWriter"),File=require("cordova/plugin/File"),FileError=require("cordova/plugin/FileError");var FileEntry=function(name,fullPath){FileEntry.__super__.constructor.apply(this,[true,false,name,fullPath])};utils.extend(FileEntry,Entry);FileEntry.prototype.createWriter=function(successCallback,errorCallback){this.file(function(filePointer){var writer=new FileWriter(filePointer);if(writer.fileName===null||writer.fileName===""){errorCallback&&errorCallback(new FileError(FileError.INVALID_STATE_ERR))}else{successCallback&&successCallback(writer)}},errorCallback)};FileEntry.prototype.file=function(successCallback,errorCallback){var win=successCallback&&function(f){var file=new File(f.name,f.fullPath,f.type,f.lastModifiedDate,f.size);successCallback(file)};var fail=errorCallback&&function(code){errorCallback(new FileError(code))};exec(win,fail,"File","getFileMetadata",[this.fullPath])};module.exports=FileEntry});define("cordova/plugin/FileError",function(require,exports,module){function FileError(error){this.code=error||null}FileError.NOT_FOUND_ERR=1;FileError.SECURITY_ERR=2;FileError.ABORT_ERR=3;FileError.NOT_READABLE_ERR=4;FileError.ENCODING_ERR=5;FileError.NO_MODIFICATION_ALLOWED_ERR=6;FileError.INVALID_STATE_ERR=7;FileError.SYNTAX_ERR=8;FileError.INVALID_MODIFICATION_ERR=9;FileError.QUOTA_EXCEEDED_ERR=10;FileError.TYPE_MISMATCH_ERR=11;FileError.PATH_EXISTS_ERR=12;module.exports=FileError});define("cordova/plugin/FileReader",function(require,exports,module){var exec=require("cordova/exec"),modulemapper=require("cordova/modulemapper"),utils=require("cordova/utils"),File=require("cordova/plugin/File"),FileError=require("cordova/plugin/FileError"),ProgressEvent=require("cordova/plugin/ProgressEvent"),origFileReader=modulemapper.getOriginalSymbol(this,"FileReader");var FileReader=function(){this._readyState=0;this._error=null;this._result=null;this._fileName="";this._realReader=origFileReader?new origFileReader():{}};FileReader.EMPTY=0;FileReader.LOADING=1;FileReader.DONE=2;utils.defineGetter(FileReader.prototype,"readyState",function(){return this._fileName?this._readyState:this._realReader.readyState});utils.defineGetter(FileReader.prototype,"error",function(){return this._fileName?this._error:this._realReader.error});utils.defineGetter(FileReader.prototype,"result",function(){return this._fileName?this._result:this._realReader.result});function defineEvent(eventName){utils.defineGetterSetter(FileReader.prototype,eventName,function(){return this._realReader[eventName]||null},function(value){this._realReader[eventName]=value})}defineEvent("onloadstart");defineEvent("onprogress");defineEvent("onload");defineEvent("onerror");defineEvent("onloadend");defineEvent("onabort");function initRead(reader,file){if(reader.readyState==FileReader.LOADING){throw new FileError(FileError.INVALID_STATE_ERR)}reader._result=null;reader._error=null;reader._readyState=FileReader.LOADING;if(typeof file=="string"){console.warning("Using a string argument with FileReader.readAs functions is deprecated.");reader._fileName=file}else{if(typeof file.fullPath=="string"){reader._fileName=file.fullPath}else{reader._fileName="";return true}}reader.onloadstart&&reader.onloadstart(new ProgressEvent("loadstart",{target:reader}))}FileReader.prototype.abort=function(){if(origFileReader&&!this._fileName){return this._realReader.abort()}this._result=null;if(this._readyState==FileReader.DONE||this._readyState==FileReader.EMPTY){return}this._readyState=FileReader.DONE;if(typeof this.onabort==="function"){this.onabort(new ProgressEvent("abort",{target:this}))}if(typeof this.onloadend==="function"){this.onloadend(new ProgressEvent("loadend",{target:this}))}};FileReader.prototype.readAsText=function(file,encoding){if(initRead(this,file)){return this._realReader.readAsText(file,encoding)}var enc=encoding?encoding:"UTF-8";var me=this;var execArgs=[this._fileName,enc,file.start,file.end];exec(function(r){if(me._readyState===FileReader.DONE){return}me._result=r;if(typeof me.onload==="function"){me.onload(new ProgressEvent("load",{target:me}))}me._readyState=FileReader.DONE;if(typeof me.onloadend==="function"){me.onloadend(new ProgressEvent("loadend",{target:me}))}},function(e){if(me._readyState===FileReader.DONE){return
}me._readyState=FileReader.DONE;me._result=null;me._error=new FileError(e);if(typeof me.onerror==="function"){me.onerror(new ProgressEvent("error",{target:me}))}if(typeof me.onloadend==="function"){me.onloadend(new ProgressEvent("loadend",{target:me}))}},"File","readAsText",execArgs)};FileReader.prototype.readAsDataURL=function(file){if(initRead(this,file)){return this._realReader.readAsDataURL(file)}var me=this;var execArgs=[this._fileName,file.start,file.end];exec(function(r){if(me._readyState===FileReader.DONE){return}me._readyState=FileReader.DONE;me._result=r;if(typeof me.onload==="function"){me.onload(new ProgressEvent("load",{target:me}))}if(typeof me.onloadend==="function"){me.onloadend(new ProgressEvent("loadend",{target:me}))}},function(e){if(me._readyState===FileReader.DONE){return}me._readyState=FileReader.DONE;me._result=null;me._error=new FileError(e);if(typeof me.onerror==="function"){me.onerror(new ProgressEvent("error",{target:me}))}if(typeof me.onloadend==="function"){me.onloadend(new ProgressEvent("loadend",{target:me}))}},"File","readAsDataURL",execArgs)};FileReader.prototype.readAsBinaryString=function(file){if(initRead(this,file)){return this._realReader.readAsBinaryString(file)}var me=this;var execArgs=[this._fileName,file.start,file.end];exec(function(r){if(me._readyState===FileReader.DONE){return}me._readyState=FileReader.DONE;me._result=r;if(typeof me.onload==="function"){me.onload(new ProgressEvent("load",{target:me}))}if(typeof me.onloadend==="function"){me.onloadend(new ProgressEvent("loadend",{target:me}))}},function(e){if(me._readyState===FileReader.DONE){return}me._readyState=FileReader.DONE;me._result=null;me._error=new FileError(e);if(typeof me.onerror==="function"){me.onerror(new ProgressEvent("error",{target:me}))}if(typeof me.onloadend==="function"){me.onloadend(new ProgressEvent("loadend",{target:me}))}},"File","readAsBinaryString",execArgs)};FileReader.prototype.readAsArrayBuffer=function(file){if(initRead(this,file)){return this._realReader.readAsArrayBuffer(file)}var me=this;var execArgs=[this._fileName,file.start,file.end];exec(function(r){if(me._readyState===FileReader.DONE){return}me._readyState=FileReader.DONE;me._result=r;if(typeof me.onload==="function"){me.onload(new ProgressEvent("load",{target:me}))}if(typeof me.onloadend==="function"){me.onloadend(new ProgressEvent("loadend",{target:me}))}},function(e){if(me._readyState===FileReader.DONE){return}me._readyState=FileReader.DONE;me._result=null;me._error=new FileError(e);if(typeof me.onerror==="function"){me.onerror(new ProgressEvent("error",{target:me}))}if(typeof me.onloadend==="function"){me.onloadend(new ProgressEvent("loadend",{target:me}))}},"File","readAsArrayBuffer",execArgs)};module.exports=FileReader});define("cordova/plugin/FileSystem",function(require,exports,module){var DirectoryEntry=require("cordova/plugin/DirectoryEntry");var FileSystem=function(name,root){this.name=name||null;if(root){this.root=new DirectoryEntry(root.name,root.fullPath)}};module.exports=FileSystem});define("cordova/plugin/FileTransfer",function(require,exports,module){var argscheck=require("cordova/argscheck"),exec=require("cordova/exec"),FileTransferError=require("cordova/plugin/FileTransferError"),ProgressEvent=require("cordova/plugin/ProgressEvent");function newProgressEvent(result){var pe=new ProgressEvent();pe.lengthComputable=result.lengthComputable;pe.loaded=result.loaded;pe.total=result.total;return pe}function getBasicAuthHeader(urlString){var header=null;if(window.btoa){var url=document.createElement("a");url.href=urlString;var credentials=null;var protocol=url.protocol+"//";var origin=protocol+url.host;if(url.href.indexOf(origin)!=0){var atIndex=url.href.indexOf("@");credentials=url.href.substring(protocol.length,atIndex)}if(credentials){var authHeader="Authorization";var authHeaderValue="Basic "+window.btoa(credentials);header={name:authHeader,value:authHeaderValue}}}return header}var idCounter=0;var FileTransfer=function(){this._id=++idCounter;this.onprogress=null};FileTransfer.prototype.upload=function(filePath,server,successCallback,errorCallback,options,trustAllHosts){argscheck.checkArgs("ssFFO*","FileTransfer.upload",arguments);var fileKey=null;var fileName=null;var mimeType=null;var params=null;var chunkedMode=true;var headers=null;var basicAuthHeader=getBasicAuthHeader(server);if(basicAuthHeader){if(!options){options=new FileUploadOptions()}if(!options.headers){options.headers={}}options.headers[basicAuthHeader.name]=basicAuthHeader.value}if(options){fileKey=options.fileKey;fileName=options.fileName;mimeType=options.mimeType;headers=options.headers;if(options.chunkedMode!==null||typeof options.chunkedMode!="undefined"){chunkedMode=options.chunkedMode}if(options.params){params=options.params}else{params={}}}var fail=errorCallback&&function(e){var error=new FileTransferError(e.code,e.source,e.target,e.http_status,e.body);errorCallback(error)};var self=this;var win=function(result){if(typeof result.lengthComputable!="undefined"){if(self.onprogress){self.onprogress(newProgressEvent(result))
}}else{successCallback&&successCallback(result)}};exec(win,fail,"FileTransfer","upload",[filePath,server,fileKey,fileName,mimeType,params,trustAllHosts,chunkedMode,headers,this._id])};FileTransfer.prototype.download=function(source,target,successCallback,errorCallback,trustAllHosts,options){argscheck.checkArgs("ssFF*","FileTransfer.download",arguments);var self=this;var basicAuthHeader=getBasicAuthHeader(source);if(basicAuthHeader){if(!options){options={}}if(!options.headers){options.headers={}}options.headers[basicAuthHeader.name]=basicAuthHeader.value}var headers=null;if(options){headers=options.headers||null}var win=function(result){if(typeof result.lengthComputable!="undefined"){if(self.onprogress){return self.onprogress(newProgressEvent(result))}}else{if(successCallback){var entry=null;if(result.isDirectory){entry=new (require("cordova/plugin/DirectoryEntry"))()}else{if(result.isFile){entry=new (require("cordova/plugin/FileEntry"))()}}entry.isDirectory=result.isDirectory;entry.isFile=result.isFile;entry.name=result.name;entry.fullPath=result.fullPath;successCallback(entry)}}};var fail=errorCallback&&function(e){var error=new FileTransferError(e.code,e.source,e.target,e.http_status,e.body);errorCallback(error)};exec(win,fail,"FileTransfer","download",[source,target,trustAllHosts,this._id,headers])};FileTransfer.prototype.abort=function(successCallback,errorCallback){exec(successCallback,errorCallback,"FileTransfer","abort",[this._id])};module.exports=FileTransfer});define("cordova/plugin/FileTransferError",function(require,exports,module){var FileTransferError=function(code,source,target,status,body){this.code=code||null;this.source=source||null;this.target=target||null;this.http_status=status||null;this.body=body||null};FileTransferError.FILE_NOT_FOUND_ERR=1;FileTransferError.INVALID_URL_ERR=2;FileTransferError.CONNECTION_ERR=3;FileTransferError.ABORT_ERR=4;module.exports=FileTransferError});define("cordova/plugin/FileUploadOptions",function(require,exports,module){var FileUploadOptions=function(fileKey,fileName,mimeType,params,headers){this.fileKey=fileKey||null;this.fileName=fileName||null;this.mimeType=mimeType||null;this.params=params||null;this.headers=headers||null};module.exports=FileUploadOptions});define("cordova/plugin/FileUploadResult",function(require,exports,module){var FileUploadResult=function(){this.bytesSent=0;this.responseCode=null;this.response=null};module.exports=FileUploadResult});define("cordova/plugin/FileWriter",function(require,exports,module){var exec=require("cordova/exec"),FileError=require("cordova/plugin/FileError"),ProgressEvent=require("cordova/plugin/ProgressEvent");var FileWriter=function(file){this.fileName="";this.length=0;if(file){this.fileName=file.fullPath||file;this.length=file.size||0}this.position=0;this.readyState=0;this.result=null;this.error=null;this.onwritestart=null;this.onprogress=null;this.onwrite=null;this.onwriteend=null;this.onabort=null;this.onerror=null};FileWriter.INIT=0;FileWriter.WRITING=1;FileWriter.DONE=2;FileWriter.prototype.abort=function(){if(this.readyState===FileWriter.DONE||this.readyState===FileWriter.INIT){throw new FileError(FileError.INVALID_STATE_ERR)}this.error=new FileError(FileError.ABORT_ERR);this.readyState=FileWriter.DONE;if(typeof this.onabort==="function"){this.onabort(new ProgressEvent("abort",{"target":this}))}if(typeof this.onwriteend==="function"){this.onwriteend(new ProgressEvent("writeend",{"target":this}))}};FileWriter.prototype.write=function(text){if(this.readyState===FileWriter.WRITING){throw new FileError(FileError.INVALID_STATE_ERR)}this.readyState=FileWriter.WRITING;var me=this;if(typeof me.onwritestart==="function"){me.onwritestart(new ProgressEvent("writestart",{"target":me}))}exec(function(r){if(me.readyState===FileWriter.DONE){return}me.position+=r;me.length=me.position;me.readyState=FileWriter.DONE;if(typeof me.onwrite==="function"){me.onwrite(new ProgressEvent("write",{"target":me}))}if(typeof me.onwriteend==="function"){me.onwriteend(new ProgressEvent("writeend",{"target":me}))}},function(e){if(me.readyState===FileWriter.DONE){return}me.readyState=FileWriter.DONE;me.error=new FileError(e);if(typeof me.onerror==="function"){me.onerror(new ProgressEvent("error",{"target":me}))}if(typeof me.onwriteend==="function"){me.onwriteend(new ProgressEvent("writeend",{"target":me}))}},"File","write",[this.fileName,text,this.position])};FileWriter.prototype.seek=function(offset){if(this.readyState===FileWriter.WRITING){throw new FileError(FileError.INVALID_STATE_ERR)}if(!offset&&offset!==0){return}if(offset<0){this.position=Math.max(offset+this.length,0)}else{if(offset>this.length){this.position=this.length}else{this.position=offset}}};FileWriter.prototype.truncate=function(size){if(this.readyState===FileWriter.WRITING){throw new FileError(FileError.INVALID_STATE_ERR)}this.readyState=FileWriter.WRITING;var me=this;if(typeof me.onwritestart==="function"){me.onwritestart(new ProgressEvent("writestart",{"target":this}))}exec(function(r){if(me.readyState===FileWriter.DONE){return
}me.readyState=FileWriter.DONE;me.length=r;me.position=Math.min(me.position,r);if(typeof me.onwrite==="function"){me.onwrite(new ProgressEvent("write",{"target":me}))}if(typeof me.onwriteend==="function"){me.onwriteend(new ProgressEvent("writeend",{"target":me}))}},function(e){if(me.readyState===FileWriter.DONE){return}me.readyState=FileWriter.DONE;me.error=new FileError(e);if(typeof me.onerror==="function"){me.onerror(new ProgressEvent("error",{"target":me}))}if(typeof me.onwriteend==="function"){me.onwriteend(new ProgressEvent("writeend",{"target":me}))}},"File","truncate",[this.fileName,size])};module.exports=FileWriter});define("cordova/plugin/Flags",function(require,exports,module){function Flags(create,exclusive){this.create=create||false;this.exclusive=exclusive||false}module.exports=Flags});define("cordova/plugin/GlobalizationError",function(require,exports,module){var GlobalizationError=function(code,message){this.code=code||null;this.message=message||""};GlobalizationError.UNKNOWN_ERROR=0;GlobalizationError.FORMATTING_ERROR=1;GlobalizationError.PARSING_ERROR=2;GlobalizationError.PATTERN_ERROR=3;module.exports=GlobalizationError});define("cordova/plugin/InAppBrowser",function(require,exports,module){var exec=require("cordova/exec");var channel=require("cordova/channel");function InAppBrowser(){this.channels={"loadstart":channel.create("loadstart"),"loadstop":channel.create("loadstop"),"loaderror":channel.create("loaderror"),"exit":channel.create("exit")}}InAppBrowser.prototype={_eventHandler:function(event){if(event.type in this.channels){this.channels[event.type].fire(event)}},close:function(eventname){exec(null,null,"InAppBrowser","close",[])},addEventListener:function(eventname,f){if(eventname in this.channels){this.channels[eventname].subscribe(f)}},removeEventListener:function(eventname,f){if(eventname in this.channels){this.channels[eventname].unsubscribe(f)}}};module.exports=function(strUrl,strWindowName,strWindowFeatures){var iab=new InAppBrowser();var cb=function(eventname){iab._eventHandler(eventname)};exec(cb,cb,"InAppBrowser","open",[strUrl,strWindowName,strWindowFeatures]);return iab}});define("cordova/plugin/LocalFileSystem",function(require,exports,module){var exec=require("cordova/exec");var LocalFileSystem=function(){};LocalFileSystem.TEMPORARY=0;LocalFileSystem.PERSISTENT=1;module.exports=LocalFileSystem});define("cordova/plugin/Media",function(require,exports,module){var argscheck=require("cordova/argscheck"),utils=require("cordova/utils"),exec=require("cordova/exec");var mediaObjects={};var Media=function(src,successCallback,errorCallback,statusCallback){argscheck.checkArgs("SFFF","Media",arguments);this.id=utils.createUUID();mediaObjects[this.id]=this;this.src=src;this.successCallback=successCallback;this.errorCallback=errorCallback;this.statusCallback=statusCallback;this._duration=-1;this._position=-1;exec(null,this.errorCallback,"Media","create",[this.id,this.src])};Media.MEDIA_STATE=1;Media.MEDIA_DURATION=2;Media.MEDIA_POSITION=3;Media.MEDIA_ERROR=9;Media.MEDIA_NONE=0;Media.MEDIA_STARTING=1;Media.MEDIA_RUNNING=2;Media.MEDIA_PAUSED=3;Media.MEDIA_STOPPED=4;Media.MEDIA_MSG=["None","Starting","Running","Paused","Stopped"];Media.get=function(id){return mediaObjects[id]};Media.prototype.play=function(options){exec(null,null,"Media","startPlayingAudio",[this.id,this.src,options])};Media.prototype.stop=function(){var me=this;exec(function(){me._position=0},this.errorCallback,"Media","stopPlayingAudio",[this.id])};Media.prototype.seekTo=function(milliseconds){var me=this;exec(function(p){me._position=p},this.errorCallback,"Media","seekToAudio",[this.id,milliseconds])};Media.prototype.pause=function(){exec(null,this.errorCallback,"Media","pausePlayingAudio",[this.id])};Media.prototype.getDuration=function(){return this._duration};Media.prototype.getCurrentPosition=function(success,fail){var me=this;exec(function(p){me._position=p;success(p)},fail,"Media","getCurrentPositionAudio",[this.id])};Media.prototype.startRecord=function(){exec(null,this.errorCallback,"Media","startRecordingAudio",[this.id,this.src])};Media.prototype.stopRecord=function(){exec(null,this.errorCallback,"Media","stopRecordingAudio",[this.id])};Media.prototype.release=function(){exec(null,this.errorCallback,"Media","release",[this.id])};Media.prototype.setVolume=function(volume){exec(null,null,"Media","setVolume",[this.id,volume])};Media.onStatus=function(id,msgType,value){var media=mediaObjects[id];if(media){switch(msgType){case Media.MEDIA_STATE:media.statusCallback&&media.statusCallback(value);if(value==Media.MEDIA_STOPPED){media.successCallback&&media.successCallback()}break;case Media.MEDIA_DURATION:media._duration=value;break;case Media.MEDIA_ERROR:media.errorCallback&&media.errorCallback(value);break;case Media.MEDIA_POSITION:media._position=Number(value);break;default:console.error&&console.error("Unhandled Media.onStatus :: "+msgType);break}}else{console.error&&console.error("Received Media.onStatus callback for unknown media :: "+id)
}};module.exports=Media});define("cordova/plugin/MediaError",function(require,exports,module){var _MediaError=window.MediaError;if(!_MediaError){window.MediaError=_MediaError=function(code,msg){this.code=(typeof code!="undefined")?code:null;this.message=msg||""}}_MediaError.MEDIA_ERR_NONE_ACTIVE=_MediaError.MEDIA_ERR_NONE_ACTIVE||0;_MediaError.MEDIA_ERR_ABORTED=_MediaError.MEDIA_ERR_ABORTED||1;_MediaError.MEDIA_ERR_NETWORK=_MediaError.MEDIA_ERR_NETWORK||2;_MediaError.MEDIA_ERR_DECODE=_MediaError.MEDIA_ERR_DECODE||3;_MediaError.MEDIA_ERR_NONE_SUPPORTED=_MediaError.MEDIA_ERR_NONE_SUPPORTED||4;_MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED=_MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED||4;module.exports=_MediaError});define("cordova/plugin/MediaFile",function(require,exports,module){var utils=require("cordova/utils"),exec=require("cordova/exec"),File=require("cordova/plugin/File"),CaptureError=require("cordova/plugin/CaptureError");var MediaFile=function(name,fullPath,type,lastModifiedDate,size){MediaFile.__super__.constructor.apply(this,arguments)};utils.extend(MediaFile,File);MediaFile.prototype.getFormatData=function(successCallback,errorCallback){if(typeof this.fullPath==="undefined"||this.fullPath===null){errorCallback(new CaptureError(CaptureError.CAPTURE_INVALID_ARGUMENT))}else{exec(successCallback,errorCallback,"Capture","getFormatData",[this.fullPath,this.type])}};module.exports=MediaFile});define("cordova/plugin/MediaFileData",function(require,exports,module){var MediaFileData=function(codecs,bitrate,height,width,duration){this.codecs=codecs||null;this.bitrate=bitrate||0;this.height=height||0;this.width=width||0;this.duration=duration||0};module.exports=MediaFileData});define("cordova/plugin/Metadata",function(require,exports,module){var Metadata=function(time){this.modificationTime=(typeof time!="undefined"?new Date(time):null)};module.exports=Metadata});define("cordova/plugin/Position",function(require,exports,module){var Coordinates=require("cordova/plugin/Coordinates");var Position=function(coords,timestamp){if(coords){this.coords=new Coordinates(coords.latitude,coords.longitude,coords.altitude,coords.accuracy,coords.heading,coords.velocity,coords.altitudeAccuracy)}else{this.coords=new Coordinates()}this.timestamp=(timestamp!==undefined)?timestamp:new Date()};module.exports=Position});define("cordova/plugin/PositionError",function(require,exports,module){var PositionError=function(code,message){this.code=code||null;this.message=message||""};PositionError.PERMISSION_DENIED=1;PositionError.POSITION_UNAVAILABLE=2;PositionError.TIMEOUT=3;module.exports=PositionError});define("cordova/plugin/ProgressEvent",function(require,exports,module){var ProgressEvent=(function(){return function ProgressEvent(type,dict){this.type=type;this.bubbles=false;this.cancelBubble=false;this.cancelable=false;this.lengthComputable=false;this.loaded=dict&&dict.loaded?dict.loaded:0;this.total=dict&&dict.total?dict.total:0;this.target=dict&&dict.target?dict.target:null}})();module.exports=ProgressEvent});define("cordova/plugin/accelerometer",function(require,exports,module){var argscheck=require("cordova/argscheck"),utils=require("cordova/utils"),exec=require("cordova/exec"),Acceleration=require("cordova/plugin/Acceleration");var running=false;var timers={};var listeners=[];var accel=null;function start(){exec(function(a){var tempListeners=listeners.slice(0);accel=new Acceleration(a.x,a.y,a.z,a.timestamp);for(var i=0,l=tempListeners.length;i<l;i++){tempListeners[i].win(accel)}},function(e){var tempListeners=listeners.slice(0);for(var i=0,l=tempListeners.length;i<l;i++){tempListeners[i].fail(e)}},"Accelerometer","start",[]);running=true}function stop(){exec(null,null,"Accelerometer","stop",[]);running=false}function createCallbackPair(win,fail){return{win:win,fail:fail}}function removeListeners(l){var idx=listeners.indexOf(l);if(idx>-1){listeners.splice(idx,1);if(listeners.length===0){stop()}}}var accelerometer={getCurrentAcceleration:function(successCallback,errorCallback,options){argscheck.checkArgs("fFO","accelerometer.getCurrentAcceleration",arguments);var p;var win=function(a){removeListeners(p);successCallback(a)};var fail=function(e){removeListeners(p);errorCallback&&errorCallback(e)};p=createCallbackPair(win,fail);listeners.push(p);if(!running){start()}},watchAcceleration:function(successCallback,errorCallback,options){argscheck.checkArgs("fFO","accelerometer.watchAcceleration",arguments);var frequency=(options&&options.frequency&&typeof options.frequency=="number")?options.frequency:10000;var id=utils.createUUID();var p=createCallbackPair(function(){},function(e){removeListeners(p);errorCallback&&errorCallback(e)});listeners.push(p);timers[id]={timer:window.setInterval(function(){if(accel){successCallback(accel)}},frequency),listeners:p};if(running){if(accel){successCallback(accel)}}else{start()}return id},clearWatch:function(id){if(id&&timers[id]){window.clearInterval(timers[id].timer);removeListeners(timers[id].listeners);delete timers[id]
}}};module.exports=accelerometer});define("cordova/plugin/accelerometer/symbols",function(require,exports,module){var modulemapper=require("cordova/modulemapper");modulemapper.defaults("cordova/plugin/Acceleration","Acceleration");modulemapper.defaults("cordova/plugin/accelerometer","navigator.accelerometer")});define("cordova/plugin/android/app",function(require,exports,module){var exec=require("cordova/exec");module.exports={clearCache:function(){exec(null,null,"App","clearCache",[])},loadUrl:function(url,props){exec(null,null,"App","loadUrl",[url,props])},cancelLoadUrl:function(){exec(null,null,"App","cancelLoadUrl",[])},clearHistory:function(){exec(null,null,"App","clearHistory",[])},backHistory:function(){exec(null,null,"App","backHistory",[])},overrideBackbutton:function(override){exec(null,null,"App","overrideBackbutton",[override])},exitApp:function(){return exec(null,null,"App","exitApp",[])}}});define("cordova/plugin/android/device",function(require,exports,module){var channel=require("cordova/channel"),utils=require("cordova/utils"),exec=require("cordova/exec"),app=require("cordova/plugin/android/app");module.exports={overrideBackButton:function(){console.log("Device.overrideBackButton() is deprecated.  Use App.overrideBackbutton(true).");app.overrideBackbutton(true)},resetBackButton:function(){console.log("Device.resetBackButton() is deprecated.  Use App.overrideBackbutton(false).");app.overrideBackbutton(false)},exitApp:function(){console.log("Device.exitApp() is deprecated.  Use App.exitApp().");app.exitApp()}}});define("cordova/plugin/android/nativeapiprovider",function(require,exports,module){var nativeApi=this._cordovaNative||require("cordova/plugin/android/promptbasednativeapi");var currentApi=nativeApi;module.exports={get:function(){return currentApi},setPreferPrompt:function(value){currentApi=value?require("cordova/plugin/android/promptbasednativeapi"):nativeApi},set:function(value){currentApi=value}}});define("cordova/plugin/android/notification",function(require,exports,module){var exec=require("cordova/exec");module.exports={activityStart:function(title,message){if(typeof title==="undefined"&&typeof message=="undefined"){title="Busy";message="Please wait..."}exec(null,null,"Notification","activityStart",[title,message])},activityStop:function(){exec(null,null,"Notification","activityStop",[])},progressStart:function(title,message){exec(null,null,"Notification","progressStart",[title,message])},progressStop:function(){exec(null,null,"Notification","progressStop",[])},progressValue:function(value){exec(null,null,"Notification","progressValue",[value])}}});define("cordova/plugin/android/promptbasednativeapi",function(require,exports,module){module.exports={exec:function(service,action,callbackId,argsJson){return prompt(argsJson,"gap:"+JSON.stringify([service,action,callbackId]))},setNativeToJsBridgeMode:function(value){prompt(value,"gap_bridge_mode:")},retrieveJsMessages:function(){return prompt("","gap_poll:")}}});define("cordova/plugin/android/storage",function(require,exports,module){var utils=require("cordova/utils"),exec=require("cordova/exec"),channel=require("cordova/channel");var queryQueue={};var DroidDB_Rows=function(){this.resultSet=[];this.length=0};DroidDB_Rows.prototype.item=function(row){return this.resultSet[row]};var DroidDB_Result=function(){this.rows=new DroidDB_Rows()};function completeQuery(id,data){var query=queryQueue[id];if(query){try{delete queryQueue[id];var tx=query.tx;if(tx&&tx.queryList[id]){var r=new DroidDB_Result();r.rows.resultSet=data;r.rows.length=data.length;try{if(typeof query.successCallback==="function"){query.successCallback(query.tx,r)}}catch(ex){console.log("executeSql error calling user success callback: "+ex)}tx.queryComplete(id)}}catch(e){console.log("executeSql error: "+e)}}}function failQuery(reason,id){var query=queryQueue[id];if(query){try{delete queryQueue[id];var tx=query.tx;if(tx&&tx.queryList[id]){tx.queryList={};try{if(typeof query.errorCallback==="function"){query.errorCallback(query.tx,reason)}}catch(ex){console.log("executeSql error calling user error callback: "+ex)}tx.queryFailed(id,reason)}}catch(e){console.log("executeSql error: "+e)}}}var DroidDB_Query=function(tx){this.id=utils.createUUID();queryQueue[this.id]=this;this.resultSet=[];this.tx=tx;this.tx.queryList[this.id]=this;this.successCallback=null;this.errorCallback=null};var DroidDB_Tx=function(){this.id=utils.createUUID();this.successCallback=null;this.errorCallback=null;this.queryList={}};DroidDB_Tx.prototype.queryComplete=function(id){delete this.queryList[id];if(this.successCallback){var count=0;var i;for(i in this.queryList){if(this.queryList.hasOwnProperty(i)){count++}}if(count===0){try{this.successCallback()}catch(e){console.log("Transaction error calling user success callback: "+e)}}}};DroidDB_Tx.prototype.queryFailed=function(id,reason){this.queryList={};if(this.errorCallback){try{this.errorCallback(reason)}catch(e){console.log("Transaction error calling user error callback: "+e)
}}};DroidDB_Tx.prototype.executeSql=function(sql,params,successCallback,errorCallback){if(typeof params==="undefined"){params=[]}var query=new DroidDB_Query(this);queryQueue[query.id]=query;query.successCallback=successCallback;query.errorCallback=errorCallback;exec(null,null,"Storage","executeSql",[sql,params,query.id])};var DatabaseShell=function(){};DatabaseShell.prototype.transaction=function(process,errorCallback,successCallback){var tx=new DroidDB_Tx();tx.successCallback=successCallback;tx.errorCallback=errorCallback;try{process(tx)}catch(e){console.log("Transaction error: "+e);if(tx.errorCallback){try{tx.errorCallback(e)}catch(ex){console.log("Transaction error calling user error callback: "+e)}}}};var DroidDB_openDatabase=function(name,version,display_name,size){exec(null,null,"Storage","openDatabase",[name,version,display_name,size]);var db=new DatabaseShell();return db};module.exports={openDatabase:DroidDB_openDatabase,failQuery:failQuery,completeQuery:completeQuery}});define("cordova/plugin/android/storage/openDatabase",function(require,exports,module){var modulemapper=require("cordova/modulemapper"),storage=require("cordova/plugin/android/storage");var originalOpenDatabase=modulemapper.getOriginalSymbol(window,"openDatabase");module.exports=function(name,version,desc,size){if(!originalOpenDatabase){return storage.openDatabase.apply(this,arguments)}try{return originalOpenDatabase(name,version,desc,size)}catch(ex){if(ex.code!==18){throw ex}}return storage.openDatabase(name,version,desc,size)}});define("cordova/plugin/android/storage/symbols",function(require,exports,module){var modulemapper=require("cordova/modulemapper");modulemapper.clobbers("cordova/plugin/android/storage/openDatabase","openDatabase")});define("cordova/plugin/battery",function(require,exports,module){var cordova=require("cordova"),exec=require("cordova/exec");function handlers(){return battery.channels.batterystatus.numHandlers+battery.channels.batterylow.numHandlers+battery.channels.batterycritical.numHandlers}var Battery=function(){this._level=null;this._isPlugged=null;this.channels={batterystatus:cordova.addWindowEventHandler("batterystatus"),batterylow:cordova.addWindowEventHandler("batterylow"),batterycritical:cordova.addWindowEventHandler("batterycritical")};for(var key in this.channels){this.channels[key].onHasSubscribersChange=Battery.onHasSubscribersChange}};Battery.onHasSubscribersChange=function(){if(this.numHandlers===1&&handlers()===1){exec(battery._status,battery._error,"Battery","start",[])}else{if(handlers()===0){exec(null,null,"Battery","stop",[])}}};Battery.prototype._status=function(info){if(info){var me=battery;var level=info.level;if(me._level!==level||me._isPlugged!==info.isPlugged){cordova.fireWindowEvent("batterystatus",info);if(level===20||level===5){if(level===20){cordova.fireWindowEvent("batterylow",info)}else{cordova.fireWindowEvent("batterycritical",info)}}}me._level=level;me._isPlugged=info.isPlugged}};Battery.prototype._error=function(e){console.log("Error initializing Battery: "+e)};var battery=new Battery();module.exports=battery});define("cordova/plugin/battery/symbols",function(require,exports,module){var modulemapper=require("cordova/modulemapper");modulemapper.defaults("cordova/plugin/battery","navigator.battery")});define("cordova/plugin/camera/symbols",function(require,exports,module){var modulemapper=require("cordova/modulemapper");modulemapper.defaults("cordova/plugin/Camera","navigator.camera");modulemapper.defaults("cordova/plugin/CameraConstants","Camera");modulemapper.defaults("cordova/plugin/CameraPopoverOptions","CameraPopoverOptions")});define("cordova/plugin/capture",function(require,exports,module){var exec=require("cordova/exec"),MediaFile=require("cordova/plugin/MediaFile");function _capture(type,successCallback,errorCallback,options){var win=function(pluginResult){var mediaFiles=[];var i;for(i=0;i<pluginResult.length;i++){var mediaFile=new MediaFile();mediaFile.name=pluginResult[i].name;mediaFile.fullPath=pluginResult[i].fullPath;mediaFile.type=pluginResult[i].type;mediaFile.lastModifiedDate=pluginResult[i].lastModifiedDate;mediaFile.size=pluginResult[i].size;mediaFiles.push(mediaFile)}successCallback(mediaFiles)};exec(win,errorCallback,"Capture",type,[options])}function Capture(){this.supportedAudioModes=[];this.supportedImageModes=[];this.supportedVideoModes=[]}Capture.prototype.captureAudio=function(successCallback,errorCallback,options){_capture("captureAudio",successCallback,errorCallback,options)};Capture.prototype.captureImage=function(successCallback,errorCallback,options){_capture("captureImage",successCallback,errorCallback,options)};Capture.prototype.captureVideo=function(successCallback,errorCallback,options){_capture("captureVideo",successCallback,errorCallback,options)};module.exports=new Capture()});define("cordova/plugin/capture/symbols",function(require,exports,module){var modulemapper=require("cordova/modulemapper");modulemapper.clobbers("cordova/plugin/CaptureError","CaptureError");
modulemapper.clobbers("cordova/plugin/CaptureAudioOptions","CaptureAudioOptions");modulemapper.clobbers("cordova/plugin/CaptureImageOptions","CaptureImageOptions");modulemapper.clobbers("cordova/plugin/CaptureVideoOptions","CaptureVideoOptions");modulemapper.clobbers("cordova/plugin/ConfigurationData","ConfigurationData");modulemapper.clobbers("cordova/plugin/MediaFile","MediaFile");modulemapper.clobbers("cordova/plugin/MediaFileData","MediaFileData");modulemapper.clobbers("cordova/plugin/capture","navigator.device.capture")});define("cordova/plugin/compass",function(require,exports,module){var argscheck=require("cordova/argscheck"),exec=require("cordova/exec"),utils=require("cordova/utils"),CompassHeading=require("cordova/plugin/CompassHeading"),CompassError=require("cordova/plugin/CompassError"),timers={},compass={getCurrentHeading:function(successCallback,errorCallback,options){argscheck.checkArgs("fFO","compass.getCurrentHeading",arguments);var win=function(result){var ch=new CompassHeading(result.magneticHeading,result.trueHeading,result.headingAccuracy,result.timestamp);successCallback(ch)};var fail=errorCallback&&function(code){var ce=new CompassError(code);errorCallback(ce)};exec(win,fail,"Compass","getHeading",[options])},watchHeading:function(successCallback,errorCallback,options){argscheck.checkArgs("fFO","compass.watchHeading",arguments);var frequency=(options!==undefined&&options.frequency!==undefined)?options.frequency:100;var filter=(options!==undefined&&options.filter!==undefined)?options.filter:0;var id=utils.createUUID();if(filter>0){timers[id]="iOS";compass.getCurrentHeading(successCallback,errorCallback,options)}else{timers[id]=window.setInterval(function(){compass.getCurrentHeading(successCallback,errorCallback)},frequency)}return id},clearWatch:function(id){if(id&&timers[id]){if(timers[id]!="iOS"){clearInterval(timers[id])}else{exec(null,null,"Compass","stopHeading",[])}delete timers[id]}}};module.exports=compass});define("cordova/plugin/compass/symbols",function(require,exports,module){var modulemapper=require("cordova/modulemapper");modulemapper.clobbers("cordova/plugin/CompassHeading","CompassHeading");modulemapper.clobbers("cordova/plugin/CompassError","CompassError");modulemapper.clobbers("cordova/plugin/compass","navigator.compass")});define("cordova/plugin/console-via-logger",function(require,exports,module){var logger=require("cordova/plugin/logger");var utils=require("cordova/utils");var console=module.exports;var WinConsole=window.console;var UseLogger=false;var Timers={};function noop(){}console.useLogger=function(value){if(arguments.length){UseLogger=!!value}if(UseLogger){if(logger.useConsole()){throw new Error("console and logger are too intertwingly")}}return UseLogger};console.log=function(){if(logger.useConsole()){return}logger.log.apply(logger,[].slice.call(arguments))};console.error=function(){if(logger.useConsole()){return}logger.error.apply(logger,[].slice.call(arguments))};console.warn=function(){if(logger.useConsole()){return}logger.warn.apply(logger,[].slice.call(arguments))};console.info=function(){if(logger.useConsole()){return}logger.info.apply(logger,[].slice.call(arguments))};console.debug=function(){if(logger.useConsole()){return}logger.debug.apply(logger,[].slice.call(arguments))};console.assert=function(expression){if(expression){return}var message=utils.vformat(arguments[1],[].slice.call(arguments,2));console.log("ASSERT: "+message)};console.clear=function(){};console.dir=function(object){console.log("%o",object)};console.dirxml=function(node){console.log(node.innerHTML)};console.trace=noop;console.group=console.log;console.groupCollapsed=console.log;console.groupEnd=noop;console.time=function(name){Timers[name]=new Date().valueOf()};console.timeEnd=function(name){var timeStart=Timers[name];if(!timeStart){console.warn("unknown timer: "+name);return}var timeElapsed=new Date().valueOf()-timeStart;console.log(name+": "+timeElapsed+"ms")};console.timeStamp=noop;console.profile=noop;console.profileEnd=noop;console.count=noop;console.exception=console.log;console.table=function(data,columns){console.log("%o",data)};function wrappedOrigCall(orgFunc,newFunc){return function(){var args=[].slice.call(arguments);try{orgFunc.apply(WinConsole,args)}catch(e){}try{newFunc.apply(console,args)}catch(e){}}}for(var key in console){if(typeof WinConsole[key]=="function"){console[key]=wrappedOrigCall(WinConsole[key],console[key])}}});define("cordova/plugin/contacts",function(require,exports,module){var argscheck=require("cordova/argscheck"),exec=require("cordova/exec"),ContactError=require("cordova/plugin/ContactError"),utils=require("cordova/utils"),Contact=require("cordova/plugin/Contact");var contacts={find:function(fields,successCB,errorCB,options){argscheck.checkArgs("afFO","contacts.find",arguments);if(!fields.length){errorCB&&errorCB(new ContactError(ContactError.INVALID_ARGUMENT_ERROR))}else{var win=function(result){var cs=[];for(var i=0,l=result.length;i<l;i++){cs.push(contacts.create(result[i]))
}successCB(cs)};exec(win,errorCB,"Contacts","search",[fields,options])}},create:function(properties){argscheck.checkArgs("O","contacts.create",arguments);var contact=new Contact();for(var i in properties){if(typeof contact[i]!=="undefined"&&properties.hasOwnProperty(i)){contact[i]=properties[i]}}return contact}};module.exports=contacts});define("cordova/plugin/contacts/symbols",function(require,exports,module){var modulemapper=require("cordova/modulemapper");modulemapper.clobbers("cordova/plugin/contacts","navigator.contacts");modulemapper.clobbers("cordova/plugin/Contact","Contact");modulemapper.clobbers("cordova/plugin/ContactAddress","ContactAddress");modulemapper.clobbers("cordova/plugin/ContactError","ContactError");modulemapper.clobbers("cordova/plugin/ContactField","ContactField");modulemapper.clobbers("cordova/plugin/ContactFindOptions","ContactFindOptions");modulemapper.clobbers("cordova/plugin/ContactName","ContactName");modulemapper.clobbers("cordova/plugin/ContactOrganization","ContactOrganization")});define("cordova/plugin/device",function(require,exports,module){var argscheck=require("cordova/argscheck"),channel=require("cordova/channel"),utils=require("cordova/utils"),exec=require("cordova/exec");channel.waitForInitialization("onCordovaInfoReady");function Device(){this.available=false;this.platform=null;this.version=null;this.name=null;this.uuid=null;this.cordova=null;this.model=null;var me=this;channel.onCordovaReady.subscribe(function(){me.getInfo(function(info){me.available=true;me.platform=info.platform;me.version=info.version;me.name=info.name;me.uuid=info.uuid;me.cordova=info.cordova;me.model=info.model;channel.onCordovaInfoReady.fire()},function(e){me.available=false;utils.alert("[ERROR] Error initializing Cordova: "+e)})})}Device.prototype.getInfo=function(successCallback,errorCallback){argscheck.checkArgs("fF","Device.getInfo",arguments);exec(successCallback,errorCallback,"Device","getDeviceInfo",[])};module.exports=new Device()});define("cordova/plugin/device/symbols",function(require,exports,module){var modulemapper=require("cordova/modulemapper");modulemapper.clobbers("cordova/plugin/device","device");modulemapper.merges("cordova/plugin/android/device","device")});define("cordova/plugin/echo",function(require,exports,module){var exec=require("cordova/exec"),utils=require("cordova/utils");module.exports=function(successCallback,errorCallback,message,forceAsync){var action="echo";var messageIsMultipart=(utils.typeName(message)=="Array");var args=messageIsMultipart?message:[message];if(utils.typeName(message)=="ArrayBuffer"){if(forceAsync){console.warn("Cannot echo ArrayBuffer with forced async, falling back to sync.")}action+="ArrayBuffer"}else{if(messageIsMultipart){if(forceAsync){console.warn("Cannot echo MultiPart Array with forced async, falling back to sync.")}action+="MultiPart"}else{if(forceAsync){action+="Async"}}}exec(successCallback,errorCallback,"Echo",action,args)}});define("cordova/plugin/file/symbols",function(require,exports,module){var modulemapper=require("cordova/modulemapper"),symbolshelper=require("cordova/plugin/file/symbolshelper");symbolshelper(modulemapper.clobbers)});define("cordova/plugin/file/symbolshelper",function(require,exports,module){module.exports=function(exportFunc){exportFunc("cordova/plugin/DirectoryEntry","DirectoryEntry");exportFunc("cordova/plugin/DirectoryReader","DirectoryReader");exportFunc("cordova/plugin/Entry","Entry");exportFunc("cordova/plugin/File","File");exportFunc("cordova/plugin/FileEntry","FileEntry");exportFunc("cordova/plugin/FileError","FileError");exportFunc("cordova/plugin/FileReader","FileReader");exportFunc("cordova/plugin/FileSystem","FileSystem");exportFunc("cordova/plugin/FileUploadOptions","FileUploadOptions");exportFunc("cordova/plugin/FileUploadResult","FileUploadResult");exportFunc("cordova/plugin/FileWriter","FileWriter");exportFunc("cordova/plugin/Flags","Flags");exportFunc("cordova/plugin/LocalFileSystem","LocalFileSystem");exportFunc("cordova/plugin/Metadata","Metadata");exportFunc("cordova/plugin/ProgressEvent","ProgressEvent");exportFunc("cordova/plugin/requestFileSystem","requestFileSystem");exportFunc("cordova/plugin/resolveLocalFileSystemURI","resolveLocalFileSystemURI")}});define("cordova/plugin/filetransfer/symbols",function(require,exports,module){var modulemapper=require("cordova/modulemapper");modulemapper.clobbers("cordova/plugin/FileTransfer","FileTransfer");modulemapper.clobbers("cordova/plugin/FileTransferError","FileTransferError")});define("cordova/plugin/geolocation",function(require,exports,module){var argscheck=require("cordova/argscheck"),utils=require("cordova/utils"),exec=require("cordova/exec"),PositionError=require("cordova/plugin/PositionError"),Position=require("cordova/plugin/Position");var timers={};function parseParameters(options){var opt={maximumAge:0,enableHighAccuracy:false,timeout:Infinity};if(options){if(options.maximumAge!==undefined&&!isNaN(options.maximumAge)&&options.maximumAge>0){opt.maximumAge=options.maximumAge
}if(options.enableHighAccuracy!==undefined){opt.enableHighAccuracy=options.enableHighAccuracy}if(options.timeout!==undefined&&!isNaN(options.timeout)){if(options.timeout<0){opt.timeout=0}else{opt.timeout=options.timeout}}}return opt}function createTimeout(errorCallback,timeout){var t=setTimeout(function(){clearTimeout(t);t=null;errorCallback({code:PositionError.TIMEOUT,message:"Position retrieval timed out."})},timeout);return t}var geolocation={lastPosition:null,getCurrentPosition:function(successCallback,errorCallback,options){argscheck.checkArgs("fFO","geolocation.getCurrentPosition",arguments);options=parseParameters(options);var timeoutTimer={timer:null};var win=function(p){clearTimeout(timeoutTimer.timer);if(!(timeoutTimer.timer)){return}var pos=new Position({latitude:p.latitude,longitude:p.longitude,altitude:p.altitude,accuracy:p.accuracy,heading:p.heading,velocity:p.velocity,altitudeAccuracy:p.altitudeAccuracy},(p.timestamp===undefined?new Date():((p.timestamp instanceof Date)?p.timestamp:new Date(p.timestamp))));geolocation.lastPosition=pos;successCallback(pos)};var fail=function(e){clearTimeout(timeoutTimer.timer);timeoutTimer.timer=null;var err=new PositionError(e.code,e.message);if(errorCallback){errorCallback(err)}};if(geolocation.lastPosition&&options.maximumAge&&(((new Date()).getTime()-geolocation.lastPosition.timestamp.getTime())<=options.maximumAge)){successCallback(geolocation.lastPosition)}else{if(options.timeout===0){fail({code:PositionError.TIMEOUT,message:"timeout value in PositionOptions set to 0 and no cached Position object available, or cached Position object's age exceeds provided PositionOptions' maximumAge parameter."})}else{if(options.timeout!==Infinity){timeoutTimer.timer=createTimeout(fail,options.timeout)}else{timeoutTimer.timer=true}exec(win,fail,"Geolocation","getLocation",[options.enableHighAccuracy,options.maximumAge])}}return timeoutTimer},watchPosition:function(successCallback,errorCallback,options){argscheck.checkArgs("fFO","geolocation.getCurrentPosition",arguments);options=parseParameters(options);var id=utils.createUUID();timers[id]=geolocation.getCurrentPosition(successCallback,errorCallback,options);var fail=function(e){clearTimeout(timers[id].timer);var err=new PositionError(e.code,e.message);if(errorCallback){errorCallback(err)}};var win=function(p){clearTimeout(timers[id].timer);if(options.timeout!==Infinity){timers[id].timer=createTimeout(fail,options.timeout)}var pos=new Position({latitude:p.latitude,longitude:p.longitude,altitude:p.altitude,accuracy:p.accuracy,heading:p.heading,velocity:p.velocity,altitudeAccuracy:p.altitudeAccuracy},(p.timestamp===undefined?new Date():((p.timestamp instanceof Date)?p.timestamp:new Date(p.timestamp))));geolocation.lastPosition=pos;successCallback(pos)};exec(win,fail,"Geolocation","addWatch",[id,options.enableHighAccuracy]);return id},clearWatch:function(id){if(id&&timers[id]!==undefined){clearTimeout(timers[id].timer);timers[id].timer=false;exec(null,null,"Geolocation","clearWatch",[id])}}};module.exports=geolocation});define("cordova/plugin/geolocation/symbols",function(require,exports,module){var modulemapper=require("cordova/modulemapper");modulemapper.defaults("cordova/plugin/geolocation","navigator.geolocation");modulemapper.clobbers("cordova/plugin/PositionError","PositionError");modulemapper.clobbers("cordova/plugin/Position","Position");modulemapper.clobbers("cordova/plugin/Coordinates","Coordinates")});define("cordova/plugin/globalization",function(require,exports,module){var argscheck=require("cordova/argscheck"),exec=require("cordova/exec"),GlobalizationError=require("cordova/plugin/GlobalizationError");var globalization={getPreferredLanguage:function(successCB,failureCB){argscheck.checkArgs("fF","Globalization.getPreferredLanguage",arguments);exec(successCB,failureCB,"Globalization","getPreferredLanguage",[])},getLocaleName:function(successCB,failureCB){argscheck.checkArgs("fF","Globalization.getLocaleName",arguments);exec(successCB,failureCB,"Globalization","getLocaleName",[])},dateToString:function(date,successCB,failureCB,options){argscheck.checkArgs("dfFO","Globalization.dateToString",arguments);var dateValue=date.valueOf();exec(successCB,failureCB,"Globalization","dateToString",[{"date":dateValue,"options":options}])},stringToDate:function(dateString,successCB,failureCB,options){argscheck.checkArgs("sfFO","Globalization.stringToDate",arguments);exec(successCB,failureCB,"Globalization","stringToDate",[{"dateString":dateString,"options":options}])},getDatePattern:function(successCB,failureCB,options){argscheck.checkArgs("fFO","Globalization.getDatePattern",arguments);exec(successCB,failureCB,"Globalization","getDatePattern",[{"options":options}])},getDateNames:function(successCB,failureCB,options){argscheck.checkArgs("fFO","Globalization.getDateNames",arguments);exec(successCB,failureCB,"Globalization","getDateNames",[{"options":options}])},isDayLightSavingsTime:function(date,successCB,failureCB){argscheck.checkArgs("dfF","Globalization.isDayLightSavingsTime",arguments);
var dateValue=date.valueOf();exec(successCB,failureCB,"Globalization","isDayLightSavingsTime",[{"date":dateValue}])},getFirstDayOfWeek:function(successCB,failureCB){argscheck.checkArgs("fF","Globalization.getFirstDayOfWeek",arguments);exec(successCB,failureCB,"Globalization","getFirstDayOfWeek",[])},numberToString:function(number,successCB,failureCB,options){argscheck.checkArgs("nfFO","Globalization.numberToString",arguments);exec(successCB,failureCB,"Globalization","numberToString",[{"number":number,"options":options}])},stringToNumber:function(numberString,successCB,failureCB,options){argscheck.checkArgs("sfFO","Globalization.stringToNumber",arguments);exec(successCB,failureCB,"Globalization","stringToNumber",[{"numberString":numberString,"options":options}])},getNumberPattern:function(successCB,failureCB,options){argscheck.checkArgs("fFO","Globalization.getNumberPattern",arguments);exec(successCB,failureCB,"Globalization","getNumberPattern",[{"options":options}])},getCurrencyPattern:function(currencyCode,successCB,failureCB){argscheck.checkArgs("sfF","Globalization.getCurrencyPattern",arguments);exec(successCB,failureCB,"Globalization","getCurrencyPattern",[{"currencyCode":currencyCode}])}};module.exports=globalization});define("cordova/plugin/globalization/symbols",function(require,exports,module){var modulemapper=require("cordova/modulemapper");modulemapper.clobbers("cordova/plugin/globalization","navigator.globalization");modulemapper.clobbers("cordova/plugin/GlobalizationError","GlobalizationError")});define("cordova/plugin/inappbrowser/symbols",function(require,exports,module){var modulemapper=require("cordova/modulemapper");modulemapper.clobbers("cordova/plugin/InAppBrowser","open")});define("cordova/plugin/logger",function(require,exports,module){var logger=exports;var exec=require("cordova/exec");var utils=require("cordova/utils");var UseConsole=true;var Queued=[];var DeviceReady=false;var CurrentLevel;var Levels=["LOG","ERROR","WARN","INFO","DEBUG"];var LevelsMap={};for(var i=0;i<Levels.length;i++){var level=Levels[i];LevelsMap[level]=i;logger[level]=level}CurrentLevel=LevelsMap.WARN;logger.level=function(value){if(arguments.length){if(LevelsMap[value]===null){throw new Error("invalid logging level: "+value)}CurrentLevel=LevelsMap[value]}return Levels[CurrentLevel]};logger.useConsole=function(value){if(arguments.length){UseConsole=!!value}if(UseConsole){if(typeof console=="undefined"){throw new Error("global console object is not defined")}if(typeof console.log!="function"){throw new Error("global console object does not have a log function")}if(typeof console.useLogger=="function"){if(console.useLogger()){throw new Error("console and logger are too intertwingly")}}}return UseConsole};logger.log=function(message){logWithArgs("LOG",arguments)};logger.error=function(message){logWithArgs("ERROR",arguments)};logger.warn=function(message){logWithArgs("WARN",arguments)};logger.info=function(message){logWithArgs("INFO",arguments)};logger.debug=function(message){logWithArgs("DEBUG",arguments)};function logWithArgs(level,args){args=[level].concat([].slice.call(args));logger.logLevel.apply(logger,args)}logger.logLevel=function(level,message){var formatArgs=[].slice.call(arguments,2);message=utils.vformat(message,formatArgs);if(LevelsMap[level]===null){throw new Error("invalid logging level: "+level)}if(LevelsMap[level]>CurrentLevel){return}if(!DeviceReady&&!UseConsole){Queued.push([level,message]);return}if(!UseConsole){exec(null,null,"Logger","logLevel",[level,message]);return}if(console.__usingCordovaLogger){throw new Error("console and logger are too intertwingly")}switch(level){case logger.LOG:console.log(message);break;case logger.ERROR:console.log("ERROR: "+message);break;case logger.WARN:console.log("WARN: "+message);break;case logger.INFO:console.log("INFO: "+message);break;case logger.DEBUG:console.log("DEBUG: "+message);break}};logger.__onDeviceReady=function(){if(DeviceReady){return}DeviceReady=true;for(var i=0;i<Queued.length;i++){var messageArgs=Queued[i];logger.logLevel(messageArgs[0],messageArgs[1])}Queued=null};document.addEventListener("deviceready",logger.__onDeviceReady,false)});define("cordova/plugin/logger/symbols",function(require,exports,module){var modulemapper=require("cordova/modulemapper");modulemapper.clobbers("cordova/plugin/logger","cordova.logger")});define("cordova/plugin/media/symbols",function(require,exports,module){var modulemapper=require("cordova/modulemapper");modulemapper.defaults("cordova/plugin/Media","Media");modulemapper.clobbers("cordova/plugin/MediaError","MediaError")});define("cordova/plugin/network",function(require,exports,module){var exec=require("cordova/exec"),cordova=require("cordova"),channel=require("cordova/channel"),utils=require("cordova/utils");if(typeof navigator!="undefined"){utils.defineGetter(navigator,"onLine",function(){return this.connection.type!="none"})}function NetworkConnection(){this.type="unknown"}NetworkConnection.prototype.getInfo=function(successCallback,errorCallback){exec(successCallback,errorCallback,"NetworkStatus","getConnectionInfo",[])
};var me=new NetworkConnection();var timerId=null;var timeout=500;channel.onCordovaReady.subscribe(function(){me.getInfo(function(info){me.type=info;if(info==="none"){timerId=setTimeout(function(){cordova.fireDocumentEvent("offline");timerId=null},timeout)}else{if(timerId!==null){clearTimeout(timerId);timerId=null}cordova.fireDocumentEvent("online")}if(channel.onCordovaConnectionReady.state!==2){channel.onCordovaConnectionReady.fire()}},function(e){if(channel.onCordovaConnectionReady.state!==2){channel.onCordovaConnectionReady.fire()}console.log("Error initializing Network Connection: "+e)})});module.exports=me});define("cordova/plugin/networkstatus/symbols",function(require,exports,module){var modulemapper=require("cordova/modulemapper");modulemapper.clobbers("cordova/plugin/network","navigator.network.connection","navigator.network.connection is deprecated. Use navigator.connection instead.");modulemapper.clobbers("cordova/plugin/network","navigator.connection");modulemapper.defaults("cordova/plugin/Connection","Connection")});define("cordova/plugin/notification",function(require,exports,module){var exec=require("cordova/exec");var platform=require("cordova/platform");module.exports={alert:function(message,completeCallback,title,buttonLabel){var _title=(title||"Alert");var _buttonLabel=(buttonLabel||"OK");exec(completeCallback,null,"Notification","alert",[message,_title,_buttonLabel])},confirm:function(message,resultCallback,title,buttonLabels){var _title=(title||"Confirm");var _buttonLabels=(buttonLabels||["OK","Cancel"]);if(typeof _buttonLabels==="string"){console.log("Notification.confirm(string, function, string, string) is deprecated.  Use Notification.confirm(string, function, string, array).")}if(platform.id=="android"||platform.id=="ios"){if(typeof _buttonLabels==="string"){var buttonLabelString=_buttonLabels;_buttonLabels=buttonLabelString.split(",")}}else{if(Array.isArray(_buttonLabels)){var buttonLabelArray=_buttonLabels;_buttonLabels=buttonLabelArray.toString()}}exec(resultCallback,null,"Notification","confirm",[message,_title,_buttonLabels])},prompt:function(message,resultCallback,title,buttonLabels){var _message=(message||"Prompt message");var _title=(title||"Prompt");var _buttonLabels=(buttonLabels||["OK","Cancel"]);exec(resultCallback,null,"Notification","prompt",[_message,_title,_buttonLabels])},vibrate:function(mills){exec(null,null,"Notification","vibrate",[mills])},beep:function(count){exec(null,null,"Notification","beep",[count])}}});define("cordova/plugin/notification/symbols",function(require,exports,module){var modulemapper=require("cordova/modulemapper");modulemapper.clobbers("cordova/plugin/notification","navigator.notification");modulemapper.merges("cordova/plugin/android/notification","navigator.notification")});define("cordova/plugin/requestFileSystem",function(require,exports,module){var argscheck=require("cordova/argscheck"),FileError=require("cordova/plugin/FileError"),FileSystem=require("cordova/plugin/FileSystem"),exec=require("cordova/exec");var requestFileSystem=function(type,size,successCallback,errorCallback){argscheck.checkArgs("nnFF","requestFileSystem",arguments);var fail=function(code){errorCallback&&errorCallback(new FileError(code))};if(type<0||type>3){fail(FileError.SYNTAX_ERR)}else{var success=function(file_system){if(file_system){if(successCallback){var result=new FileSystem(file_system.name,file_system.root);successCallback(result)}}else{fail(FileError.NOT_FOUND_ERR)}};exec(success,fail,"File","requestFileSystem",[type,size])}};module.exports=requestFileSystem});define("cordova/plugin/resolveLocalFileSystemURI",function(require,exports,module){var argscheck=require("cordova/argscheck"),DirectoryEntry=require("cordova/plugin/DirectoryEntry"),FileEntry=require("cordova/plugin/FileEntry"),FileError=require("cordova/plugin/FileError"),exec=require("cordova/exec");module.exports=function(uri,successCallback,errorCallback){argscheck.checkArgs("sFF","resolveLocalFileSystemURI",arguments);var fail=function(error){errorCallback&&errorCallback(new FileError(error))};if(!uri||uri.split(":").length>2){setTimeout(function(){fail(FileError.ENCODING_ERR)},0);return}var success=function(entry){var result;if(entry){if(successCallback){result=(entry.isDirectory)?new DirectoryEntry(entry.name,entry.fullPath):new FileEntry(entry.name,entry.fullPath);successCallback(result)}}else{fail(FileError.NOT_FOUND_ERR)}};exec(success,fail,"File","resolveLocalFileSystemURI",[uri])}});define("cordova/plugin/splashscreen",function(require,exports,module){var exec=require("cordova/exec");var splashscreen={show:function(){exec(null,null,"SplashScreen","show",[])},hide:function(){exec(null,null,"SplashScreen","hide",[])}};module.exports=splashscreen});define("cordova/plugin/splashscreen/symbols",function(require,exports,module){var modulemapper=require("cordova/modulemapper");modulemapper.clobbers("cordova/plugin/splashscreen","navigator.splashscreen")});define("cordova/symbols",function(require,exports,module){var modulemapper=require("cordova/modulemapper");
modulemapper.merges("cordova","cordova");modulemapper.clobbers("cordova/exec","cordova.exec");modulemapper.clobbers("cordova/exec","Cordova.exec")});define("cordova/utils",function(require,exports,module){var utils=exports;utils.defineGetterSetter=function(obj,key,getFunc,opt_setFunc){if(Object.defineProperty){var desc={get:getFunc,configurable:true};if(opt_setFunc){desc.set=opt_setFunc}Object.defineProperty(obj,key,desc)}else{obj.__defineGetter__(key,getFunc);if(opt_setFunc){obj.__defineSetter__(key,opt_setFunc)}}};utils.defineGetter=utils.defineGetterSetter;utils.arrayIndexOf=function(a,item){if(a.indexOf){return a.indexOf(item)}var len=a.length;for(var i=0;i<len;++i){if(a[i]==item){return i}}return -1};utils.arrayRemove=function(a,item){var index=utils.arrayIndexOf(a,item);if(index!=-1){a.splice(index,1)}return index!=-1};utils.typeName=function(val){return Object.prototype.toString.call(val).slice(8,-1)};utils.isArray=function(a){return utils.typeName(a)=="Array"};utils.isDate=function(d){return utils.typeName(d)=="Date"};utils.clone=function(obj){if(!obj||typeof obj=="function"||utils.isDate(obj)||typeof obj!="object"){return obj}var retVal,i;if(utils.isArray(obj)){retVal=[];for(i=0;i<obj.length;++i){retVal.push(utils.clone(obj[i]))}return retVal}retVal={};for(i in obj){if(!(i in retVal)||retVal[i]!=obj[i]){retVal[i]=utils.clone(obj[i])}}return retVal};utils.close=function(context,func,params){if(typeof params=="undefined"){return function(){return func.apply(context,arguments)}}else{return function(){return func.apply(context,params)}}};utils.createUUID=function(){return UUIDcreatePart(4)+"-"+UUIDcreatePart(2)+"-"+UUIDcreatePart(2)+"-"+UUIDcreatePart(2)+"-"+UUIDcreatePart(6)};utils.extend=(function(){var F=function(){};return function(Child,Parent){F.prototype=Parent.prototype;Child.prototype=new F();Child.__super__=Parent.prototype;Child.prototype.constructor=Child}}());utils.alert=function(msg){if(window.alert){window.alert(msg)}else{if(console&&console.log){console.log(msg)}}};utils.format=function(formatString){var args=[].slice.call(arguments,1);return utils.vformat(formatString,args)};utils.vformat=function(formatString,args){if(formatString===null||formatString===undefined){return""}if(arguments.length==1){return formatString.toString()}if(typeof formatString!="string"){return formatString.toString()}var pattern=/(.*?)%(.)(.*)/;var rest=formatString;var result=[];while(args.length){var arg=args.shift();var match=pattern.exec(rest);if(!match){break}rest=match[3];result.push(match[1]);if(match[2]=="%"){result.push("%");args.unshift(arg);continue}result.push(formatted(arg,match[2]))}result.push(rest);return result.join("")};function UUIDcreatePart(length){var uuidpart="";for(var i=0;i<length;i++){var uuidchar=parseInt((Math.random()*256),10).toString(16);if(uuidchar.length==1){uuidchar="0"+uuidchar}uuidpart+=uuidchar}return uuidpart}function formatted(object,formatChar){try{switch(formatChar){case"j":case"o":return JSON.stringify(object);case"c":return""}}catch(e){return"error JSON.stringify()ing argument: "+e}if((object===null)||(object===undefined)){return Object.prototype.toString.call(object)}return object.toString()}});window.cordova=require("cordova");(function(context){function replaceNavigator(origNavigator){var CordovaNavigator=function(){};CordovaNavigator.prototype=origNavigator;var newNavigator=new CordovaNavigator();if(CordovaNavigator.bind){for(var key in origNavigator){if(typeof origNavigator[key]=="function"){newNavigator[key]=origNavigator[key].bind(origNavigator)}}}return newNavigator}if(context.navigator){context.navigator=replaceNavigator(context.navigator)}var channel=require("cordova/channel");if(window._nativeReady){channel.onNativeReady.fire()}channel.join(function(){var builder=require("cordova/builder"),platform=require("cordova/platform");builder.buildIntoButDoNotClobber(platform.defaults,context);builder.buildIntoAndClobber(platform.clobbers,context);builder.buildIntoAndMerge(platform.merges,context);platform.initialize();channel.onCordovaReady.fire();channel.join(function(){require("cordova").fireDocumentEvent("deviceready")},channel.deviceReadyChannelsArray)},[channel.onDOMContentLoaded,channel.onNativeReady,channel.onPluginsReady])}(window));(function(context){var onScriptLoadingComplete;var scriptCounter=0;function scriptLoadedCallback(){scriptCounter--;if(scriptCounter===0){onScriptLoadingComplete&&onScriptLoadingComplete()}}function injectScript(path){scriptCounter++;var script=document.createElement("script");script.onload=scriptLoadedCallback;script.src=path;document.head.appendChild(script)}function finishPluginLoading(){context.cordova.require("cordova/channel").onPluginsReady.fire()}function handlePluginsObject(modules){var mapper=context.cordova.require("cordova/modulemapper");onScriptLoadingComplete=function(){for(var i=0;i<modules.length;i++){var module=modules[i];if(!module){continue}if(module.clobbers&&module.clobbers.length){for(var j=0;j<module.clobbers.length;
j++){mapper.clobbers(module.id,module.clobbers[j])}}if(module.merges&&module.merges.length){for(var k=0;k<module.merges.length;k++){mapper.merges(module.id,module.merges[k])}}if(module.runs&&!(module.clobbers&&module.clobbers.length)&&!(module.merges&&module.merges.length)){context.cordova.require(module.id)}}finishPluginLoading()};for(var i=0;i<modules.length;i++){injectScript(modules[i].file)}}try{var xhr=new context.XMLHttpRequest();xhr.onreadystatechange=function(){if(this.readyState!=4){return}if(this.status==200){var obj=JSON.parse(this.responseText);if(obj&&obj instanceof Array&&obj.length>0){handlePluginsObject(obj)}else{finishPluginLoading()}}else{finishPluginLoading()}};xhr.open("GET","cordova_plugins.json",true);xhr.send()}catch(err){finishPluginLoading()}}(window))})();var PhoneGap=cordova;
 
}else{
    
    if(userAgent.indexOf("appstore") >= 0) {
//        alert("新版cordova");

        ; (function () {
            var PLATFORM_VERSION_BUILD_LABEL = '6.0.0';
            // file: src/scripts/require.js
            var require;
            var define;

            (function () {
                var modules = {};
                // Stack of moduleIds currently being built.
                var requireStack = [];
                // Map of module ID -> index into requireStack of modules currently being built.
                var inProgressModules = {};
                var SEPARATOR = '.';

                function build(module) {
                    var factory = module.factory;
                    var localRequire = function (id) {
                        var resultantId = id;
                        // Its a relative path, so lop off the last portion and add the id (minus "./")
                        if (id.charAt(0) === '.') {
                            resultantId = module.id.slice(0, module.id.lastIndexOf(SEPARATOR)) + SEPARATOR + id.slice(2);
                        }
                        return require(resultantId);
                    };
                    module.exports = {};
                    delete module.factory;
                    factory(localRequire, module.exports, module);
                    return module.exports;
                }

                require = function (id) {
                    if (!modules[id]) {
                        throw new Error('module ' + id + ' not found');
                    } else if (id in inProgressModules) {
                        var cycle = requireStack.slice(inProgressModules[id]).join('->') + '->' + id;
                        throw new Error('Cycle in require graph: ' + cycle);
                    }
                    if (modules[id].factory) {
                        try {
                            inProgressModules[id] = requireStack.length;
                            requireStack.push(id);
                            return build(modules[id]);
                        } finally {
                            delete inProgressModules[id];
                            requireStack.pop();
                        }
                    }
                    return modules[id].exports;
                };

                define = function (id, factory) {
                    if (Object.prototype.hasOwnProperty.call(modules, id)) {
                        throw new Error('module ' + id + ' already defined');
                    }

                    modules[id] = {
                        id: id,
                        factory: factory
                    };
                };

                define.remove = function (id) {
                    delete modules[id];
                };

                define.moduleMap = modules;
            })();

            // Export for use in node
            if (typeof module === 'object' && typeof require === 'function') {
                module.exports.require = require;
                module.exports.define = define;
            }

            // file: src/cordova.js
            define("cordova", function (require, exports, module) {

                // Workaround for Windows 10 in hosted environment case
                // http://www.w3.org/html/wg/drafts/html/master/browsers.html#named-access-on-the-window-object
                if (window.cordova && !(window.cordova instanceof HTMLElement)) {
                    throw new Error('cordova already defined');
                }

                var channel = require('cordova/channel');
                var platform = require('cordova/platform');

                /**
                 * Intercept calls to addEventListener + removeEventListener and handle deviceready,
                 * resume, and pause events.
                 */
                var m_document_addEventListener = document.addEventListener;
                var m_document_removeEventListener = document.removeEventListener;
                var m_window_addEventListener = window.addEventListener;
                var m_window_removeEventListener = window.removeEventListener;

                /**
                 * Houses custom event handlers to intercept on document + window event listeners.
                 */
                var documentEventHandlers = {};
                var windowEventHandlers = {};

                document.addEventListener = function (evt, handler, capture) {
                    var e = evt.toLowerCase();
                    if (typeof documentEventHandlers[e] !== 'undefined') {
                        documentEventHandlers[e].subscribe(handler);
                    } else {
                        m_document_addEventListener.call(document, evt, handler, capture);
                    }
                };

                window.addEventListener = function (evt, handler, capture) {
                    var e = evt.toLowerCase();
                    if (typeof windowEventHandlers[e] !== 'undefined') {
                        windowEventHandlers[e].subscribe(handler);
                    } else {
                        m_window_addEventListener.call(window, evt, handler, capture);
                    }
                };

                document.removeEventListener = function (evt, handler, capture) {
                    var e = evt.toLowerCase();
                    // If unsubscribing from an event that is handled by a plugin
                    if (typeof documentEventHandlers[e] !== 'undefined') {
                        documentEventHandlers[e].unsubscribe(handler);
                    } else {
                        m_document_removeEventListener.call(document, evt, handler, capture);
                    }
                };

                window.removeEventListener = function (evt, handler, capture) {
                    var e = evt.toLowerCase();
                    // If unsubscribing from an event that is handled by a plugin
                    if (typeof windowEventHandlers[e] !== 'undefined') {
                        windowEventHandlers[e].unsubscribe(handler);
                    } else {
                        m_window_removeEventListener.call(window, evt, handler, capture);
                    }
                };

                function createEvent(type, data) {
                    var event = document.createEvent('Events');
                    event.initEvent(type, false, false);
                    if (data) {
                        for (var i in data) {
                            if (Object.prototype.hasOwnProperty.call(data, i)) {
                                event[i] = data[i];
                            }
                        }
                    }
                    return event;
                }

                var cordova = {
                    define: define,
                    require: require,
                    version: PLATFORM_VERSION_BUILD_LABEL,
                    platformVersion: PLATFORM_VERSION_BUILD_LABEL,
                    platformId: platform.id,

                    /**
                     * Methods to add/remove your own addEventListener hijacking on document + window.
                     */
                    addWindowEventHandler: function (event) {
                        return (windowEventHandlers[event] = channel.create(event));
                    },
                    addStickyDocumentEventHandler: function (event) {
                        return (documentEventHandlers[event] = channel.createSticky(event));
                    },
                    addDocumentEventHandler: function (event) {
                        return (documentEventHandlers[event] = channel.create(event));
                    },
                    removeWindowEventHandler: function (event) {
                        delete windowEventHandlers[event];
                    },
                    removeDocumentEventHandler: function (event) {
                        delete documentEventHandlers[event];
                    },

                    /**
                     * Retrieve original event handlers that were replaced by Cordova
                     *
                     * @return object
                     */
                    getOriginalHandlers: function () {
                        return {
                            document: {
                                addEventListener: m_document_addEventListener,
                                removeEventListener: m_document_removeEventListener
                            },
                            window: {
                                addEventListener: m_window_addEventListener,
                                removeEventListener: m_window_removeEventListener
                            }
                        };
                    },

                    /**
                     * Method to fire event from native code
                     * bNoDetach is required for events which cause an exception which needs to be caught in native code
                     */
                    fireDocumentEvent: function (type, data, bNoDetach) {
                        var evt = createEvent(type, data);
                        if (typeof documentEventHandlers[type] !== 'undefined') {
                            if (bNoDetach) {
                                documentEventHandlers[type].fire(evt);
                            } else {
                                setTimeout(function () {
                                    // Fire deviceready on listeners that were registered before cordova.js was loaded.
                                    if (type === 'deviceready') {
                                        document.dispatchEvent(evt);
                                    }
                                    documentEventHandlers[type].fire(evt);
                                }, 0);
                            }
                        } else {
                            document.dispatchEvent(evt);
                        }
                    },

                    fireWindowEvent: function (type, data) {
                        var evt = createEvent(type, data);
                        if (typeof windowEventHandlers[type] !== 'undefined') {
                            setTimeout(function () {
                                windowEventHandlers[type].fire(evt);
                            }, 0);
                        } else {
                            window.dispatchEvent(evt);
                        }
                    },

                    /**
                     * Plugin callback mechanism.
                     */
                    // Randomize the starting callbackId to avoid collisions after refreshing or navigating.
                    // This way, it's very unlikely that any new callback would get the same callbackId as an old callback.
                    callbackId: Math.floor(Math.random() * 2000000000),
                    callbacks: {},
                    callbackStatus: {
                        NO_RESULT: 0,
                        OK: 1,
                        CLASS_NOT_FOUND_EXCEPTION: 2,
                        ILLEGAL_ACCESS_EXCEPTION: 3,
                        INSTANTIATION_EXCEPTION: 4,
                        MALFORMED_URL_EXCEPTION: 5,
                        IO_EXCEPTION: 6,
                        INVALID_ACTION: 7,
                        JSON_EXCEPTION: 8,
                        ERROR: 9
                    },

                    /**
                     * Called by native code when returning successful result from an action.
                     */
                    callbackSuccess: function (callbackId, args) {
                        cordova.callbackFromNative(callbackId, true, args.status, [args.message], args.keepCallback);
                    },

                    /**
                     * Called by native code when returning error result from an action.
                     */
                    callbackError: function (callbackId, args) {
                        // TODO: Deprecate callbackSuccess and callbackError in favour of callbackFromNative.
                        // Derive success from status.
                        cordova.callbackFromNative(callbackId, false, args.status, [args.message], args.keepCallback);
                    },

                    /**
                     * Called by native code when returning the result from an action.
                     */
                    callbackFromNative: function (callbackId, isSuccess, status, args, keepCallback) {
                        try {
                            var callback = cordova.callbacks[callbackId];
                            if (callback) {
                                if (isSuccess && status === cordova.callbackStatus.OK) {
                                    callback.success && callback.success.apply(null, args);
                                } else if (!isSuccess) {
                                    callback.fail && callback.fail.apply(null, args);
                                }
                                /*
                                else
                                    Note, this case is intentionally not caught.
                                    this can happen if isSuccess is true, but callbackStatus is NO_RESULT
                                    which is used to remove a callback from the list without calling the callbacks
                                    typically keepCallback is false in this case
                                */
                                // Clear callback if not expecting any more results
                                if (!keepCallback) {
                                    delete cordova.callbacks[callbackId];
                                }
                            }
                        } catch (err) {
                            var msg = 'Error in ' + (isSuccess ? 'Success' : 'Error') + ' callbackId: ' + callbackId + ' : ' + err;
                            cordova.fireWindowEvent('cordovacallbackerror', { message: msg, error: err });
                            throw err;
                        }
                    },

                    addConstructor: function (func) {
                        channel.onCordovaReady.subscribe(function () {
                            try {
                                func();
                            } catch (e) {
                                console.log('Failed to run constructor: ' + e);
                            }
                        });
                    }
                };

                module.exports = cordova;

            });

            // file: src/common/argscheck.js
            define("cordova/argscheck", function (require, exports, module) {

                var utils = require('cordova/utils');

                var moduleExports = module.exports;

                var typeMap = {
                    A: 'Array',
                    D: 'Date',
                    N: 'Number',
                    S: 'String',
                    F: 'Function',
                    O: 'Object'
                };

                function extractParamName(callee, argIndex) {
                    return (/\(\s*([^)]*?)\s*\)/).exec(callee)[1].split(/\s*,\s*/)[argIndex];
                }

                /**
                 * Checks the given arguments' types and throws if they are not as expected.
                 *
                 * `spec` is a string where each character stands for the required type of the
                 * argument at the same position. In other words: the character at `spec[i]`
                 * specifies the required type for `args[i]`. The characters in `spec` are the
                 * first letter of the required type's name. The supported types are:
                 *
                 *     Array, Date, Number, String, Function, Object
                 *
                 * Lowercase characters specify arguments that must not be `null` or `undefined`
                 * while uppercase characters allow those values to be passed.
                 *
                 * Finally, `*` can be used to allow any type at the corresponding position.
                 *
                 * @example
                 * function foo (arr, opts) {
                 *     // require `arr` to be an Array and `opts` an Object, null or undefined
                 *     checkArgs('aO', 'my.package.foo', arguments);
                 *     // ...
                 * }
                 * @param {String} spec - the type specification for `args` as described above
                 * @param {String} functionName - full name of the callee.
                 * Used in the error message
                 * @param {Array|arguments} args - the arguments to be checked against `spec`
                 * @param {Function} [opt_callee=args.callee] - the recipient of `args`.
                 * Used to extract parameter names for the error message
                 * @throws {TypeError} if args do not satisfy spec
                 */
                function checkArgs(spec, functionName, args, opt_callee) {
                    if (!moduleExports.enableChecks) {
                        return;
                    }
                    var errMsg = null;
                    var typeName;
                    for (var i = 0; i < spec.length; ++i) {
                        var c = spec.charAt(i);
                        var cUpper = c.toUpperCase();
                        var arg = args[i];
                        // Asterix means allow anything.
                        if (c === '*') {
                            continue;
                        }
                        typeName = utils.typeName(arg);
                        if ((arg === null || arg === undefined) && c === cUpper) {
                            continue;
                        }
                        if (typeName !== typeMap[cUpper]) {
                            errMsg = 'Expected ' + typeMap[cUpper];
                            break;
                        }
                    }
                    if (errMsg) {
                        errMsg += ', but got ' + typeName + '.';
                        errMsg = 'Wrong type for parameter "' + extractParamName(opt_callee || args.callee, i) + '" of ' + functionName + ': ' + errMsg;
                        // Don't log when running unit tests.
                        if (typeof jasmine === 'undefined') {
                            console.error(errMsg);
                        }
                        throw TypeError(errMsg);
                    }
                }

                function getValue(value, defaultValue) {
                    return value === undefined ? defaultValue : value;
                }

                moduleExports.checkArgs = checkArgs;
                moduleExports.getValue = getValue;
                moduleExports.enableChecks = true;

            });

            // file: src/common/base64.js
            define("cordova/base64", function (require, exports, module) {

                var base64 = exports;

                base64.fromArrayBuffer = function (arrayBuffer) {
                    var array = new Uint8Array(arrayBuffer);
                    return uint8ToBase64(array);
                };

                base64.toArrayBuffer = function (str) {
                    var decodedStr = atob(str);
                    var arrayBuffer = new ArrayBuffer(decodedStr.length);
                    var array = new Uint8Array(arrayBuffer);
                    for (var i = 0, len = decodedStr.length; i < len; i++) {
                        array[i] = decodedStr.charCodeAt(i);
                    }
                    return arrayBuffer;
                };

                // ------------------------------------------------------------------------------

                /* This code is based on the performance tests at http://jsperf.com/b64tests
                 * This 12-bit-at-a-time algorithm was the best performing version on all
                 * platforms tested.
                 */

                var b64_6bit = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
                var b64_12bit;

                var b64_12bitTable = function () {
                    b64_12bit = [];
                    for (var i = 0; i < 64; i++) {
                        for (var j = 0; j < 64; j++) {
                            b64_12bit[i * 64 + j] = b64_6bit[i] + b64_6bit[j];
                        }
                    }
                    b64_12bitTable = function () { return b64_12bit; };
                    return b64_12bit;
                };

                function uint8ToBase64(rawData) {
                    var numBytes = rawData.byteLength;
                    var output = '';
                    var segment;
                    var table = b64_12bitTable();
                    for (var i = 0; i < numBytes - 2; i += 3) {
                        segment = (rawData[i] << 16) + (rawData[i + 1] << 8) + rawData[i + 2];
                        output += table[segment >> 12];
                        output += table[segment & 0xfff];
                    }
                    if (numBytes - i === 2) {
                        segment = (rawData[i] << 16) + (rawData[i + 1] << 8);
                        output += table[segment >> 12];
                        output += b64_6bit[(segment & 0xfff) >> 6];
                        output += '=';
                    } else if (numBytes - i === 1) {
                        segment = (rawData[i] << 16);
                        output += table[segment >> 12];
                        output += '==';
                    }
                    return output;
                }

            });

            // file: src/common/builder.js
            define("cordova/builder", function (require, exports, module) {

                var utils = require('cordova/utils');

                function each(objects, func, context) {
                    for (var prop in objects) {
                        if (Object.prototype.hasOwnProperty.call(objects, prop)) {
                            func.apply(context, [objects[prop], prop]);
                        }
                    }
                }

                function clobber(obj, key, value) {
                    var needsProperty = false;
                    try {
                        obj[key] = value;
                    } catch (e) {
                        needsProperty = true;
                    }
                    // Getters can only be overridden by getters.
                    if (needsProperty || obj[key] !== value) {
                        utils.defineGetter(obj, key, function () {
                            return value;
                        });
                    }
                }

                function assignOrWrapInDeprecateGetter(obj, key, value, message) {
                    if (message) {
                        utils.defineGetter(obj, key, function () {
                            console.log(message);
                            delete obj[key];
                            clobber(obj, key, value);
                            return value;
                        });
                    } else {
                        clobber(obj, key, value);
                    }
                }

                function include(parent, objects, clobber, merge) {
                    each(objects, function (obj, key) {
                        try {
                            var result = obj.path ? require(obj.path) : {};

                            if (clobber) {
                                // Clobber if it doesn't exist.
                                if (typeof parent[key] === 'undefined') {
                                    assignOrWrapInDeprecateGetter(parent, key, result, obj.deprecated);
                                } else if (typeof obj.path !== 'undefined') {
                                    // If merging, merge properties onto parent, otherwise, clobber.
                                    if (merge) {
                                        recursiveMerge(parent[key], result);
                                    } else {
                                        assignOrWrapInDeprecateGetter(parent, key, result, obj.deprecated);
                                    }
                                }
                                result = parent[key];
                            } else {
                                // Overwrite if not currently defined.
                                if (typeof parent[key] === 'undefined') {
                                    assignOrWrapInDeprecateGetter(parent, key, result, obj.deprecated);
                                } else {
                                    // Set result to what already exists, so we can build children into it if they exist.
                                    result = parent[key];
                                }
                            }

                            if (obj.children) {
                                include(result, obj.children, clobber, merge);
                            }
                        } catch (e) {
                            utils.alert('Exception building Cordova JS globals: ' + e + ' for key "' + key + '"');
                        }
                    });
                }

                /**
                 * Merge properties from one object onto another recursively.  Properties from
                 * the src object will overwrite existing target property.
                 *
                 * @param target Object to merge properties into.
                 * @param src Object to merge properties from.
                 */
                function recursiveMerge(target, src) {
                    for (var prop in src) {
                        if (Object.prototype.hasOwnProperty.call(src, prop)) {
                            if (target.prototype && target.prototype.constructor === target) {
                                // If the target object is a constructor override off prototype.
                                clobber(target.prototype, prop, src[prop]);
                            } else {
                                if (typeof src[prop] === 'object' && typeof target[prop] === 'object') {
                                    recursiveMerge(target[prop], src[prop]);
                                } else {
                                    clobber(target, prop, src[prop]);
                                }
                            }
                        }
                    }
                }

                exports.buildIntoButDoNotClobber = function (objects, target) {
                    include(target, objects, false, false);
                };
                exports.buildIntoAndClobber = function (objects, target) {
                    include(target, objects, true, false);
                };
                exports.buildIntoAndMerge = function (objects, target) {
                    include(target, objects, true, true);
                };
                exports.recursiveMerge = recursiveMerge;
                exports.assignOrWrapInDeprecateGetter = assignOrWrapInDeprecateGetter;

            });

            // file: src/common/channel.js
            define("cordova/channel", function (require, exports, module) {

                var utils = require('cordova/utils');
                var nextGuid = 1;

                /**
                 * Custom pub-sub "channel" that can have functions subscribed to it
                 * This object is used to define and control firing of events for
                 * cordova initialization, as well as for custom events thereafter.
                 *
                 * The order of events during page load and Cordova startup is as follows:
                 *
                 * onDOMContentLoaded*         Internal event that is received when the web page is loaded and parsed.
                 * onNativeReady*              Internal event that indicates the Cordova native side is ready.
                 * onCordovaReady*             Internal event fired when all Cordova JavaScript objects have been created.
                 * onDeviceReady*              User event fired to indicate that Cordova is ready
                 * onResume                    User event fired to indicate a start/resume lifecycle event
                 * onPause                     User event fired to indicate a pause lifecycle event
                 *
                 * The events marked with an * are sticky. Once they have fired, they will stay in the fired state.
                 * All listeners that subscribe after the event is fired will be executed right away.
                 *
                 * The only Cordova events that user code should register for are:
                 *      deviceready           Cordova native code is initialized and Cordova APIs can be called from JavaScript
                 *      pause                 App has moved to background
                 *      resume                App has returned to foreground
                 *
                 * Listeners can be registered as:
                 *      document.addEventListener("deviceready", myDeviceReadyListener, false);
                 *      document.addEventListener("resume", myResumeListener, false);
                 *      document.addEventListener("pause", myPauseListener, false);
                 *
                 * The DOM lifecycle events should be used for saving and restoring state
                 *      window.onload
                 *      window.onunload
                 *
                 */

                /**
                 * Channel
                 * @constructor
                 * @param type  String the channel name
                 */
                var Channel = function (type, sticky) {
                    this.type = type;
                    // Map of guid -> function.
                    this.handlers = {};
                    // 0 = Non-sticky, 1 = Sticky non-fired, 2 = Sticky fired.
                    this.state = sticky ? 1 : 0;
                    // Used in sticky mode to remember args passed to fire().
                    this.fireArgs = null;
                    // Used by onHasSubscribersChange to know if there are any listeners.
                    this.numHandlers = 0;
                    // Function that is called when the first listener is subscribed, or when
                    // the last listener is unsubscribed.
                    this.onHasSubscribersChange = null;
                };
                var channel = {
                    /**
                     * Calls the provided function only after all of the channels specified
                     * have been fired. All channels must be sticky channels.
                     */
                    join: function (h, c) {
                        var len = c.length;
                        var i = len;
                        var f = function () {
                            if (!(--i)) h();
                        };
                        for (var j = 0; j < len; j++) {
                            if (c[j].state === 0) {
                                throw Error('Can only use join with sticky channels.');
                            }
                            c[j].subscribe(f);
                        }
                        if (!len) h();
                    },

                    create: function (type) {
                        return (channel[type] = new Channel(type, false));
                    },
                    createSticky: function (type) {
                        return (channel[type] = new Channel(type, true));
                    },

                    /**
                     * cordova Channels that must fire before "deviceready" is fired.
                     */
                    deviceReadyChannelsArray: [],
                    deviceReadyChannelsMap: {},

                    /**
                     * Indicate that a feature needs to be initialized before it is ready to be used.
                     * This holds up Cordova's "deviceready" event until the feature has been initialized
                     * and Cordova.initComplete(feature) is called.
                     *
                     * @param feature {String}     The unique feature name
                     */
                    waitForInitialization: function (feature) {
                        if (feature) {
                            var c = channel[feature] || this.createSticky(feature);
                            this.deviceReadyChannelsMap[feature] = c;
                            this.deviceReadyChannelsArray.push(c);
                        }
                    },

                    /**
                     * Indicate that initialization code has completed and the feature is ready to be used.
                     *
                     * @param feature {String}     The unique feature name
                     */
                    initializationComplete: function (feature) {
                        var c = this.deviceReadyChannelsMap[feature];
                        if (c) {
                            c.fire();
                        }
                    }
                };

                function checkSubscriptionArgument(argument) {
                    if (typeof argument !== 'function' && typeof argument.handleEvent !== 'function') {
                        throw new Error(
                            'Must provide a function or an EventListener object ' +
                            'implementing the handleEvent interface.'
                        );
                    }
                }

                /**
                 * Subscribes the given function to the channel. Any time that
                 * Channel.fire is called so too will the function.
                 * Optionally specify an execution context for the function
                 * and a guid that can be used to stop subscribing to the channel.
                 * Returns the guid.
                 */
                Channel.prototype.subscribe = function (eventListenerOrFunction, eventListener) {
                    checkSubscriptionArgument(eventListenerOrFunction);
                    var handleEvent, guid;

                    if (eventListenerOrFunction && typeof eventListenerOrFunction === 'object') {
                        // Received an EventListener object implementing the handleEvent interface
                        handleEvent = eventListenerOrFunction.handleEvent;
                        eventListener = eventListenerOrFunction;
                    } else {
                        // Received a function to handle event
                        handleEvent = eventListenerOrFunction;
                    }

                    if (this.state === 2) {
                        handleEvent.apply(eventListener || this, this.fireArgs);
                        return;
                    }

                    guid = eventListenerOrFunction.observer_guid;
                    if (typeof eventListener === 'object') {
                        handleEvent = utils.close(eventListener, handleEvent);
                    }

                    if (!guid) {
                        // First time any channel has seen this subscriber
                        guid = '' + nextGuid++;
                    }
                    handleEvent.observer_guid = guid;
                    eventListenerOrFunction.observer_guid = guid;

                    // Don't add the same handler more than once.
                    if (!this.handlers[guid]) {
                        this.handlers[guid] = handleEvent;
                        this.numHandlers++;
                        if (this.numHandlers === 1) {
                            this.onHasSubscribersChange && this.onHasSubscribersChange();
                        }
                    }
                };

                /**
                 * Unsubscribes the function with the given guid from the channel.
                 */
                Channel.prototype.unsubscribe = function (eventListenerOrFunction) {
                    checkSubscriptionArgument(eventListenerOrFunction);
                    var handleEvent, guid, handler;

                    if (eventListenerOrFunction && typeof eventListenerOrFunction === 'object') {
                        // Received an EventListener object implementing the handleEvent interface
                        handleEvent = eventListenerOrFunction.handleEvent;
                    } else {
                        // Received a function to handle event
                        handleEvent = eventListenerOrFunction;
                    }

                    guid = handleEvent.observer_guid;
                    handler = this.handlers[guid];
                    if (handler) {
                        delete this.handlers[guid];
                        this.numHandlers--;
                        if (this.numHandlers === 0) {
                            this.onHasSubscribersChange && this.onHasSubscribersChange();
                        }
                    }
                };

                /**
                 * Calls all functions subscribed to this channel.
                 */
                Channel.prototype.fire = function (e) {
                    var fireArgs = Array.prototype.slice.call(arguments);
                    // Apply stickiness.
                    if (this.state === 1) {
                        this.state = 2;
                        this.fireArgs = fireArgs;
                    }
                    if (this.numHandlers) {
                        // Copy the values first so that it is safe to modify it from within
                        // callbacks.
                        var toCall = [];
                        for (var item in this.handlers) {
                            toCall.push(this.handlers[item]);
                        }
                        for (var i = 0; i < toCall.length; ++i) {
                            toCall[i].apply(this, fireArgs);
                        }
                        if (this.state === 2 && this.numHandlers) {
                            this.numHandlers = 0;
                            this.handlers = {};
                            this.onHasSubscribersChange && this.onHasSubscribersChange();
                        }
                    }
                };

                // defining them here so they are ready super fast!
                // DOM event that is received when the web page is loaded and parsed.
                channel.createSticky('onDOMContentLoaded');

                // Event to indicate the Cordova native side is ready.
                channel.createSticky('onNativeReady');

                // Event to indicate that all Cordova JavaScript objects have been created
                // and it's time to run plugin constructors.
                channel.createSticky('onCordovaReady');

                // Event to indicate that all automatically loaded JS plugins are loaded and ready.
                // FIXME remove this
                channel.createSticky('onPluginsReady');

                // Event to indicate that Cordova is ready
                channel.createSticky('onDeviceReady');

                // Event to indicate a resume lifecycle event
                channel.create('onResume');

                // Event to indicate a pause lifecycle event
                channel.create('onPause');

                // Channels that must fire before "deviceready" is fired.
                channel.waitForInitialization('onCordovaReady');
                channel.waitForInitialization('onDOMContentLoaded');

                module.exports = channel;

            });

            // file: ../cordova-ios/cordova-js-src/exec.js
            define("cordova/exec", function (require, exports, module) {

                /**
                 * Creates the exec bridge used to notify the native code of
                 * commands.
                 */
                var cordova = require('cordova');
                var utils = require('cordova/utils');
                var base64 = require('cordova/base64');

                function massageArgsJsToNative(args) {
                    if (!args || utils.typeName(args) !== 'Array') {
                        return args;
                    }
                    var ret = [];
                    args.forEach(function (arg, i) {
                        if (utils.typeName(arg) === 'ArrayBuffer') {
                            ret.push({
                                CDVType: 'ArrayBuffer',
                                data: base64.fromArrayBuffer(arg)
                            });
                        } else {
                            ret.push(arg);
                        }
                    });
                    return ret;
                }

                function massageMessageNativeToJs(message) {
                    if (message.CDVType === 'ArrayBuffer') {
                        var stringToArrayBuffer = function (str) {
                            var ret = new Uint8Array(str.length);
                            for (var i = 0; i < str.length; i++) {
                                ret[i] = str.charCodeAt(i);
                            }
                            return ret.buffer;
                        };
                        var base64ToArrayBuffer = function (b64) {
                            return stringToArrayBuffer(atob(b64)); // eslint-disable-line no-undef
                        };
                        message = base64ToArrayBuffer(message.data);
                    }
                    return message;
                }

                function convertMessageToArgsNativeToJs(message) {
                    var args = [];
                    if (!message || !Object.prototype.hasOwnProperty.call(message, 'CDVType')) {
                        args.push(message);
                    } else if (message.CDVType === 'MultiPart') {
                        message.messages.forEach(function (e) {
                            args.push(massageMessageNativeToJs(e));
                        });
                    } else {
                        args.push(massageMessageNativeToJs(message));
                    }
                    return args;
                }

                var iOSExec = function () {
                    var successCallback, failCallback, service, action, actionArgs;
                    var callbackId = null;
                    if (typeof arguments[0] !== 'string') {
                        // FORMAT ONE
                        successCallback = arguments[0];
                        failCallback = arguments[1];
                        service = arguments[2];
                        action = arguments[3];
                        actionArgs = arguments[4];

                        // Since we need to maintain backwards compatibility, we have to pass
                        // an invalid callbackId even if no callback was provided since plugins
                        // will be expecting it. The Cordova.exec() implementation allocates
                        // an invalid callbackId and passes it even if no callbacks were given.
                        callbackId = 'INVALID';
                    } else {
                        throw new Error('The old format of this exec call has been removed (deprecated since 2.1). Change to: ' + // eslint-disable-line
                            'cordova.exec(null, null, \'Service\', \'action\', [ arg1, arg2 ]);');
                    }

                    // If actionArgs is not provided, default to an empty array
                    actionArgs = actionArgs || [];

                    // Register the callbacks and add the callbackId to the positional
                    // arguments if given.
                    if (successCallback || failCallback) {
                        callbackId = service + cordova.callbackId++;
                        cordova.callbacks[callbackId] =
                            { success: successCallback, fail: failCallback };
                    }

                    actionArgs = massageArgsJsToNative(actionArgs);

                    // CB-10133 DataClone DOM Exception 25 guard (fast function remover)
                    var command = [callbackId, service, action, JSON.parse(JSON.stringify(actionArgs))];
                    window.webkit.messageHandlers.cordova.postMessage(command);
                };

                iOSExec.nativeCallback = function (callbackId, status, message, keepCallback, debug) {
                    var success = status === 0 || status === 1;
                    var args = convertMessageToArgsNativeToJs(message);
                    Promise.resolve().then(function () {
                        cordova.callbackFromNative(callbackId, success, status, args, keepCallback); // eslint-disable-line
                    });
                };

                // for backwards compatibility
                iOSExec.nativeEvalAndFetch = function (func) {
                    try {
                        func();
                    } catch (e) {
                        console.log(e);
                    }
                };

                // Proxy the exec for bridge changes. See CB-10106

                function cordovaExec() {
                    var cexec = require('cordova/exec');
                    var cexec_valid = (typeof cexec.nativeFetchMessages === 'function') && (typeof cexec.nativeEvalAndFetch === 'function') && (typeof cexec.nativeCallback === 'function');
                    return (cexec_valid && execProxy !== cexec) ? cexec : iOSExec;
                }

                function execProxy() {
                    cordovaExec().apply(null, arguments);
                }

                execProxy.nativeFetchMessages = function () {
                    return cordovaExec().nativeFetchMessages.apply(null, arguments);
                };

                execProxy.nativeEvalAndFetch = function () {
                    return cordovaExec().nativeEvalAndFetch.apply(null, arguments);
                };

                execProxy.nativeCallback = function () {
                    return cordovaExec().nativeCallback.apply(null, arguments);
                };

                module.exports = execProxy;

            });

            // file: src/common/exec/proxy.js
            define("cordova/exec/proxy", function (require, exports, module) {

                // internal map of proxy function
                var CommandProxyMap = {};

                module.exports = {

                    // example: cordova.commandProxy.add("Accelerometer",{getCurrentAcceleration: function(successCallback, errorCallback, options) {...},...);
                    add: function (id, proxyObj) {
                        console.log('adding proxy for ' + id);
                        CommandProxyMap[id] = proxyObj;
                        return proxyObj;
                    },

                    // cordova.commandProxy.remove("Accelerometer");
                    remove: function (id) {
                        var proxy = CommandProxyMap[id];
                        delete CommandProxyMap[id];
                        CommandProxyMap[id] = null;
                        return proxy;
                    },

                    get: function (service, action) {
                        return (CommandProxyMap[service] ? CommandProxyMap[service][action] : null);
                    }
                };

            });

            // file: src/common/init.js
            define("cordova/init", function (require, exports, module) {

                var channel = require('cordova/channel');
                var cordova = require('cordova');
                var modulemapper = require('cordova/modulemapper');
                var platform = require('cordova/platform');
                var pluginloader = require('cordova/pluginloader');

                var platformInitChannelsArray = [channel.onNativeReady, channel.onPluginsReady];

                function logUnfiredChannels(arr) {
                    for (var i = 0; i < arr.length; ++i) {
                        if (arr[i].state !== 2) {
                            console.log('Channel not fired: ' + arr[i].type);
                        }
                    }
                }

                window.setTimeout(function () {
                    if (channel.onDeviceReady.state !== 2) {
                        console.log('deviceready has not fired after 5 seconds.');
                        logUnfiredChannels(platformInitChannelsArray);
                        logUnfiredChannels(channel.deviceReadyChannelsArray);
                    }
                }, 5000);

                if (!window.console) {
                    window.console = {
                        log: function () { }
                    };
                }
                if (!window.console.warn) {
                    window.console.warn = function (msg) {
                        this.log('warn: ' + msg);
                    };
                }

                // Register pause, resume and deviceready channels as events on document.
                channel.onPause = cordova.addDocumentEventHandler('pause');
                channel.onResume = cordova.addDocumentEventHandler('resume');
                channel.onActivated = cordova.addDocumentEventHandler('activated');
                channel.onDeviceReady = cordova.addStickyDocumentEventHandler('deviceready');

                // Listen for DOMContentLoaded and notify our channel subscribers.
                if (document.readyState === 'complete' || document.readyState === 'interactive') {
                    channel.onDOMContentLoaded.fire();
                } else {
                    document.addEventListener('DOMContentLoaded', function () {
                        channel.onDOMContentLoaded.fire();
                    }, false);
                }

                // _nativeReady is global variable that the native side can set
                // to signify that the native code is ready. It is a global since
                // it may be called before any cordova JS is ready.
                if (window._nativeReady) {
                    channel.onNativeReady.fire();
                }

                modulemapper.clobbers('cordova', 'cordova');
                modulemapper.clobbers('cordova/exec', 'cordova.exec');
                modulemapper.clobbers('cordova/exec', 'Cordova.exec');

                // Call the platform-specific initialization.
                platform.bootstrap && platform.bootstrap();

                // Wrap in a setTimeout to support the use-case of having plugin JS appended to cordova.js.
                // The delay allows the attached modules to be defined before the plugin loader looks for them.
                setTimeout(function () {
                    pluginloader.load(function () {
                        channel.onPluginsReady.fire();
                    });
                }, 0);

                /**
                 * Create all cordova objects once native side is ready.
                 */
                channel.join(function () {
                    modulemapper.mapModules(window);

                    platform.initialize && platform.initialize();

                    // Fire event to notify that all objects are created
                    channel.onCordovaReady.fire();

                    // Fire onDeviceReady event once page has fully loaded, all
                    // constructors have run and cordova info has been received from native
                    // side.
                    channel.join(function () {
                        require('cordova').fireDocumentEvent('deviceready');
                    }, channel.deviceReadyChannelsArray);
                }, platformInitChannelsArray);

            });

            // file: src/common/modulemapper.js
            define("cordova/modulemapper", function (require, exports, module) {

                var builder = require('cordova/builder');
                var moduleMap = define.moduleMap;
                var symbolList;
                var deprecationMap;

                exports.reset = function () {
                    symbolList = [];
                    deprecationMap = {};
                };

                function addEntry(strategy, moduleName, symbolPath, opt_deprecationMessage) {
                    if (!(moduleName in moduleMap)) {
                        throw new Error('Module ' + moduleName + ' does not exist.');
                    }
                    symbolList.push(strategy, moduleName, symbolPath);
                    if (opt_deprecationMessage) {
                        deprecationMap[symbolPath] = opt_deprecationMessage;
                    }
                }

                // Note: Android 2.3 does have Function.bind().
                exports.clobbers = function (moduleName, symbolPath, opt_deprecationMessage) {
                    addEntry('c', moduleName, symbolPath, opt_deprecationMessage);
                };

                exports.merges = function (moduleName, symbolPath, opt_deprecationMessage) {
                    addEntry('m', moduleName, symbolPath, opt_deprecationMessage);
                };

                exports.defaults = function (moduleName, symbolPath, opt_deprecationMessage) {
                    addEntry('d', moduleName, symbolPath, opt_deprecationMessage);
                };

                exports.runs = function (moduleName) {
                    addEntry('r', moduleName, null);
                };

                function prepareNamespace(symbolPath, context) {
                    if (!symbolPath) {
                        return context;
                    }
                    return symbolPath.split('.').reduce(function (cur, part) {
                        return (cur[part] = cur[part] || {});
                    }, context);
                }

                exports.mapModules = function (context) {
                    var origSymbols = {};
                    context.CDV_origSymbols = origSymbols;
                    for (var i = 0, len = symbolList.length; i < len; i += 3) {
                        var strategy = symbolList[i];
                        var moduleName = symbolList[i + 1];
                        var module = require(moduleName);
                        // <runs/>
                        if (strategy === 'r') {
                            continue;
                        }
                        var symbolPath = symbolList[i + 2];
                        var lastDot = symbolPath.lastIndexOf('.');
                        var namespace = symbolPath.substr(0, lastDot);
                        var lastName = symbolPath.substr(lastDot + 1);

                        var deprecationMsg = symbolPath in deprecationMap ? 'Access made to deprecated symbol: ' + symbolPath + '. ' + deprecationMsg : null;
                        var parentObj = prepareNamespace(namespace, context);
                        var target = parentObj[lastName];

                        if (strategy === 'm' && target) {
                            builder.recursiveMerge(target, module);
                        } else if ((strategy === 'd' && !target) || (strategy !== 'd')) {
                            if (!(symbolPath in origSymbols)) {
                                origSymbols[symbolPath] = target;
                            }
                            builder.assignOrWrapInDeprecateGetter(parentObj, lastName, module, deprecationMsg);
                        }
                    }
                };

                exports.getOriginalSymbol = function (context, symbolPath) {
                    var origSymbols = context.CDV_origSymbols;
                    if (origSymbols && (symbolPath in origSymbols)) {
                        return origSymbols[symbolPath];
                    }
                    var parts = symbolPath.split('.');
                    var obj = context;
                    for (var i = 0; i < parts.length; ++i) {
                        obj = obj && obj[parts[i]];
                    }
                    return obj;
                };

                exports.reset();

            });

            // file: ../cordova-ios/cordova-js-src/platform.js
            define("cordova/platform", function (require, exports, module) {

                module.exports = {
                    id: 'ios',
                    bootstrap: function () {
                        // Attach the console polyfill that is iOS-only to window.console
                        // see the file under plugin/ios/console.js
                        require('cordova/modulemapper').clobbers('cordova/plugin/ios/console', 'window.console');

                        // Attach the wkwebkit utility to window.WkWebView
                        // see the file under plugin/ios/wkwebkit.js
                        require('cordova/modulemapper').clobbers('cordova/plugin/ios/wkwebkit', 'window.WkWebView');

                        // Attach the splashscreen utility to window.navigator.splashscreen
                        // see the file under plugin/ios/launchscreen.js
                        require('cordova/modulemapper').clobbers('cordova/plugin/ios/launchscreen', 'navigator.splashscreen');

                        require('cordova/channel').onNativeReady.fire();
                    }
                };

            });

            // file: ../cordova-ios/cordova-js-src/plugin/ios/console.js
            define("cordova/plugin/ios/console", function (require, exports, module) {

                // ------------------------------------------------------------------------------

                var logger = require('cordova/plugin/ios/logger');

                // ------------------------------------------------------------------------------
                // object that we're exporting
                // ------------------------------------------------------------------------------
                var console = module.exports;

                // ------------------------------------------------------------------------------
                // copy of the original console object
                // ------------------------------------------------------------------------------
                var WinConsole = window.console;

                // ------------------------------------------------------------------------------
                // whether to use the logger
                // ------------------------------------------------------------------------------
                var UseLogger = false;

                // ------------------------------------------------------------------------------
                // Timers
                // ------------------------------------------------------------------------------
                var Timers = {};

                // ------------------------------------------------------------------------------
                // used for unimplemented methods
                // ------------------------------------------------------------------------------
                function noop() { }

                // ------------------------------------------------------------------------------
                // used for unimplemented methods
                // ------------------------------------------------------------------------------
                console.useLogger = function (value) {
                    if (arguments.length) UseLogger = !!value;

                    if (UseLogger) {
                        if (logger.useConsole()) {
                            throw new Error('console and logger are too intertwingly');
                        }
                    }

                    return UseLogger;
                };

                // ------------------------------------------------------------------------------
                console.log = function () {
                    if (logger.useConsole()) return;
                    logger.log.apply(logger, [].slice.call(arguments));
                };

                // ------------------------------------------------------------------------------
                console.error = function () {
                    if (logger.useConsole()) return;
                    logger.error.apply(logger, [].slice.call(arguments));
                };

                // ------------------------------------------------------------------------------
                console.warn = function () {
                    if (logger.useConsole()) return;
                    logger.warn.apply(logger, [].slice.call(arguments));
                };

                // ------------------------------------------------------------------------------
                console.info = function () {
                    if (logger.useConsole()) return;
                    logger.info.apply(logger, [].slice.call(arguments));
                };

                // ------------------------------------------------------------------------------
                console.debug = function () {
                    if (logger.useConsole()) return;
                    logger.debug.apply(logger, [].slice.call(arguments));
                };

                // ------------------------------------------------------------------------------
                console.assert = function (expression) {
                    if (expression) return;

                    var message = logger.format.apply(logger.format, [].slice.call(arguments, 1));
                    console.log('ASSERT: ' + message);
                };

                // ------------------------------------------------------------------------------
                console.clear = function () { };

                // ------------------------------------------------------------------------------
                console.dir = function (object) {
                    console.log('%o', object);
                };

                // ------------------------------------------------------------------------------
                console.dirxml = function (node) {
                    console.log(node.innerHTML);
                };

                // ------------------------------------------------------------------------------
                console.trace = noop;

                // ------------------------------------------------------------------------------
                console.group = console.log;

                // ------------------------------------------------------------------------------
                console.groupCollapsed = console.log;

                // ------------------------------------------------------------------------------
                console.groupEnd = noop;

                // ------------------------------------------------------------------------------
                console.time = function (name) {
                    Timers[name] = new Date().valueOf();
                };

                // ------------------------------------------------------------------------------
                console.timeEnd = function (name) {
                    var timeStart = Timers[name];
                    if (!timeStart) {
                        console.warn('unknown timer: ' + name);
                        return;
                    }

                    var timeElapsed = new Date().valueOf() - timeStart;
                    console.log(name + ': ' + timeElapsed + 'ms');
                };

                // ------------------------------------------------------------------------------
                console.timeStamp = noop;

                // ------------------------------------------------------------------------------
                console.profile = noop;

                // ------------------------------------------------------------------------------
                console.profileEnd = noop;

                // ------------------------------------------------------------------------------
                console.count = noop;

                // ------------------------------------------------------------------------------
                console.exception = console.log;

                // ------------------------------------------------------------------------------
                console.table = function (data, columns) {
                    console.log('%o', data);
                };

                // ------------------------------------------------------------------------------
                // return a new function that calls both functions passed as args
                // ------------------------------------------------------------------------------
                function wrappedOrigCall(orgFunc, newFunc) {
                    return function () {
                        var args = [].slice.call(arguments);
                        try { orgFunc.apply(WinConsole, args); } catch (e) { }
                        try { newFunc.apply(console, args); } catch (e) { }
                    };
                }

                // ------------------------------------------------------------------------------
                // For every function that exists in the original console object, that
                // also exists in the new console object, wrap the new console method
                // with one that calls both
                // ------------------------------------------------------------------------------
                for (var key in console) {
                    if (typeof WinConsole[key] === 'function') {
                        console[key] = wrappedOrigCall(WinConsole[key], console[key]);
                    }
                }

            });

            // file: ../cordova-ios/cordova-js-src/plugin/ios/launchscreen.js
            define("cordova/plugin/ios/launchscreen", function (require, exports, module) {

                var exec = require('cordova/exec');

                var launchscreen = {
                    show: function () {
                        exec(null, null, 'LaunchScreen', 'show', []);
                    },
                    hide: function () {
                        exec(null, null, 'LaunchScreen', 'hide', []);
                    }
                };

                module.exports = launchscreen;

            });

            // file: ../cordova-ios/cordova-js-src/plugin/ios/logger.js
            define("cordova/plugin/ios/logger", function (require, exports, module) {

                // ------------------------------------------------------------------------------
                // The logger module exports the following properties/functions:
                //
                // LOG                          - constant for the level LOG
                // ERROR                        - constant for the level ERROR
                // WARN                         - constant for the level WARN
                // INFO                         - constant for the level INFO
                // DEBUG                        - constant for the level DEBUG
                // logLevel()                   - returns current log level
                // logLevel(value)              - sets and returns a new log level
                // useConsole()                 - returns whether logger is using console
                // useConsole(value)            - sets and returns whether logger is using console
                // log(message,...)             - logs a message at level LOG
                // error(message,...)           - logs a message at level ERROR
                // warn(message,...)            - logs a message at level WARN
                // info(message,...)            - logs a message at level INFO
                // debug(message,...)           - logs a message at level DEBUG
                // logLevel(level,message,...)  - logs a message specified level
                //
                // ------------------------------------------------------------------------------

                var logger = exports;

                var exec = require('cordova/exec');

                var UseConsole = false;
                var UseLogger = true;
                var Queued = [];
                var DeviceReady = false;
                var CurrentLevel;

                var originalConsole = console;

                /**
                 * Logging levels
                 */

                var Levels = [
                    'LOG',
                    'ERROR',
                    'WARN',
                    'INFO',
                    'DEBUG'
                ];

                /*
                 * add the logging levels to the logger object and
                 * to a separate levelsMap object for testing
                 */

                var LevelsMap = {};
                for (var i = 0; i < Levels.length; i++) {
                    var level = Levels[i];
                    LevelsMap[level] = i;
                    logger[level] = level;
                }

                CurrentLevel = LevelsMap.WARN;

                /**
                 * Getter/Setter for the logging level
                 *
                 * Returns the current logging level.
                 *
                 * When a value is passed, sets the logging level to that value.
                 * The values should be one of the following constants:
                 *    logger.LOG
                 *    logger.ERROR
                 *    logger.WARN
                 *    logger.INFO
                 *    logger.DEBUG
                 *
                 * The value used determines which messages get printed.  The logging
                 * values above are in order, and only messages logged at the logging
                 * level or above will actually be displayed to the user.  E.g., the
                 * default level is WARN, so only messages logged with LOG, ERROR, or
                 * WARN will be displayed; INFO and DEBUG messages will be ignored.
                 */
                logger.level = function (value) {
                    if (arguments.length) {
                        if (LevelsMap[value] === null) {
                            throw new Error('invalid logging level: ' + value);
                        }
                        CurrentLevel = LevelsMap[value];
                    }

                    return Levels[CurrentLevel];
                };

                /**
                 * Getter/Setter for the useConsole functionality
                 *
                 * When useConsole is true, the logger will log via the
                 * browser 'console' object.
                 */
                logger.useConsole = function (value) {
                    if (arguments.length) UseConsole = !!value;

                    if (UseConsole) {
                        if (typeof console === 'undefined') {
                            throw new Error('global console object is not defined');
                        }

                        if (typeof console.log !== 'function') {
                            throw new Error('global console object does not have a log function');
                        }

                        if (typeof console.useLogger === 'function') {
                            if (console.useLogger()) {
                                throw new Error('console and logger are too intertwingly');
                            }
                        }
                    }

                    return UseConsole;
                };

                /**
                 * Getter/Setter for the useLogger functionality
                 *
                 * When useLogger is true, the logger will log via the
                 * native Logger plugin.
                 */
                logger.useLogger = function (value) {
                    // Enforce boolean
                    if (arguments.length) UseLogger = !!value;
                    return UseLogger;
                };

                /**
                 * Logs a message at the LOG level.
                 *
                 * Parameters passed after message are used applied to
                 * the message with utils.format()
                 */
                logger.log = function (message) { logWithArgs('LOG', arguments); };

                /**
                 * Logs a message at the ERROR level.
                 *
                 * Parameters passed after message are used applied to
                 * the message with utils.format()
                 */
                logger.error = function (message) { logWithArgs('ERROR', arguments); };

                /**
                 * Logs a message at the WARN level.
                 *
                 * Parameters passed after message are used applied to
                 * the message with utils.format()
                 */
                logger.warn = function (message) { logWithArgs('WARN', arguments); };

                /**
                 * Logs a message at the INFO level.
                 *
                 * Parameters passed after message are used applied to
                 * the message with utils.format()
                 */
                logger.info = function (message) { logWithArgs('INFO', arguments); };

                /**
                 * Logs a message at the DEBUG level.
                 *
                 * Parameters passed after message are used applied to
                 * the message with utils.format()
                 */
                logger.debug = function (message) { logWithArgs('DEBUG', arguments); };

                // log at the specified level with args
                function logWithArgs(level, args) {
                    args = [level].concat([].slice.call(args));
                    logger.logLevel.apply(logger, args);
                }

                // return the correct formatString for an object
                function formatStringForMessage(message) {
                    return (typeof message === 'string') ? '' : '%o';
                }

                /**
                 * Logs a message at the specified level.
                 *
                 * Parameters passed after message are used applied to
                 * the message with utils.format()
                 */
                logger.logLevel = function (level /* , ... */) {
                    // format the message with the parameters
                    var formatArgs = [].slice.call(arguments, 1);
                    var fmtString = formatStringForMessage(formatArgs[0]);
                    if (fmtString.length > 0) {
                        formatArgs.unshift(fmtString); // add formatString
                    }

                    var message = logger.format.apply(logger.format, formatArgs);

                    if (LevelsMap[level] === null) {
                        throw new Error('invalid logging level: ' + level);
                    }

                    if (LevelsMap[level] > CurrentLevel) return;

                    // queue the message if not yet at deviceready
                    if (!DeviceReady && !UseConsole) {
                        Queued.push([level, message]);
                        return;
                    }

                    // Log using the native logger if that is enabled
                    if (UseLogger) {
                        exec(null, null, 'Console', 'logLevel', [level, message]);
                    }

                    // Log using the console if that is enabled
                    if (UseConsole) {
                        // make sure console is not using logger
                        if (console.useLogger()) {
                            throw new Error('console and logger are too intertwingly');
                        }

                        // log to the console
                        switch (level) {
                            case logger.LOG: originalConsole.log(message); break;
                            case logger.ERROR: originalConsole.log('ERROR: ' + message); break;
                            case logger.WARN: originalConsole.log('WARN: ' + message); break;
                            case logger.INFO: originalConsole.log('INFO: ' + message); break;
                            case logger.DEBUG: originalConsole.log('DEBUG: ' + message); break;
                        }
                    }
                };

                /**
                 * Formats a string and arguments following it ala console.log()
                 *
                 * Any remaining arguments will be appended to the formatted string.
                 *
                 * for rationale, see FireBug's Console API:
                 *    http://getfirebug.com/wiki/index.php/Console_API
                 */
                logger.format = function (formatString, args) {
                    return __format(arguments[0], [].slice.call(arguments, 1)).join(' ');
                };

                // ------------------------------------------------------------------------------
                /**
                 * Formats a string and arguments following it ala vsprintf()
                 *
                 * format chars:
                 *   %j - format arg as JSON
                 *   %o - format arg as JSON
                 *   %c - format arg as ''
                 *   %% - replace with '%'
                 * any other char following % will format it's
                 * arg via toString().
                 *
                 * Returns an array containing the formatted string and any remaining
                 * arguments.
                 */
                function __format(formatString, args) {
                    if (formatString === null || formatString === undefined) return [''];
                    if (arguments.length === 1) return [formatString.toString()];

                    if (typeof formatString !== 'string') { formatString = formatString.toString(); }

                    var pattern = /(.*?)%(.)(.*)/;
                    var rest = formatString;
                    var result = [];

                    while (args.length) {
                        var match = pattern.exec(rest);
                        if (!match) break;

                        var arg = args.shift();
                        rest = match[3];
                        result.push(match[1]);

                        if (match[2] === '%') {
                            result.push('%');
                            args.unshift(arg);
                            continue;
                        }

                        result.push(__formatted(arg, match[2]));
                    }

                    result.push(rest);

                    var remainingArgs = [].slice.call(args);
                    remainingArgs.unshift(result.join(''));
                    return remainingArgs;
                }

                function __formatted(object, formatChar) {
                    try {
                        switch (formatChar) {
                            case 'j':
                            case 'o': return JSON.stringify(object);
                            case 'c': return '';
                        }
                    } catch (e) {
                        return 'error JSON.stringify()ing argument: ' + e;
                    }

                    if ((object === null) || (object === undefined)) {
                        return Object.prototype.toString.call(object);
                    }

                    return object.toString();
                }

                // ------------------------------------------------------------------------------
                // when deviceready fires, log queued messages
                logger.__onDeviceReady = function () {
                    if (DeviceReady) return;

                    DeviceReady = true;

                    for (var i = 0; i < Queued.length; i++) {
                        var messageArgs = Queued[i];
                        logger.logLevel(messageArgs[0], messageArgs[1]);
                    }

                    Queued = null;
                };

                // add a deviceready event to log queued messages
                document.addEventListener('deviceready', logger.__onDeviceReady, false);

            });

            // file: ../cordova-ios/cordova-js-src/plugin/ios/wkwebkit.js
            define("cordova/plugin/ios/wkwebkit", function (require, exports, module) {

                var exec = require('cordova/exec');

                var WkWebKit = {
                    allowsBackForwardNavigationGestures: function (allow) {
                        exec(null, null, 'CDVWebViewEngine', 'allowsBackForwardNavigationGestures', [allow]);
                    },
                    convertFilePath: function (path) {
                        if (!path || !window.CDV_ASSETS_URL) {
                            return path;
                        }
                        if (path.startsWith('/')) {
                            return window.CDV_ASSETS_URL + '/_app_file_' + path;
                        }
                        if (path.startsWith('file://')) {
                            return window.CDV_ASSETS_URL + path.replace('file://', '/_app_file_');
                        }
                        return path;
                    }
                };

                module.exports = WkWebKit;

            });

            // file: src/common/urlutil.js
            define("cordova/urlutil", function (require, exports, module) {

                /**
                 * For already absolute URLs, returns what is passed in.
                 * For relative URLs, converts them to absolute ones.
                 */
                exports.makeAbsolute = function makeAbsolute(url) {
                    var anchorEl = document.createElement('a');
                    anchorEl.href = url;
                    return anchorEl.href;
                };

            });

            // file: src/common/utils.js
            define("cordova/utils", function (require, exports, module) {

                var utils = exports;

                /**
                 * Defines a property getter / setter for obj[key].
                 */
                utils.defineGetterSetter = function (obj, key, getFunc, opt_setFunc) {
                    if (Object.defineProperty) {
                        var desc = {
                            get: getFunc,
                            configurable: true
                        };
                        if (opt_setFunc) {
                            desc.set = opt_setFunc;
                        }
                        Object.defineProperty(obj, key, desc);
                    } else {
                        obj.__defineGetter__(key, getFunc);
                        if (opt_setFunc) {
                            obj.__defineSetter__(key, opt_setFunc);
                        }
                    }
                };

                /**
                 * Defines a property getter for obj[key].
                 */
                utils.defineGetter = utils.defineGetterSetter;

                utils.arrayIndexOf = function (a, item) {
                    if (a.indexOf) {
                        return a.indexOf(item);
                    }
                    var len = a.length;
                    for (var i = 0; i < len; ++i) {
                        if (a[i] === item) {
                            return i;
                        }
                    }
                    return -1;
                };

                /**
                 * Returns whether the item was found in the array.
                 */
                utils.arrayRemove = function (a, item) {
                    var index = utils.arrayIndexOf(a, item);
                    if (index !== -1) {
                        a.splice(index, 1);
                    }
                    return index !== -1;
                };

                utils.typeName = function (val) {
                    return Object.prototype.toString.call(val).slice(8, -1);
                };

                /**
                 * Returns an indication of whether the argument is an array or not
                 */
                utils.isArray = Array.isArray ||
                    function (a) { return utils.typeName(a) === 'Array'; };

                /**
                 * Returns an indication of whether the argument is a Date or not
                 */
                utils.isDate = function (d) {
                    return (d instanceof Date);
                };

                /**
                 * Does a deep clone of the object.
                 */
                utils.clone = function (obj) {
                    if (!obj || typeof obj === 'function' || utils.isDate(obj) || typeof obj !== 'object') {
                        return obj;
                    }

                    var retVal, i;

                    if (utils.isArray(obj)) {
                        retVal = [];
                        for (i = 0; i < obj.length; ++i) {
                            retVal.push(utils.clone(obj[i]));
                        }
                        return retVal;
                    }

                    retVal = {};
                    for (i in obj) {
                        // 'unknown' type may be returned in custom protocol activation case on
                        // Windows Phone 8.1 causing "No such interface supported" exception on
                        // cloning (https://issues.apache.org/jira/browse/CB-11522)
                        // eslint-disable-next-line valid-typeof
                        if ((!(i in retVal) || retVal[i] !== obj[i]) && typeof obj[i] !== 'undefined' && typeof obj[i] !== 'unknown') {
                            retVal[i] = utils.clone(obj[i]);
                        }
                    }
                    return retVal;
                };

                /**
                 * Returns a wrapped version of the function
                 */
                utils.close = function (context, func, params) {
                    return function () {
                        var args = params || arguments;
                        return func.apply(context, args);
                    };
                };

                // ------------------------------------------------------------------------------
                function UUIDcreatePart(length) {
                    var uuidpart = '';
                    for (var i = 0; i < length; i++) {
                        var uuidchar = parseInt((Math.random() * 256), 10).toString(16);
                        if (uuidchar.length === 1) {
                            uuidchar = '0' + uuidchar;
                        }
                        uuidpart += uuidchar;
                    }
                    return uuidpart;
                }

                /**
                 * Create a UUID
                 */
                utils.createUUID = function () {
                    return UUIDcreatePart(4) + '-' +
                        UUIDcreatePart(2) + '-' +
                        UUIDcreatePart(2) + '-' +
                        UUIDcreatePart(2) + '-' +
                        UUIDcreatePart(6);
                };

                /**
                 * Extends a child object from a parent object using classical inheritance
                 * pattern.
                 */
                utils.extend = (function () {
                    // proxy used to establish prototype chain
                    var F = function () { };
                    // extend Child from Parent
                    return function (Child, Parent) {
                        F.prototype = Parent.prototype;
                        Child.prototype = new F();
                        Child.__super__ = Parent.prototype;
                        Child.prototype.constructor = Child;
                    };
                }());

                /**
                 * Alerts a message in any available way: alert or console.log.
                 */
                utils.alert = function (msg) {
                    if (window.alert) {
                        window.alert(msg);
                    } else if (console && console.log) {
                        console.log(msg);
                    }
                };

            });

            //插件整合

            // file:../plugins/cordova-plugin-battery-status/battery.js
            define("cordova-plugin-battery-status.battery", function (require, exports, module) {
                /**
                 * This class contains information about the current battery status.
                 * @constructor
                 */
                var cordova = require('cordova');
                var exec = require('cordova/exec');

                var STATUS_CRITICAL = 5;
                var STATUS_LOW = 20;

                var Battery = function () {
                    this._level = null;
                    this._isPlugged = null;
                    // Create new event handlers on the window (returns a channel instance)
                    this.channels = {
                        batterystatus: cordova.addWindowEventHandler('batterystatus'),
                        batterylow: cordova.addWindowEventHandler('batterylow'),
                        batterycritical: cordova.addWindowEventHandler('batterycritical')
                    };
                    for (var key in this.channels) {
                        this.channels[key].onHasSubscribersChange = Battery.onHasSubscribersChange;
                    }
                };

                function handlers() {
                    return battery.channels.batterystatus.numHandlers +
                        battery.channels.batterylow.numHandlers +
                        battery.channels.batterycritical.numHandlers;
                }

                /**
                 * Event handlers for when callbacks get registered for the battery.
                 * Keep track of how many handlers we have so we can start and stop the native battery listener
                 * appropriately (and hopefully save on battery life!).
                 */
                Battery.onHasSubscribersChange = function () {
                    // If we just registered the first handler, make sure native listener is started.
                    if (this.numHandlers === 1 && handlers() === 1) {
                        exec(battery._status, battery._error, 'Battery', 'start', []);
                    } else if (handlers() === 0) {
                        exec(null, null, 'Battery', 'stop', []);
                    }
                };

                /**
                 * Callback for battery status
                 *
                 * @param {Object} info            keys: level, isPlugged
                 */
                Battery.prototype._status = function (info) {

                    if (info) {
                        if (battery._level !== info.level || battery._isPlugged !== info.isPlugged) {

                            if (info.level === null && battery._level !== null) {
                                return; // special case where callback is called because we stopped listening to the native side.
                            }

                            // Something changed. Fire batterystatus event
                            cordova.fireWindowEvent('batterystatus', info);

                            if (!info.isPlugged) { // do not fire low/critical if we are charging. issue: CB-4520
                                // note the following are NOT exact checks, as we want to catch a transition from
                                // above the threshold to below. issue: CB-4519
                                if (battery._level > STATUS_CRITICAL && info.level <= STATUS_CRITICAL) {
                                    // Fire critical battery event
                                    cordova.fireWindowEvent('batterycritical', info);
                                } else if (battery._level > STATUS_LOW && info.level <= STATUS_LOW) {
                                    // Fire low battery event
                                    cordova.fireWindowEvent('batterylow', info);
                                }
                            }
                            battery._level = info.level;
                            battery._isPlugged = info.isPlugged;
                        }
                    }
                };

                /**
                 * Error callback for battery start
                 */
                Battery.prototype._error = function (e) {
                    console.log('Error initializing Battery: ' + e);
                };

                var battery = new Battery(); // jshint ignore:line

                module.exports = battery;

            });

            // file:../plugins/cordova-plugin-camera/ios/CameraPopoverHandle.js
            define("cordova-plugin-camera.CameraPopoverHandle", function (require, exports, module) {

                var exec = require('cordova/exec');

                /**
                 * @namespace navigator
                 */

                /**
                 * A handle to an image picker popover.
                 *
                 * __Supported Platforms__
                 *
                 * - iOS
                 *
                 * @example
                 * navigator.camera.getPicture(onSuccess, onFail,
                 * {
                 *     destinationType: Camera.DestinationType.FILE_URI,
                 *     sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                 *     popoverOptions: new CameraPopoverOptions(300, 300, 100, 100, Camera.PopoverArrowDirection.ARROW_ANY, 300, 600)
                 * });
                 *
                 * // Reposition the popover if the orientation changes.
                 * window.onorientationchange = function() {
                 *     var cameraPopoverHandle = new CameraPopoverHandle();
                 *     var cameraPopoverOptions = new CameraPopoverOptions(0, 0, 100, 100, Camera.PopoverArrowDirection.ARROW_ANY, 400, 500);
                 *     cameraPopoverHandle.setPosition(cameraPopoverOptions);
                 * }
                 * @module CameraPopoverHandle
                 */
                var CameraPopoverHandle = function () {
                    /**
                     * Can be used to reposition the image selection dialog,
                     * for example, when the device orientation changes.
                     * @memberof CameraPopoverHandle
                     * @instance
                     * @method setPosition
                     * @param {module:CameraPopoverOptions} popoverOptions
                     */
                    this.setPosition = function (popoverOptions) {
                        var args = [popoverOptions];
                        exec(null, null, 'Camera', 'repositionPopover', args);
                    };
                };

                module.exports = CameraPopoverHandle;

            });

            // file:../plugins/cordova-plugin-camera/Camera.js
            define("cordova-plugin-camera.camera", function (require, exports, module) {

                var argscheck = require('cordova/argscheck');
                var exec = require('cordova/exec');
                var Camera = require('./Camera');
                // XXX: commented out
                var CameraPopoverHandle = require('./CameraPopoverHandle');

                /**
                 * @namespace navigator
                 */

                /**
                 * @exports camera
                 */
                var cameraExport = {};

                // Tack on the Camera Constants to the base camera plugin.
                for (var key in Camera) {
                    cameraExport[key] = Camera[key];
                }

                /**
                 * Callback function that provides an error message.
                 * @callback module:camera.onError
                 * @param {string} message - The message is provided by the device's native code.
                 */

                /**
                 * Callback function that provides the image data.
                 * @callback module:camera.onSuccess
                 * @param {string} imageData - Base64 encoding of the image data, _or_ the image file URI, depending on [`cameraOptions`]{@link module:camera.CameraOptions} in effect.
                 * @example
                 * // Show image
                 * //
                 * function cameraCallback(imageData) {
                 *    var image = document.getElementById('myImage');
                 *    image.src = "data:image/jpeg;base64," + imageData;
                 * }
                 */

                /**
                 * Optional parameters to customize the camera settings.
                 * * [Quirks](#CameraOptions-quirks)
                 * @typedef module:camera.CameraOptions
                 * @type {Object}
                 * @property {number} [quality=50] - Quality of the saved image, expressed as a range of 0-100, where 100 is typically full resolution with no loss from file compression. (Note that information about the camera's resolution is unavailable.)
                 * @property {module:Camera.DestinationType} [destinationType=FILE_URI] - Choose the format of the return value.
                 * @property {module:Camera.PictureSourceType} [sourceType=CAMERA] - Set the source of the picture.
                 * @property {Boolean} [allowEdit=false] - Allow simple editing of image before selection.
                 * @property {module:Camera.EncodingType} [encodingType=JPEG] - Choose the  returned image file's encoding.
                 * @property {number} [targetWidth] - Width in pixels to scale image. Must be used with `targetHeight`. Aspect ratio remains constant.
                 * @property {number} [targetHeight] - Height in pixels to scale image. Must be used with `targetWidth`. Aspect ratio remains constant.
                 * @property {module:Camera.MediaType} [mediaType=PICTURE] - Set the type of media to select from.  Only works when `PictureSourceType` is `PHOTOLIBRARY` or `SAVEDPHOTOALBUM`.
                 * @property {Boolean} [correctOrientation] - Rotate the image to correct for the orientation of the device during capture.
                 * @property {Boolean} [saveToPhotoAlbum] - Save the image to the photo album on the device after capture.
                 * @property {module:CameraPopoverOptions} [popoverOptions] - iOS-only options that specify popover location in iPad.
                 * @property {module:Camera.Direction} [cameraDirection=BACK] - Choose the camera to use (front- or back-facing).
                 */

                /**
                 * @description Takes a photo using the camera, or retrieves a photo from the device's
                 * image gallery.  The image is passed to the success callback as a
                 * Base64-encoded `String`, or as the URI for the image file.
                 *
                 * The `camera.getPicture` function opens the device's default camera
                 * application that allows users to snap pictures by default - this behavior occurs,
                 * when `Camera.sourceType` equals [`Camera.PictureSourceType.CAMERA`]{@link module:Camera.PictureSourceType}.
                 * Once the user snaps the photo, the camera application closes and the application is restored.
                 *
                 * If `Camera.sourceType` is `Camera.PictureSourceType.PHOTOLIBRARY` or
                 * `Camera.PictureSourceType.SAVEDPHOTOALBUM`, then a dialog displays
                 * that allows users to select an existing image.
                 *
                 * The return value is sent to the [`cameraSuccess`]{@link module:camera.onSuccess} callback function, in
                 * one of the following formats, depending on the specified
                 * `cameraOptions`:
                 *
                 * - A `String` containing the Base64-encoded photo image.
                 * - A `String` representing the image file location on local storage (default).
                 *
                 * You can do whatever you want with the encoded image or URI, for
                 * example:
                 *
                 * - Render the image in an `<img>` tag, as in the example below
                 * - Save the data locally (`LocalStorage`, [Lawnchair](http://brianleroux.github.com/lawnchair/), etc.)
                 * - Post the data to a remote server
                 *
                 * __NOTE__: Photo resolution on newer devices is quite good. Photos
                 * selected from the device's gallery are not downscaled to a lower
                 * quality, even if a `quality` parameter is specified.  To avoid common
                 * memory problems, set `Camera.destinationType` to `FILE_URI` rather
                 * than `DATA_URL`.
                 *
                 * __Supported Platforms__
                 *
                 * - Android
                 * - BlackBerry
                 * - Browser
                 * - Firefox
                 * - FireOS
                 * - iOS
                 * - Windows
                 * - WP8
                 * - Ubuntu
                 *
                 * More examples [here](#camera-getPicture-examples). Quirks [here](#camera-getPicture-quirks).
                 *
                 * @example
                 * navigator.camera.getPicture(cameraSuccess, cameraError, cameraOptions);
                 * @param {module:camera.onSuccess} successCallback
                 * @param {module:camera.onError} errorCallback
                 * @param {module:camera.CameraOptions} options CameraOptions
                 */
                cameraExport.getPicture = function (successCallback, errorCallback, options) {
                    argscheck.checkArgs('fFO', 'Camera.getPicture', arguments);
                    options = options || {};
                    var getValue = argscheck.getValue;

                    var quality = getValue(options.quality, 50);
                    var destinationType = getValue(options.destinationType, Camera.DestinationType.FILE_URI);
                    var sourceType = getValue(options.sourceType, Camera.PictureSourceType.CAMERA);
                    var targetWidth = getValue(options.targetWidth, -1);
                    var targetHeight = getValue(options.targetHeight, -1);
                    var encodingType = getValue(options.encodingType, Camera.EncodingType.JPEG);
                    var mediaType = getValue(options.mediaType, Camera.MediaType.PICTURE);
                    var allowEdit = !!options.allowEdit;
                    var correctOrientation = !!options.correctOrientation;
                    var saveToPhotoAlbum = !!options.saveToPhotoAlbum;
                    var popoverOptions = getValue(options.popoverOptions, null);
                    var cameraDirection = getValue(options.cameraDirection, Camera.Direction.BACK);

                    var args = [quality, destinationType, sourceType, targetWidth, targetHeight, encodingType,
                        mediaType, allowEdit, correctOrientation, saveToPhotoAlbum, popoverOptions, cameraDirection];

                    exec(successCallback, errorCallback, 'Camera', 'takePicture', args);
                    // XXX: commented out
                    return new CameraPopoverHandle();
                };

                /**
                 * Removes intermediate image files that are kept in temporary storage
                 * after calling [`camera.getPicture`]{@link module:camera.getPicture}. Applies only when the value of
                 * `Camera.sourceType` equals `Camera.PictureSourceType.CAMERA` and the
                 * `Camera.destinationType` equals `Camera.DestinationType.FILE_URI`.
                 *
                 * __Supported Platforms__
                 *
                 * - iOS
                 *
                 * @example
                 * navigator.camera.cleanup(onSuccess, onFail);
                 *
                 * function onSuccess() {
                 *     console.log("Camera cleanup success.")
                 * }
                 *
                 * function onFail(message) {
                 *     alert('Failed because: ' + message);
                 * }
                 */
                cameraExport.cleanup = function (successCallback, errorCallback) {
                    exec(successCallback, errorCallback, 'Camera', 'cleanup', []);
                };

                module.exports = cameraExport;

            });

            // file:../plugins/cordova-plugin-camera/CameraConstants.js
            define("cordova-plugin-camera.Camera", function (require, exports, module) {

                /**
                 * @module Camera
                 */
                module.exports = {
                    /**
                     * @description
                     * Defines the output format of `Camera.getPicture` call.
                     * _Note:_ On iOS passing `DestinationType.NATIVE_URI` along with
                     * `PictureSourceType.PHOTOLIBRARY` or `PictureSourceType.SAVEDPHOTOALBUM` will
                     * disable any image modifications (resize, quality change, cropping, etc.) due
                     * to implementation specific.
                     *
                     * @enum {number}
                     */
                    DestinationType: {
                        /** Return base64 encoded string. DATA_URL can be very memory intensive and cause app crashes or out of memory errors. Use FILE_URI or NATIVE_URI if possible */
                        DATA_URL: 0,
                        /** Return file uri (content://media/external/images/media/2 for Android) */
                        FILE_URI: 1,
                        /** Return native uri (eg. asset-library://... for iOS) */
                        NATIVE_URI: 2
                    },
                    /**
                     * @enum {number}
                     */
                    EncodingType: {
                        /** Return JPEG encoded image */
                        JPEG: 0,
                        /** Return PNG encoded image */
                        PNG: 1
                    },
                    /**
                     * @enum {number}
                     */
                    MediaType: {
                        /** Allow selection of still pictures only. DEFAULT. Will return format specified via DestinationType */
                        PICTURE: 0,
                        /** Allow selection of video only, ONLY RETURNS URL */
                        VIDEO: 1,
                        /** Allow selection from all media types */
                        ALLMEDIA: 2
                    },
                    /**
                     * @description
                     * Defines the output format of `Camera.getPicture` call.
                     * _Note:_ On iOS passing `PictureSourceType.PHOTOLIBRARY` or `PictureSourceType.SAVEDPHOTOALBUM`
                     * along with `DestinationType.NATIVE_URI` will disable any image modifications (resize, quality
                     * change, cropping, etc.) due to implementation specific.
                     *
                     * @enum {number}
                     */
                    PictureSourceType: {
                        /** Choose image from the device's photo library (same as SAVEDPHOTOALBUM for Android) */
                        PHOTOLIBRARY: 0,
                        /** Take picture from camera */
                        CAMERA: 1,
                        /** Choose image only from the device's Camera Roll album (same as PHOTOLIBRARY for Android) */
                        SAVEDPHOTOALBUM: 2
                    },
                    /**
                     * Matches iOS UIPopoverArrowDirection constants to specify arrow location on popover.
                     * @enum {number}
                     */
                    PopoverArrowDirection: {
                        ARROW_UP: 1,
                        ARROW_DOWN: 2,
                        ARROW_LEFT: 4,
                        ARROW_RIGHT: 8,
                        ARROW_ANY: 15
                    },
                    /**
                     * @enum {number}
                     */
                    Direction: {
                        /** Use the back-facing camera */
                        BACK: 0,
                        /** Use the front-facing camera */
                        FRONT: 1
                    }
                };

            });

            // file:../plugins/cordova-plugin-camera/CameraPopoverOptions.js
            define("cordova-plugin-camera.CameraPopoverOptions", function (require, exports, module) {

                var Camera = require('./Camera');

                /**
                 * @namespace navigator
                 */

                /**
                 * iOS-only parameters that specify the anchor element location and arrow
                 * direction of the popover when selecting images from an iPad's library
                 * or album.
                 * Note that the size of the popover may change to adjust to the
                 * direction of the arrow and orientation of the screen.  Make sure to
                 * account for orientation changes when specifying the anchor element
                 * location.
                 * @module CameraPopoverOptions
                 * @param {Number} [x=0] - x pixel coordinate of screen element onto which to anchor the popover.
                 * @param {Number} [y=32] - y pixel coordinate of screen element onto which to anchor the popover.
                 * @param {Number} [width=320] - width, in pixels, of the screen element onto which to anchor the popover.
                 * @param {Number} [height=480] - height, in pixels, of the screen element onto which to anchor the popover.
                 * @param {module:Camera.PopoverArrowDirection} [arrowDir=ARROW_ANY] - Direction the arrow on the popover should point.
                 * @param {Number} [popoverWidth=0] - width of the popover (0 or not specified will use apple's default width).
                 * @param {Number} [popoverHeight=0] - height of the popover (0 or not specified will use apple's default height).
                 */
                var CameraPopoverOptions = function (x, y, width, height, arrowDir, popoverWidth, popoverHeight) {
                    // information of rectangle that popover should be anchored to
                    this.x = x || 0;
                    this.y = y || 32;
                    this.width = width || 320;
                    this.height = height || 480;
                    this.arrowDir = arrowDir || Camera.PopoverArrowDirection.ARROW_ANY;
                    this.popoverWidth = popoverWidth || 0;
                    this.popoverHeight = popoverHeight || 0;
                };

                module.exports = CameraPopoverOptions;

            });

            // file:../plugins/cordova-plugin-device/device.js
            define("cordova-plugin-device.device", function (require, exports, module) {

                var argscheck = require('cordova/argscheck');
                var channel = require('cordova/channel');
                var utils = require('cordova/utils');
                var exec = require('cordova/exec');
                var cordova = require('cordova');

                channel.createSticky('onCordovaInfoReady');
                // Tell cordova channel to wait on the CordovaInfoReady event
                channel.waitForInitialization('onCordovaInfoReady');

                /**
                 * This represents the mobile device, and provides properties for inspecting the model, version, UUID of the
                 * phone, etc.
                 * @constructor
                 */
                function Device() {
                    this.available = false;
                    this.platform = null;
                    this.version = null;
                    this.uuid = null;
                    this.cordova = null;
                    this.model = null;
                    this.manufacturer = null;
                    this.isVirtual = null;
                    this.serial = null;

                    var me = this;

                    channel.onCordovaReady.subscribe(function () {
                        me.getInfo(function (info) {
                            // ignoring info.cordova returning from native, we should use value from cordova.version defined in cordova.js
                            // TODO: CB-5105 native implementations should not return info.cordova
                            var buildLabel = cordova.version;
                            me.available = true;
                            me.platform = info.platform;
                            me.version = info.version;
                            me.uuid = info.uuid;
                            me.cordova = buildLabel;
                            me.model = info.model;
                            me.isVirtual = info.isVirtual;
                            me.manufacturer = info.manufacturer || 'unknown';
                            me.serial = info.serial || 'unknown';
                            channel.onCordovaInfoReady.fire();
                        }, function (e) {
                            me.available = false;
                            utils.alert('[ERROR] Error initializing Cordova: ' + e);
                        });
                    });
                }

                /**
                 * Get device info
                 *
                 * @param {Function} successCallback The function to call when the heading data is available
                 * @param {Function} errorCallback The function to call when there is an error getting the heading data. (OPTIONAL)
                 */
                Device.prototype.getInfo = function (successCallback, errorCallback) {
                    argscheck.checkArgs('fF', 'Device.getInfo', arguments);
                    exec(successCallback, errorCallback, 'Device', 'getDeviceInfo', []);
                };

                module.exports = new Device();

            });

            // file:../plugins/cordova-plugin-splashscreen/splashscreen.js
            define("cordova-plugin-splashscreen.SplashScreen", function (require, exports, module) {
                var exec = require('cordova/exec');

                var splashscreen = {
                    show: function () {
                        exec(null, null, "SplashScreen", "show", []);
                    },
                    hide: function () {
                        exec(null, null, "SplashScreen", "hide", []);
                    }
                };

                module.exports = splashscreen;

            });

            // file:../plugins/cordova-plugin-statusbar/statusbar.js
            define("cordova-plugin-statusbar.statusbar", function (require, exports, module) {

                /* global cordova */

                var exec = require('cordova/exec');

                var namedColors = {
                    "black": "#000000",
                    "darkGray": "#A9A9A9",
                    "lightGray": "#D3D3D3",
                    "white": "#FFFFFF",
                    "gray": "#808080",
                    "red": "#FF0000",
                    "green": "#00FF00",
                    "blue": "#0000FF",
                    "cyan": "#00FFFF",
                    "yellow": "#FFFF00",
                    "magenta": "#FF00FF",
                    "orange": "#FFA500",
                    "purple": "#800080",
                    "brown": "#A52A2A"
                };

                var StatusBar = {

                    isVisible: true,

                    overlaysWebView: function (doOverlay) {
                        exec(null, null, "StatusBar", "overlaysWebView", [doOverlay]);
                    },

                    styleDefault: function () {
                        // dark text ( to be used on a light background )
                        exec(null, null, "StatusBar", "styleDefault", []);
                    },

                    styleLightContent: function () {
                        // light text ( to be used on a dark background )
                        exec(null, null, "StatusBar", "styleLightContent", []);
                    },

                    styleBlackTranslucent: function () {
                        // #88000000 ? Apple says to use lightContent instead
                        exec(null, null, "StatusBar", "styleBlackTranslucent", []);
                    },

                    styleBlackOpaque: function () {
                        // #FF000000 ? Apple says to use lightContent instead
                        exec(null, null, "StatusBar", "styleBlackOpaque", []);
                    },

                    backgroundColorByName: function (colorname) {
                        return StatusBar.backgroundColorByHexString(namedColors[colorname]);
                    },

                    backgroundColorByHexString: function (hexString) {
                        if (hexString.charAt(0) !== "#") {
                            hexString = "#" + hexString;
                        }

                        if (hexString.length === 4) {
                            var split = hexString.split("");
                            hexString = "#" + split[1] + split[1] + split[2] + split[2] + split[3] + split[3];
                        }

                        exec(null, null, "StatusBar", "backgroundColorByHexString", [hexString]);
                    },

                    hide: function () {
                        exec(null, null, "StatusBar", "hide", []);
                        StatusBar.isVisible = false;
                    },

                    show: function () {
                        exec(null, null, "StatusBar", "show", []);
                        StatusBar.isVisible = true;
                    }

                };

                // prime it. setTimeout so that proxy gets time to init
                window.setTimeout(function () {
                    exec(function (res) {
                        if (typeof res == 'object') {
                            if (res.type == 'tap') {
                                cordova.fireWindowEvent('statusTap');
                            }
                        } else {
                            StatusBar.isVisible = res;
                        }
                    }, null, "StatusBar", "_ready", []);
                }, 0);

                module.exports = StatusBar;

            });

            // file:../plugins/cordova-plugin-app-exit/ExitApp.js
            define("cordova-plugin-app-exit.exitApp", function (require, exports, module) {
                var exec = require('cordova/exec');

                module.exports = {
                    /**
                     * Exits the PhoneGap application with no questions asked.
                     */
                    exitApp: function () {
                        exec(null, null, 'ExitApp', 'exitApp', []);
                    }
                };

            });

            define("cordova-plugin-media.Media", function (require, exports, module) {

                var argscheck = require('cordova/argscheck'),
                    utils = require('cordova/utils'),
                    exec = require('cordova/exec');

                var mediaObjects = {};

                /**
                 * This class provides access to the device media, interfaces to both sound and video
                 *
                 * @constructor
                 * @param src                   The file name or url to play
                 * @param successCallback       The callback to be called when the file is done playing or recording.
                 *                                  successCallback()
                 * @param errorCallback         The callback to be called if there is an error.
                 *                                  errorCallback(int errorCode) - OPTIONAL
                 * @param statusCallback        The callback to be called when media status has changed.
                 *                                  statusCallback(int statusCode) - OPTIONAL
                 */
                var Media = function (src, successCallback, errorCallback, statusCallback) {
                    argscheck.checkArgs('sFFF', 'Media', arguments);
                    this.id = utils.createUUID();
                    mediaObjects[this.id] = this;
                    this.src = src;
                    this.successCallback = successCallback;
                    this.errorCallback = errorCallback;
                    this.statusCallback = statusCallback;
                    this._duration = -1;
                    this._position = -1;
                    exec(null, this.errorCallback, "Media", "create", [this.id, this.src]);
                };

                // Media messages
                Media.MEDIA_STATE = 1;
                Media.MEDIA_DURATION = 2;
                Media.MEDIA_POSITION = 3;
                Media.MEDIA_ERROR = 9;

                // Media states
                Media.MEDIA_NONE = 0;
                Media.MEDIA_STARTING = 1;
                Media.MEDIA_RUNNING = 2;
                Media.MEDIA_PAUSED = 3;
                Media.MEDIA_STOPPED = 4;
                Media.MEDIA_MSG = ["None", "Starting", "Running", "Paused", "Stopped"];

                // "static" function to return existing objs.
                Media.get = function (id) {
                    return mediaObjects[id];
                };

                /**
                 * Start or resume playing audio file.
                 */
                Media.prototype.play = function (options) {
                    exec(null, null, "Media", "startPlayingAudio", [this.id, this.src, options]);
                };

                /**
                 * Stop playing audio file.
                 */
                Media.prototype.stop = function () {
                    var me = this;
                    exec(function () {
                        me._position = 0;
                    }, this.errorCallback, "Media", "stopPlayingAudio", [this.id]);
                };

                /**
                 * Seek or jump to a new time in the track..
                 */
                Media.prototype.seekTo = function (milliseconds) {
                    var me = this;
                    exec(function (p) {
                        me._position = p;
                    }, this.errorCallback, "Media", "seekToAudio", [this.id, milliseconds]);
                };

                /**
                 * Pause playing audio file.
                 */
                Media.prototype.pause = function () {
                    exec(null, this.errorCallback, "Media", "pausePlayingAudio", [this.id]);
                };

                /**
                 * Get duration of an audio file.
                 * The duration is only set for audio that is playing, paused or stopped.
                 *
                 * @return      duration or -1 if not known.
                 */
                Media.prototype.getDuration = function () {
                    return this._duration;
                };

                /**
                 * Get position of audio.
                 */
                Media.prototype.getCurrentPosition = function (success, fail) {
                    var me = this;
                    exec(function (p) {
                        me._position = p;
                        success(p);
                    }, fail, "Media", "getCurrentPositionAudio", [this.id]);
                };

                /**
                 * Start recording audio file.
                 */
                Media.prototype.startRecord = function () {
                    exec(null, this.errorCallback, "Media", "startRecordingAudio", [this.id, this.src]);
                };

                /**
                 * Stop recording audio file.
                 */
                Media.prototype.stopRecord = function () {
                    exec(null, this.errorCallback, "Media", "stopRecordingAudio", [this.id]);
                };

                /**
                 * Pause recording audio file.
                 */
                Media.prototype.pauseRecord = function () {
                    exec(null, this.errorCallback, "Media", "pauseRecordingAudio", [this.id]);
                };

                /**
                * Resume recording audio file.
                */
                Media.prototype.resumeRecord = function () {
                    exec(null, this.errorCallback, "Media", "resumeRecordingAudio", [this.id]);
                };

                /**
                 * Release the resources.
                 */
                Media.prototype.release = function () {
                    exec(null, this.errorCallback, "Media", "release", [this.id]);
                };

                /**
                 * Adjust the volume.
                 */
                Media.prototype.setVolume = function (volume) {
                    exec(null, null, "Media", "setVolume", [this.id, volume]);
                };

                /**
                 * Adjust the playback rate.
                 */
                Media.prototype.setRate = function (rate) {
                    if (cordova.platformId === 'ios') {
                        exec(null, null, "Media", "setRate", [this.id, rate]);
                    } else {
                        console.warn('media.setRate method is currently not supported for', cordova.platformId, 'platform.');
                    }
                };

                /**
                 * Get amplitude of audio.
                 */
                Media.prototype.getCurrentAmplitude = function (success, fail) {
                    exec(function (p) {
                        success(p);
                    }, fail, "Media", "getCurrentAmplitudeAudio", [this.id]);
                };

                /**
                 * Audio has status update.
                 * PRIVATE
                 *
                 * @param id            The media object id (string)
                 * @param msgType       The 'type' of update this is
                 * @param value         Use of value is determined by the msgType
                 */
                Media.onStatus = function (id, msgType, value) {

                    var media = mediaObjects[id];

                    if (media) {
                        switch (msgType) {
                            case Media.MEDIA_STATE:
                                if (media.statusCallback) {
                                    media.statusCallback(value);
                                }
                                if (value == Media.MEDIA_STOPPED) {
                                    if (media.successCallback) {
                                        media.successCallback();
                                    }
                                }
                                break;
                            case Media.MEDIA_DURATION:
                                media._duration = value;
                                break;
                            case Media.MEDIA_ERROR:
                                if (media.errorCallback) {
                                    media.errorCallback(value);
                                }
                                break;
                            case Media.MEDIA_POSITION:
                                media._position = Number(value);
                                break;
                            default:
                                if (console.error) {
                                    console.error("Unhandled Media.onStatus :: " + msgType);
                                }
                                break;
                        }
                    } else if (console.error) {
                        console.error("Received Media.onStatus callback for unknown media :: " + id);
                    }

                };

                module.exports = Media;

                function onMessageFromNative(msg) {
                    if (msg.action == 'status') {
                        Media.onStatus(msg.status.id, msg.status.msgType, msg.status.value);
                    } else {
                        throw new Error('Unknown media action' + msg.action);
                    }
                }

                if (cordova.platformId === 'android' || cordova.platformId === 'amazon-fireos' || cordova.platformId === 'windowsphone') {

                    var channel = require('cordova/channel');

                    channel.createSticky('onMediaPluginReady');
                    channel.waitForInitialization('onMediaPluginReady');

                    channel.onCordovaReady.subscribe(function () {
                        exec(onMessageFromNative, undefined, 'Media', 'messageChannel', []);
                        channel.initializationComplete('onMediaPluginReady');
                    });
                }

            });

            define("cordova-plugin-media.MediaError", function (require, exports, module) {
                /**
                 * This class contains information about any Media errors.
                */
                /*
                 According to :: http://dev.w3.org/html5/spec-author-view/video.html#mediaerror
                 We should never be creating these objects, we should just implement the interface
                 which has 1 property for an instance, 'code'
                
                 instead of doing :
                    errorCallbackFunction( new MediaError(3,'msg') );
                we should simply use a literal :
                    errorCallbackFunction( {'code':3} );
                 */

                var _MediaError = window.MediaError;


                if (!_MediaError) {
                    window.MediaError = _MediaError = function (code, msg) {
                        this.code = (typeof code != 'undefined') ? code : null;
                        this.message = msg || ""; // message is NON-standard! do not use!
                    };
                }

                _MediaError.MEDIA_ERR_NONE_ACTIVE = _MediaError.MEDIA_ERR_NONE_ACTIVE || 0;
                _MediaError.MEDIA_ERR_ABORTED = _MediaError.MEDIA_ERR_ABORTED || 1;
                _MediaError.MEDIA_ERR_NETWORK = _MediaError.MEDIA_ERR_NETWORK || 2;
                _MediaError.MEDIA_ERR_DECODE = _MediaError.MEDIA_ERR_DECODE || 3;
                _MediaError.MEDIA_ERR_NONE_SUPPORTED = _MediaError.MEDIA_ERR_NONE_SUPPORTED || 4;
                // TODO: MediaError.MEDIA_ERR_NONE_SUPPORTED is legacy, the W3 spec now defines it as below.
                // as defined by http://dev.w3.org/html5/spec-author-view/video.html#error-codes
                _MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED = _MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED || 4;

                module.exports = _MediaError;

            });

            define("cordova-plugin-dialogs.notification", function (require, exports, module) {

                var exec = require('cordova/exec');
                var platform = require('cordova/platform');

                /**
                 * Provides access to notifications on the device.
                 */

                module.exports = {

                    /**
                     * Open a native alert dialog, with a customizable title and button text.
                     *
                     * @param {String} message              Message to print in the body of the alert
                     * @param {Function} completeCallback   The callback that is called when user clicks on a button.
                     * @param {String} title                Title of the alert dialog (default: Alert)
                     * @param {String} buttonLabel          Label of the close button (default: OK)
                     */
                    alert: function (message, completeCallback, title, buttonLabel) {
                        var _message = (typeof message === 'string' ? message : JSON.stringify(message));
                        var _title = (typeof title === 'string' ? title : 'Alert');
                        var _buttonLabel = (buttonLabel && typeof buttonLabel === 'string' ? buttonLabel : 'OK');
                        exec(completeCallback, null, 'Notification', 'alert', [_message, _title, _buttonLabel]);
                    },

                    /**
                     * Open a native confirm dialog, with a customizable title and button text.
                     * The result that the user selects is returned to the result callback.
                     *
                     * @param {String} message              Message to print in the body of the alert
                     * @param {Function} resultCallback     The callback that is called when user clicks on a button.
                     * @param {String} title                Title of the alert dialog (default: Confirm)
                     * @param {Array} buttonLabels          Array of the labels of the buttons (default: ['OK', 'Cancel'])
                     */
                    confirm: function (message, resultCallback, title, buttonLabels) {
                        var _message = (typeof message === 'string' ? message : JSON.stringify(message));
                        var _title = (typeof title === 'string' ? title : 'Confirm');
                        var _buttonLabels = (buttonLabels || ['OK', 'Cancel']);

                        // Strings are deprecated!
                        if (typeof _buttonLabels === 'string') {
                            console.log('Notification.confirm(string, function, string, string) is deprecated.  Use Notification.confirm(string, function, string, array).');
                        }

                        _buttonLabels = convertButtonLabels(_buttonLabels);

                        exec(resultCallback, null, 'Notification', 'confirm', [_message, _title, _buttonLabels]);
                    },

                    /**
                     * Open a native prompt dialog, with a customizable title and button text.
                     * The following results are returned to the result callback:
                     *  buttonIndex     Index number of the button selected.
                     *  input1          The text entered in the prompt dialog box.
                     *
                     * @param {String} message              Dialog message to display (default: "Prompt message")
                     * @param {Function} resultCallback     The callback that is called when user clicks on a button.
                     * @param {String} title                Title of the dialog (default: "Prompt")
                     * @param {Array} buttonLabels          Array of strings for the button labels (default: ["OK","Cancel"])
                     * @param {String} defaultText          Textbox input value (default: empty string)
                     */
                    prompt: function (message, resultCallback, title, buttonLabels, defaultText) {
                        var _message = (typeof message === 'string' ? message : JSON.stringify(message));
                        var _title = (typeof title === 'string' ? title : 'Prompt');
                        var _buttonLabels = (buttonLabels || ['OK', 'Cancel']);

                        // Strings are deprecated!
                        if (typeof _buttonLabels === 'string') {
                            console.log('Notification.prompt(string, function, string, string) is deprecated.  Use Notification.confirm(string, function, string, array).');
                        }

                        _buttonLabels = convertButtonLabels(_buttonLabels);

                        var _defaultText = (defaultText || '');
                        exec(resultCallback, null, 'Notification', 'prompt', [_message, _title, _buttonLabels, _defaultText]);
                    },

                    /**
                     * Causes the device to beep.
                     * On Android, the default notification ringtone is played "count" times.
                     *
                     * @param {Integer} count       The number of beeps.
                     */
                    beep: function (count) {
                        var defaultedCount = count || 1;
                        exec(null, null, 'Notification', 'beep', [defaultedCount]);
                    }
                };

                function convertButtonLabels(buttonLabels) {

                    // Some platforms take an array of button label names.
                    // Other platforms take a comma separated list.
                    // For compatibility, we convert to the desired type based on the platform.
                    if (platform.id === 'amazon-fireos' || platform.id === 'android' || platform.id === 'ios' ||
                        platform.id === 'windowsphone' || platform.id === 'firefoxos' || platform.id === 'ubuntu' ||
                        platform.id === 'windows8' || platform.id === 'windows') {

                        if (typeof buttonLabels === 'string') {
                            buttonLabels = buttonLabels.split(','); // not crazy about changing the var type here
                        }
                    } else {
                        if (Array.isArray(buttonLabels)) {
                            var buttonLabelArray = buttonLabels;
                            buttonLabels = buttonLabelArray.toString();
                        }
                    }

                    return buttonLabels;
                }

            });

            define("cordova-plugin-geolocation.Coordinates", function (require, exports, module) {
                /*
                 *
                 * Licensed to the Apache Software Foundation (ASF) under one
                 * or more contributor license agreements.  See the NOTICE file
                 * distributed with this work for additional information
                 * regarding copyright ownership.  The ASF licenses this file
                 * to you under the Apache License, Version 2.0 (the
                 * "License"); you may not use this file except in compliance
                 * with the License.  You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing,
                 * software distributed under the License is distributed on an
                 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
                 * KIND, either express or implied.  See the License for the
                 * specific language governing permissions and limitations
                 * under the License.
                 *
                */

                /**
                 * This class contains position information.
                 * @param {Object} lat
                 * @param {Object} lng
                 * @param {Object} alt
                 * @param {Object} acc
                 * @param {Object} head
                 * @param {Object} vel
                 * @param {Object} altacc
                 * @constructor
                 */
                var Coordinates = function (lat, lng, alt, acc, head, vel, altacc) {
                    /**
                     * The latitude of the position.
                     */
                    this.latitude = lat;
                    /**
                     * The longitude of the position,
                     */
                    this.longitude = lng;
                    /**
                     * The accuracy of the position.
                     */
                    this.accuracy = acc;
                    /**
                     * The altitude of the position.
                     */
                    this.altitude = (alt !== undefined ? alt : null);
                    /**
                     * The direction the device is moving at the position.
                     */
                    this.heading = (head !== undefined ? head : null);
                    /**
                     * The velocity with which the device is moving at the position.
                     */
                    this.speed = (vel !== undefined ? vel : null);

                    if (this.speed === 0 || this.speed === null) {
                        this.heading = NaN;
                    }

                    /**
                     * The altitude accuracy of the position.
                     */
                    this.altitudeAccuracy = (altacc !== undefined) ? altacc : null;
                };

                module.exports = Coordinates;

            });

            define("cordova-plugin-geolocation.geolocation", function (require, exports, module) {
                /*
                 *
                 * Licensed to the Apache Software Foundation (ASF) under one
                 * or more contributor license agreements.  See the NOTICE file
                 * distributed with this work for additional information
                 * regarding copyright ownership.  The ASF licenses this file
                 * to you under the Apache License, Version 2.0 (the
                 * "License"); you may not use this file except in compliance
                 * with the License.  You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing,
                 * software distributed under the License is distributed on an
                 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
                 * KIND, either express or implied.  See the License for the
                 * specific language governing permissions and limitations
                 * under the License.
                 *
                */

                var argscheck = require('cordova/argscheck');
                var utils = require('cordova/utils');
                var exec = require('cordova/exec');
                var PositionError = require('./PositionError');
                var Position = require('./Position');

                var timers = {}; // list of timers in use

                // Returns default params, overrides if provided with values
                function parseParameters(options) {
                    var opt = {
                        maximumAge: 0,
                        enableHighAccuracy: false,
                        timeout: Infinity
                    };

                    if (options) {
                        if (options.maximumAge !== undefined && !isNaN(options.maximumAge) && options.maximumAge > 0) {
                            opt.maximumAge = options.maximumAge;
                        }
                        if (options.enableHighAccuracy !== undefined) {
                            opt.enableHighAccuracy = options.enableHighAccuracy;
                        }
                        if (options.timeout !== undefined && !isNaN(options.timeout)) {
                            if (options.timeout < 0) {
                                opt.timeout = 0;
                            } else {
                                opt.timeout = options.timeout;
                            }
                        }
                    }

                    return opt;
                }

                // Returns a timeout failure, closed over a specified timeout value and error callback.
                function createTimeout(errorCallback, timeout) {
                    var t = setTimeout(function () {
                        clearTimeout(t);
                        t = null;
                        errorCallback({
                            code: PositionError.TIMEOUT,
                            message: 'Position retrieval timed out.'
                        });
                    }, timeout);
                    return t;
                }

                var geolocation = {
                    lastPosition: null, // reference to last known (cached) position returned
                    /**
                   * Asynchronously acquires the current position.
                   *
                   * @param {Function} successCallback    The function to call when the position data is available
                   * @param {Function} errorCallback      The function to call when there is an error getting the heading position. (OPTIONAL)
                   * @param {PositionOptions} options     The options for getting the position data. (OPTIONAL)
                   */
                    getCurrentPosition: function (successCallback, errorCallback, options) {
                        argscheck.checkArgs('fFO', 'geolocation.getCurrentPosition', arguments);
                        options = parseParameters(options);

                        // Timer var that will fire an error callback if no position is retrieved from native
                        // before the "timeout" param provided expires
                        var timeoutTimer = { timer: null };

                        var win = function (p) {
                            clearTimeout(timeoutTimer.timer);
                            if (!(timeoutTimer.timer)) {
                                // Timeout already happened, or native fired error callback for
                                // this geo request.
                                // Don't continue with success callback.
                                return;
                            }
                            var pos = new Position(
                                {
                                    latitude: p.latitude,
                                    longitude: p.longitude,
                                    altitude: p.altitude,
                                    accuracy: p.accuracy,
                                    heading: p.heading,
                                    velocity: p.velocity,
                                    altitudeAccuracy: p.altitudeAccuracy
                                },
                                p.timestamp
                            );
                            geolocation.lastPosition = pos;
                            successCallback(pos);
                        };
                        var fail = function (e) {
                            clearTimeout(timeoutTimer.timer);
                            timeoutTimer.timer = null;
                            var err = new PositionError(e.code, e.message);
                            if (errorCallback) {
                                errorCallback(err);
                            }
                        };

                        // Check our cached position, if its timestamp difference with current time is less than the maximumAge, then just
                        // fire the success callback with the cached position.
                        if (geolocation.lastPosition && options.maximumAge && (((new Date()).getTime() - geolocation.lastPosition.timestamp) <= options.maximumAge)) {
                            successCallback(geolocation.lastPosition);
                            // If the cached position check failed and the timeout was set to 0, error out with a TIMEOUT error object.
                        } else if (options.timeout === 0) {
                            fail({
                                code: PositionError.TIMEOUT,
                                message: "timeout value in PositionOptions set to 0 and no cached Position object available, or cached Position object's age exceeds provided PositionOptions' maximumAge parameter."
                            });
                            // Otherwise we have to call into native to retrieve a position.
                        } else {
                            if (options.timeout !== Infinity) {
                                // If the timeout value was not set to Infinity (default), then
                                // set up a timeout function that will fire the error callback
                                // if no successful position was retrieved before timeout expired.
                                timeoutTimer.timer = createTimeout(fail, options.timeout);
                            } else {
                                // This is here so the check in the win function doesn't mess stuff up
                                // may seem weird but this guarantees timeoutTimer is
                                // always truthy before we call into native
                                timeoutTimer.timer = true;
                            }
                            exec(win, fail, 'Geolocation', 'getLocation', [options.enableHighAccuracy, options.maximumAge]);
                        }
                        return timeoutTimer;
                    },
                    /**
                     * Asynchronously watches the geolocation for changes to geolocation.  When a change occurs,
                     * the successCallback is called with the new location.
                     *
                     * @param {Function} successCallback    The function to call each time the location data is available
                     * @param {Function} errorCallback      The function to call when there is an error getting the location data. (OPTIONAL)
                     * @param {PositionOptions} options     The options for getting the location data such as frequency. (OPTIONAL)
                     * @return String                       The watch id that must be passed to #clearWatch to stop watching.
                     */
                    watchPosition: function (successCallback, errorCallback, options) {
                        argscheck.checkArgs('fFO', 'geolocation.getCurrentPosition', arguments);
                        options = parseParameters(options);

                        var id = utils.createUUID();

                        // Tell device to get a position ASAP, and also retrieve a reference to the timeout timer generated in getCurrentPosition
                        timers[id] = geolocation.getCurrentPosition(successCallback, errorCallback, options);

                        var fail = function (e) {
                            clearTimeout(timers[id].timer);
                            var err = new PositionError(e.code, e.message);
                            if (errorCallback) {
                                errorCallback(err);
                            }
                        };

                        var win = function (p) {
                            clearTimeout(timers[id].timer);
                            if (options.timeout !== Infinity) {
                                timers[id].timer = createTimeout(fail, options.timeout);
                            }
                            var pos = new Position(
                                {
                                    latitude: p.latitude,
                                    longitude: p.longitude,
                                    altitude: p.altitude,
                                    accuracy: p.accuracy,
                                    heading: p.heading,
                                    velocity: p.velocity,
                                    altitudeAccuracy: p.altitudeAccuracy
                                },
                                p.timestamp
                            );
                            geolocation.lastPosition = pos;
                            successCallback(pos);
                        };

                        exec(win, fail, 'Geolocation', 'addWatch', [id, options.enableHighAccuracy]);

                        return id;
                    },
                    /**
                     * Clears the specified heading watch.
                     *
                     * @param {String} id       The ID of the watch returned from #watchPosition
                     */
                    clearWatch: function (id) {
                        if (id && timers[id] !== undefined) {
                            clearTimeout(timers[id].timer);
                            timers[id].timer = false;
                            exec(null, null, 'Geolocation', 'clearWatch', [id]);
                        }
                    }
                };

                module.exports = geolocation;

            });

            define("cordova-plugin-geolocation.Position", function (require, exports, module) {
                /*
                 *
                 * Licensed to the Apache Software Foundation (ASF) under one
                 * or more contributor license agreements.  See the NOTICE file
                 * distributed with this work for additional information
                 * regarding copyright ownership.  The ASF licenses this file
                 * to you under the Apache License, Version 2.0 (the
                 * "License"); you may not use this file except in compliance
                 * with the License.  You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing,
                 * software distributed under the License is distributed on an
                 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
                 * KIND, either express or implied.  See the License for the
                 * specific language governing permissions and limitations
                 * under the License.
                 *
                */

                var Coordinates = require('./Coordinates');

                var Position = function (coords, timestamp) {
                    if (coords) {
                        this.coords = new Coordinates(coords.latitude, coords.longitude, coords.altitude, coords.accuracy, coords.heading, coords.velocity, coords.altitudeAccuracy);
                    } else {
                        this.coords = new Coordinates();
                    }
                    this.timestamp = (timestamp !== undefined) ? timestamp : new Date().getTime();
                };

                module.exports = Position;

            });

            define("cordova-plugin-geolocation.PositionError", function (require, exports, module) {
                /*
                 *
                 * Licensed to the Apache Software Foundation (ASF) under one
                 * or more contributor license agreements.  See the NOTICE file
                 * distributed with this work for additional information
                 * regarding copyright ownership.  The ASF licenses this file
                 * to you under the Apache License, Version 2.0 (the
                 * "License"); you may not use this file except in compliance
                 * with the License.  You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing,
                 * software distributed under the License is distributed on an
                 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
                 * KIND, either express or implied.  See the License for the
                 * specific language governing permissions and limitations
                 * under the License.
                 *
                */

                /**
                 * Position error object
                 *
                 * @constructor
                 * @param code
                 * @param message
                 */
                var PositionError = function (code, message) {
                    this.code = code || null;
                    this.message = message || '';
                };

                PositionError.prototype.PERMISSION_DENIED = PositionError.PERMISSION_DENIED = 1;
                PositionError.prototype.POSITION_UNAVAILABLE = PositionError.POSITION_UNAVAILABLE = 2;
                PositionError.prototype.TIMEOUT = PositionError.TIMEOUT = 3;

                module.exports = PositionError;

            });

            define("cordova-plugin-inappbrowser.inappbrowser", function (require, exports, module) {
                /*
                 *
                 * Licensed to the Apache Software Foundation (ASF) under one
                 * or more contributor license agreements.  See the NOTICE file
                 * distributed with this work for additional information
                 * regarding copyright ownership.  The ASF licenses this file
                 * to you under the Apache License, Version 2.0 (the
                 * "License"); you may not use this file except in compliance
                 * with the License.  You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing,
                 * software distributed under the License is distributed on an
                 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
                 * KIND, either express or implied.  See the License for the
                 * specific language governing permissions and limitations
                 * under the License.
                 *
                */

                (function () {
                    var exec = require('cordova/exec');
                    var channel = require('cordova/channel');
                    var modulemapper = require('cordova/modulemapper');
                    var urlutil = require('cordova/urlutil');

                    function InAppBrowser() {
                        this.channels = {
                            'beforeload': channel.create('beforeload'),
                            'loadstart': channel.create('loadstart'),
                            'loadstop': channel.create('loadstop'),
                            'loaderror': channel.create('loaderror'),
                            'exit': channel.create('exit'),
                            'customscheme': channel.create('customscheme'),
                            'message': channel.create('message')
                        };
                    }

                    InAppBrowser.prototype = {
                        _eventHandler: function (event) {
                            if (event && (event.type in this.channels)) {
                                if (event.type === 'beforeload') {
                                    this.channels[event.type].fire(event, this._loadAfterBeforeload);
                                } else {
                                    this.channels[event.type].fire(event);
                                }
                            }
                        },
                        _loadAfterBeforeload: function (strUrl) {
                            strUrl = urlutil.makeAbsolute(strUrl);
                            exec(null, null, 'InAppBrowser', 'loadAfterBeforeload', [strUrl]);
                        },
                        close: function (eventname) {
                            exec(null, null, 'InAppBrowser', 'close', []);
                        },
                        show: function (eventname) {
                            exec(null, null, 'InAppBrowser', 'show', []);
                        },
                        hide: function (eventname) {
                            exec(null, null, 'InAppBrowser', 'hide', []);
                        },
                        addEventListener: function (eventname, f) {
                            if (eventname in this.channels) {
                                this.channels[eventname].subscribe(f);
                            }
                        },
                        removeEventListener: function (eventname, f) {
                            if (eventname in this.channels) {
                                this.channels[eventname].unsubscribe(f);
                            }
                        },

                        executeScript: function (injectDetails, cb) {
                            if (injectDetails.code) {
                                exec(cb, null, 'InAppBrowser', 'injectScriptCode', [injectDetails.code, !!cb]);
                            } else if (injectDetails.file) {
                                exec(cb, null, 'InAppBrowser', 'injectScriptFile', [injectDetails.file, !!cb]);
                            } else {
                                throw new Error('executeScript requires exactly one of code or file to be specified');
                            }
                        },

                        insertCSS: function (injectDetails, cb) {
                            if (injectDetails.code) {
                                exec(cb, null, 'InAppBrowser', 'injectStyleCode', [injectDetails.code, !!cb]);
                            } else if (injectDetails.file) {
                                exec(cb, null, 'InAppBrowser', 'injectStyleFile', [injectDetails.file, !!cb]);
                            } else {
                                throw new Error('insertCSS requires exactly one of code or file to be specified');
                            }
                        }
                    };

                    module.exports = function (strUrl, strWindowName, strWindowFeatures, callbacks) {
                        // Don't catch calls that write to existing frames (e.g. named iframes).
                        if (window.frames && window.frames[strWindowName]) {
                            var origOpenFunc = modulemapper.getOriginalSymbol(window, 'open');
                            return origOpenFunc.apply(window, arguments);
                        }

                        strUrl = urlutil.makeAbsolute(strUrl);
                        var iab = new InAppBrowser();

                        callbacks = callbacks || {};
                        for (var callbackName in callbacks) {
                            iab.addEventListener(callbackName, callbacks[callbackName]);
                        }

                        var cb = function (eventname) {
                            iab._eventHandler(eventname);
                        };

                        strWindowFeatures = strWindowFeatures || '';

                        exec(cb, cb, 'InAppBrowser', 'open', [strUrl, strWindowName, strWindowFeatures]);
                        return iab;
                    };
                })();

            });

            define("cordova-plugin-network-information.Connection", function (require, exports, module) {
                /*
                 *
                 * Licensed to the Apache Software Foundation (ASF) under one
                 * or more contributor license agreements.  See the NOTICE file
                 * distributed with this work for additional information
                 * regarding copyright ownership.  The ASF licenses this file
                 * to you under the Apache License, Version 2.0 (the
                 * "License"); you may not use this file except in compliance
                 * with the License.  You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing,
                 * software distributed under the License is distributed on an
                 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
                 * KIND, either express or implied.  See the License for the
                 * specific language governing permissions and limitations
                 * under the License.
                 *
                */

                /**
                 * Network status
                 */
                module.exports = {
                    UNKNOWN: 'unknown',
                    ETHERNET: 'ethernet',
                    WIFI: 'wifi',
                    CELL_2G: '2g',
                    CELL_3G: '3g',
                    CELL_4G: '4g',
                    CELL: 'cellular',
                    NONE: 'none'
                };

            });

            define("cordova-plugin-network-information.network", function (require, exports, module) {
                /*
                 * Licensed to the Apache Software Foundation (ASF) under one
                 * or more contributor license agreements.  See the NOTICE file
                 * distributed with this work for additional information
                 * regarding copyright ownership.  The ASF licenses this file
                 * to you under the Apache License, Version 2.0 (the
                 * "License"); you may not use this file except in compliance
                 * with the License.  You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing,
                 * software distributed under the License is distributed on an
                 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
                 * KIND, either express or implied.  See the License for the
                 * specific language governing permissions and limitations
                 * under the License.
                 *
                */

                var exec = require('cordova/exec');
                var cordova = require('cordova');
                var channel = require('cordova/channel');
                var utils = require('cordova/utils');

                // Link the onLine property with the Cordova-supplied network info.
                // This works because we clobber the navigator object with our own
                // object in bootstrap.js.
                // Browser platform do not need to define this property, because
                // it is already supported by modern browsers
                if (cordova.platformId !== 'browser' && typeof navigator !== 'undefined') {
                    utils.defineGetter(navigator, 'onLine', function () {
                        return this.connection.type !== 'none';
                    });
                }

                function NetworkConnection() {
                    this.type = 'unknown';
                }

                /**
                 * Get connection info
                 *
                 * @param {Function} successCallback The function to call when the Connection data is available
                 * @param {Function} errorCallback The function to call when there is an error getting the Connection data. (OPTIONAL)
                 */
                NetworkConnection.prototype.getInfo = function (successCallback, errorCallback) {
                    exec(successCallback, errorCallback, 'NetworkStatus', 'getConnectionInfo', []);
                };

                var me = new NetworkConnection();
                var timerId = null;
                var timeout = 500;

                channel.createSticky('onCordovaConnectionReady');
                channel.waitForInitialization('onCordovaConnectionReady');

                channel.onCordovaReady.subscribe(function () {
                    me.getInfo(function (info) {
                        me.type = info;
                        if (info === 'none') {
                            // set a timer if still offline at the end of timer send the offline event
                            timerId = setTimeout(function () {
                                cordova.fireDocumentEvent('offline');
                                timerId = null;
                            }, timeout);
                        } else {
                            // If there is a current offline event pending clear it
                            if (timerId !== null) {
                                clearTimeout(timerId);
                                timerId = null;
                            }
                            cordova.fireDocumentEvent('online');
                        }

                        // should only fire this once
                        if (channel.onCordovaConnectionReady.state !== 2) {
                            channel.onCordovaConnectionReady.fire();
                        }
                    },
                        function (e) {
                            // If we can't get the network info we should still tell Cordova
                            // to fire the deviceready event.
                            if (channel.onCordovaConnectionReady.state !== 2) {
                                channel.onCordovaConnectionReady.fire();
                            }
                            console.log('Error initializing Network Connection: ' + e);
                        });
                });

                module.exports = me;

            });

            define("cordova-plugin-screen-orientation.screenorientation", function (require, exports, module) {
                /*
                 *
                 * Licensed to the Apache Software Foundation (ASF) under one
                 * or more contributor license agreements.  See the NOTICE file
                 * distributed with this work for additional information
                 * regarding copyright ownership.  The ASF licenses this file
                 * to you under the Apache License, Version 2.0 (the
                 * "License"); you may not use this file except in compliance
                 * with the License.  You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing,
                 * software distributed under the License is distributed on an
                 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
                 * KIND, either express or implied.  See the License for the
                 * specific language governing permissions and limitations
                 * under the License.
                 *
                 */
                var screenOrientation = {};
                if (!window.OrientationType) {
                    window.OrientationType = {
                        'portrait-primary': 0,
                        'portrait-secondary': 180,
                        'landscape-primary': 90,
                        'landscape-secondary': -90
                    };
                }
                if (!window.OrientationLockType) {
                    window.OrientationLockType = {
                        'portrait-primary': 1,
                        'portrait-secondary': 2,
                        'landscape-primary': 4,
                        'landscape-secondary': 8,
                        'portrait': 3, // either portrait-primary or portrait-secondary.
                        'landscape': 12, // either landscape-primary or landscape-secondary.
                        'any': 15 // All orientations are supported (unlocked orientation)
                    };
                }
                var orientationMask = 1;
                screenOrientation.setOrientation = function (orientation) {
                    orientationMask = window.OrientationLockType[orientation];
                    cordova.exec(null, null, "CDVOrientation", "screenOrientation", [orientationMask, orientation]);
                };

                if (!screen.orientation) {
                    screen.orientation = {};
                }

                setOrientationProperties();

                function addScreenOrientationApi(screenObject) {

                    if (screenObject.unlock || screenObject.lock) {
                        screenObject.nativeLock = screenObject.lock;
                    }

                    screenObject.lock = function (orientation) {
                        var promiseLock;
                        var p = new Promise(function (resolve, reject) {
                            if (screenObject.nativeLock) {
                                promiseLock = screenObject.nativeLock(orientation);
                                promiseLock.then(function success(res) {
                                    resolve();
                                }, function error(err) {
                                    screenObject.nativeLock = null;
                                    resolveOrientation(orientation, resolve, reject);
                                });
                            } else {
                                resolveOrientation(orientation, resolve, reject);
                            }
                        });
                        return p;
                    };
                    screenObject.unlock = function () {
                        screenOrientation.setOrientation('any');
                    };
                }

                function resolveOrientation(orientation, resolve, reject) {
                    if (!OrientationLockType.hasOwnProperty(orientation)) {
                        var err = new Error();
                        err.name = "NotSupportedError";
                        reject(err); //"cannot change orientation");
                    } else {
                        screenOrientation.setOrientation(orientation);
                        resolve("Orientation set"); // orientation change successful
                    }

                }

                addScreenOrientationApi(screen.orientation);

                var onChangeListener = null;

                Object.defineProperty(screen.orientation, 'onchange', {
                    set: function (listener) {

                        if (onChangeListener) {
                            screen.orientation.removeEventListener('change', onChangeListener);
                        }
                        onChangeListener = listener;
                        if (onChangeListener) {
                            screen.orientation.addEventListener('change', onChangeListener);
                        }
                    },
                    get: function () {
                        return (onChangeListener ? onChangeListener : null);
                    },
                    enumerable: true,
                });


                var evtTarget = new XMLHttpRequest(); //document.createElement('div');
                var orientationchange = function () {
                    setOrientationProperties();
                    var event = document.createEvent('Events');
                    event.initEvent("change", false, false);
                    evtTarget.dispatchEvent(event);
                };

                screen.orientation.addEventListener = function (a, b, c) {
                    return evtTarget.addEventListener(a, b, c);
                };

                screen.orientation.removeEventListener = function (a, b, c) {
                    return evtTarget.removeEventListener(a, b, c);
                };

                function setOrientationProperties() {
                    switch (window.orientation) {
                        case 0:
                            screen.orientation.type = 'portrait-primary';
                            break;
                        case 90:
                            screen.orientation.type = 'landscape-primary';
                            break;
                        case 180:
                            screen.orientation.type = 'portrait-secondary';
                            break;
                        case -90:
                            screen.orientation.type = 'landscape-secondary';
                            break;
                        default:
                            screen.orientation.type = 'portrait-primary';
                            break;
                    }
                    screen.orientation.angle = window.orientation || 0;

                }
                window.addEventListener("orientationchange", orientationchange, true);

                module.exports = screenOrientation;

            });

            define("cordova-plugin-vibration.notification", function (require, exports, module) {
                /*
                 *
                 * Licensed to the Apache Software Foundation (ASF) under one
                 * or more contributor license agreements.  See the NOTICE file
                 * distributed with this work for additional information
                 * regarding copyright ownership.  The ASF licenses this file
                 * to you under the Apache License, Version 2.0 (the
                 * "License"); you may not use this file except in compliance
                 * with the License.  You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing,
                 * software distributed under the License is distributed on an
                 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
                 * KIND, either express or implied.  See the License for the
                 * specific language governing permissions and limitations
                 * under the License.
                 *
                */

                var exec = require('cordova/exec');

                /**
                 * Provides access to the vibration mechanism on the device.
                 */

                module.exports = {

                    /**
                     * Vibrates the device for a given amount of time or for a given pattern or immediately cancels any ongoing vibrations (depending on the parameter).
                     *
                     * @param {Integer} param       The number of milliseconds to vibrate (if 0, cancels vibration)
                     *
                     *
                     * @param {Array of Integer} param    Pattern with which to vibrate the device.
                     *                                      Pass in an array of integers that
                     *                                      are the durations for which to
                     *                                      turn on or off the vibrator in
                     *                                      milliseconds. The FIRST value
                     *                                      indicates the
                     *                                      number of milliseconds for which
                     *                                      to keep the vibrator ON before
                     *                                      turning it off. The NEXT value indicates the
                     *                                      number of milliseconds for which
                     *                                      to keep the vibrator OFF before
                     *                                      turning it on. Subsequent values
                     *                                      alternate between durations in
                     *                                      milliseconds to turn the vibrator
                     *                                      off or to turn the vibrator on.
                     *                                      (if empty, cancels vibration)
                     */
                    vibrate: function (param) {
                        /* Aligning with w3c spec */

                        // vibrate
                        if ((typeof param === 'number') && param !== 0) {
                            exec(null, null, 'Vibration', 'vibrate', [param]);

                            // vibrate with array ( i.e. vibrate([3000]) )
                        } else if ((typeof param === 'object') && param.length === 1) {
                            // cancel if vibrate([0])
                            if (param[0] === 0) {
                                exec(null, null, 'Vibration', 'cancelVibration', []);

                                // else vibrate
                            } else {
                                exec(null, null, 'Vibration', 'vibrate', [param[0]]);
                            }

                            // vibrate with a pattern
                        } else if ((typeof param === 'object') && param.length > 1) {
                            var repeat = -1; // no repeat
                            exec(null, null, 'Vibration', 'vibrateWithPattern', [param, repeat]);

                            // cancel vibration (param = 0 or [])
                        } else { exec(null, null, 'Vibration', 'cancelVibration', []); }

                        return true;
                    }
                };

            });

            // file:../plugins/cordova-plugin-file/browser/isChrome.js
            define("cordova-plugin-file.isChrome", function (require, exports, module) {

                module.exports = function () {
                    // window.webkitRequestFileSystem and window.webkitResolveLocalFileSystemURL are available only in Chrome and
                    // possibly a good flag to indicate that we're running in Chrome
                    return window.webkitRequestFileSystem && window.webkitResolveLocalFileSystemURL;
                };

            });

            // file:../plugins/cordova-plugin-file/ios/FileSystem.js
            define("cordova-plugin-file.iosFileSystem", function (require, exports, module) {
                /* eslint no-undef : 0 */
                FILESYSTEM_PROTOCOL = 'cdvfile';

                module.exports = {
                    __format__: function (fullPath) {
                        var path = ('/' + this.name + (fullPath[0] === '/' ? '' : '/') + FileSystem.encodeURIPath(fullPath)).replace('//', '/');
                        return FILESYSTEM_PROTOCOL + '://localhost' + path;
                    }
                };

            });

            // file:../plugins/cordova-plugin-file/DirectoryEntry.js
            define("cordova-plugin-file.DirectoryEntry", function (require, exports, module) {

                var argscheck = require('cordova/argscheck');
                var utils = require('cordova/utils');
                var exec = require('cordova/exec');
                var Entry = require('./Entry');
                var FileError = require('./FileError');
                var DirectoryReader = require('./DirectoryReader');

                /**
                 * An interface representing a directory on the file system.
                 *
                 * {boolean} isFile always false (readonly)
                 * {boolean} isDirectory always true (readonly)
                 * {DOMString} name of the directory, excluding the path leading to it (readonly)
                 * {DOMString} fullPath the absolute full path to the directory (readonly)
                 * {FileSystem} filesystem on which the directory resides (readonly)
                 */
                var DirectoryEntry = function (name, fullPath, fileSystem, nativeURL) {

                    // add trailing slash if it is missing
                    if ((fullPath) && !/\/$/.test(fullPath)) {
                        fullPath += '/';
                    }
                    // add trailing slash if it is missing
                    if (nativeURL && !/\/$/.test(nativeURL)) {
                        nativeURL += '/';
                    }
                    DirectoryEntry.__super__.constructor.call(this, false, true, name, fullPath, fileSystem, nativeURL);
                };

                utils.extend(DirectoryEntry, Entry);

                /**
                 * Creates a new DirectoryReader to read entries from this directory
                 */
                DirectoryEntry.prototype.createReader = function () {
                    return new DirectoryReader(this.toInternalURL());
                };

                /**
                 * Creates or looks up a directory
                 *
                 * @param {DOMString} path either a relative or absolute path from this directory in which to look up or create a directory
                 * @param {Flags} options to create or exclusively create the directory
                 * @param {Function} successCallback is called with the new entry
                 * @param {Function} errorCallback is called with a FileError
                 */
                DirectoryEntry.prototype.getDirectory = function (path, options, successCallback, errorCallback) {
                    argscheck.checkArgs('sOFF', 'DirectoryEntry.getDirectory', arguments);
                    var fs = this.filesystem;
                    var win = successCallback && function (result) {
                        var entry = new DirectoryEntry(result.name, result.fullPath, fs, result.nativeURL);
                        successCallback(entry);
                    };
                    var fail = errorCallback && function (code) {
                        errorCallback(new FileError(code));
                    };
                    exec(win, fail, 'File', 'getDirectory', [this.toInternalURL(), path, options]);
                };

                /**
                 * Deletes a directory and all of it's contents
                 *
                 * @param {Function} successCallback is called with no parameters
                 * @param {Function} errorCallback is called with a FileError
                 */
                DirectoryEntry.prototype.removeRecursively = function (successCallback, errorCallback) {
                    argscheck.checkArgs('FF', 'DirectoryEntry.removeRecursively', arguments);
                    var fail = errorCallback && function (code) {
                        errorCallback(new FileError(code));
                    };
                    exec(successCallback, fail, 'File', 'removeRecursively', [this.toInternalURL()]);
                };

                /**
                 * Creates or looks up a file
                 *
                 * @param {DOMString} path either a relative or absolute path from this directory in which to look up or create a file
                 * @param {Flags} options to create or exclusively create the file
                 * @param {Function} successCallback is called with the new entry
                 * @param {Function} errorCallback is called with a FileError
                 */
                DirectoryEntry.prototype.getFile = function (path, options, successCallback, errorCallback) {
                    argscheck.checkArgs('sOFF', 'DirectoryEntry.getFile', arguments);
                    var fs = this.filesystem;
                    var win = successCallback && function (result) {
                        var FileEntry = require('./FileEntry');
                        var entry = new FileEntry(result.name, result.fullPath, fs, result.nativeURL);
                        successCallback(entry);
                    };
                    var fail = errorCallback && function (code) {
                        errorCallback(new FileError(code));
                    };
                    exec(win, fail, 'File', 'getFile', [this.toInternalURL(), path, options]);
                };

                module.exports = DirectoryEntry;

            });

            // file:../plugins/cordova-plugin-file/DirectoryReader.js
            define("cordova-plugin-file.DirectoryReader", function (require, exports, module) {

                var exec = require('cordova/exec');
                var FileError = require('./FileError');

                /**
                 * An interface that lists the files and directories in a directory.
                 */
                function DirectoryReader(localURL) {
                    this.localURL = localURL || null;
                    this.hasReadEntries = false;
                }

                /**
                 * Returns a list of entries from a directory.
                 *
                 * @param {Function} successCallback is called with a list of entries
                 * @param {Function} errorCallback is called with a FileError
                 */
                DirectoryReader.prototype.readEntries = function (successCallback, errorCallback) {
                    // If we've already read and passed on this directory's entries, return an empty list.
                    if (this.hasReadEntries) {
                        successCallback([]);
                        return;
                    }
                    var reader = this;
                    var win = typeof successCallback !== 'function' ? null : function (result) {
                        var retVal = [];
                        for (var i = 0; i < result.length; i++) {
                            var entry = null;
                            if (result[i].isDirectory) {
                                entry = new (require('./DirectoryEntry'))();
                            } else if (result[i].isFile) {
                                entry = new (require('./FileEntry'))();
                            }
                            entry.isDirectory = result[i].isDirectory;
                            entry.isFile = result[i].isFile;
                            entry.name = result[i].name;
                            entry.fullPath = result[i].fullPath;
                            entry.filesystem = new (require('./FileSystem'))(result[i].filesystemName);
                            entry.nativeURL = result[i].nativeURL;
                            retVal.push(entry);
                        }
                        reader.hasReadEntries = true;
                        successCallback(retVal);
                    };
                    var fail = typeof errorCallback !== 'function' ? null : function (code) {
                        errorCallback(new FileError(code));
                    };
                    exec(win, fail, 'File', 'readEntries', [this.localURL]);
                };

                module.exports = DirectoryReader;

            });

            // file:../plugins/cordova-plugin-file/Entry.js
            define("cordova-plugin-file.Entry", function (require, exports, module) {

                var argscheck = require('cordova/argscheck');
                var exec = require('cordova/exec');
                var FileError = require('./FileError');
                var Metadata = require('./Metadata');

                /**
                 * Represents a file or directory on the local file system.
                 *
                 * @param isFile
                 *            {boolean} true if Entry is a file (readonly)
                 * @param isDirectory
                 *            {boolean} true if Entry is a directory (readonly)
                 * @param name
                 *            {DOMString} name of the file or directory, excluding the path
                 *            leading to it (readonly)
                 * @param fullPath
                 *            {DOMString} the absolute full path to the file or directory
                 *            (readonly)
                 * @param fileSystem
                 *            {FileSystem} the filesystem on which this entry resides
                 *            (readonly)
                 * @param nativeURL
                 *            {DOMString} an alternate URL which can be used by native
                 *            webview controls, for example media players.
                 *            (optional, readonly)
                 */
                function Entry(isFile, isDirectory, name, fullPath, fileSystem, nativeURL) {
                    this.isFile = !!isFile;
                    this.isDirectory = !!isDirectory;
                    this.name = name || '';
                    this.fullPath = fullPath || '';
                    this.filesystem = fileSystem || null;
                    this.nativeURL = nativeURL || null;
                }

                /**
                 * Look up the metadata of the entry.
                 *
                 * @param successCallback
                 *            {Function} is called with a Metadata object
                 * @param errorCallback
                 *            {Function} is called with a FileError
                 */
                Entry.prototype.getMetadata = function (successCallback, errorCallback) {
                    argscheck.checkArgs('FF', 'Entry.getMetadata', arguments);
                    var success = successCallback && function (entryMetadata) {
                        var metadata = new Metadata({
                            size: entryMetadata.size,
                            modificationTime: entryMetadata.lastModifiedDate
                        });
                        successCallback(metadata);
                    };
                    var fail = errorCallback && function (code) {
                        errorCallback(new FileError(code));
                    };
                    exec(success, fail, 'File', 'getFileMetadata', [this.toInternalURL()]);
                };

                /**
                 * Set the metadata of the entry.
                 *
                 * @param successCallback
                 *            {Function} is called with a Metadata object
                 * @param errorCallback
                 *            {Function} is called with a FileError
                 * @param metadataObject
                 *            {Object} keys and values to set
                 */
                Entry.prototype.setMetadata = function (successCallback, errorCallback, metadataObject) {
                    argscheck.checkArgs('FFO', 'Entry.setMetadata', arguments);
                    exec(successCallback, errorCallback, 'File', 'setMetadata', [this.toInternalURL(), metadataObject]);
                };

                /**
                 * Move a file or directory to a new location.
                 *
                 * @param parent
                 *            {DirectoryEntry} the directory to which to move this entry
                 * @param newName
                 *            {DOMString} new name of the entry, defaults to the current name
                 * @param successCallback
                 *            {Function} called with the new DirectoryEntry object
                 * @param errorCallback
                 *            {Function} called with a FileError
                 */
                Entry.prototype.moveTo = function (parent, newName, successCallback, errorCallback) {
                    argscheck.checkArgs('oSFF', 'Entry.moveTo', arguments);
                    var fail = errorCallback && function (code) {
                        errorCallback(new FileError(code));
                    };
                    var srcURL = this.toInternalURL();
                    // entry name
                    var name = newName || this.name;
                    var success = function (entry) {
                        if (entry) {
                            if (successCallback) {
                                // create appropriate Entry object
                                var newFSName = entry.filesystemName || (entry.filesystem && entry.filesystem.name);
                                var fs = newFSName ? new FileSystem(newFSName, { name: '', fullPath: '/' }) : new FileSystem(parent.filesystem.name, { name: '', fullPath: '/' }); // eslint-disable-line no-undef
                                var result = (entry.isDirectory) ? new (require('./DirectoryEntry'))(entry.name, entry.fullPath, fs, entry.nativeURL) : new (require('cordova-plugin-file.FileEntry'))(entry.name, entry.fullPath, fs, entry.nativeURL);
                                successCallback(result);
                            }
                        } else {
                            // no Entry object returned
                            if (fail) {
                                fail(FileError.NOT_FOUND_ERR);
                            }
                        }
                    };

                    // copy
                    exec(success, fail, 'File', 'moveTo', [srcURL, parent.toInternalURL(), name]);
                };

                /**
                 * Copy a directory to a different location.
                 *
                 * @param parent
                 *            {DirectoryEntry} the directory to which to copy the entry
                 * @param newName
                 *            {DOMString} new name of the entry, defaults to the current name
                 * @param successCallback
                 *            {Function} called with the new Entry object
                 * @param errorCallback
                 *            {Function} called with a FileError
                 */
                Entry.prototype.copyTo = function (parent, newName, successCallback, errorCallback) {
                    argscheck.checkArgs('oSFF', 'Entry.copyTo', arguments);
                    var fail = errorCallback && function (code) {
                        errorCallback(new FileError(code));
                    };
                    var srcURL = this.toInternalURL();
                    // entry name
                    var name = newName || this.name;
                    // success callback
                    var success = function (entry) {
                        if (entry) {
                            if (successCallback) {
                                // create appropriate Entry object
                                var newFSName = entry.filesystemName || (entry.filesystem && entry.filesystem.name);
                                var fs = newFSName ? new FileSystem(newFSName, { name: '', fullPath: '/' }) : new FileSystem(parent.filesystem.name, { name: '', fullPath: '/' }); // eslint-disable-line no-undef
                                var result = (entry.isDirectory) ? new (require('./DirectoryEntry'))(entry.name, entry.fullPath, fs, entry.nativeURL) : new (require('cordova-plugin-file.FileEntry'))(entry.name, entry.fullPath, fs, entry.nativeURL);
                                successCallback(result);
                            }
                        } else {
                            // no Entry object returned
                            if (fail) {
                                fail(FileError.NOT_FOUND_ERR);
                            }
                        }
                    };

                    // copy
                    exec(success, fail, 'File', 'copyTo', [srcURL, parent.toInternalURL(), name]);
                };

                /**
                 * Return a URL that can be passed across the bridge to identify this entry.
                 */
                Entry.prototype.toInternalURL = function () {
                    if (this.filesystem && this.filesystem.__format__) {
                        return this.filesystem.__format__(this.fullPath, this.nativeURL);
                    }
                };

                /**
                 * Return a URL that can be used to identify this entry.
                 * Use a URL that can be used to as the src attribute of a <video> or
                 * <audio> tag. If that is not possible, construct a cdvfile:// URL.
                 */
                Entry.prototype.toURL = function () {
                    if (this.nativeURL) {
                        return this.nativeURL;
                    }
                    // fullPath attribute may contain the full URL in the case that
                    // toInternalURL fails.
                    return this.toInternalURL() || 'file://localhost' + this.fullPath;
                };

                /**
                 * Backwards-compatibility: In v1.0.0 - 1.0.2, .toURL would only return a
                 * cdvfile:// URL, and this method was necessary to obtain URLs usable by the
                 * webview.
                 * See CB-6051, CB-6106, CB-6117, CB-6152, CB-6199, CB-6201, CB-6243, CB-6249,
                 * and CB-6300.
                 */
                Entry.prototype.toNativeURL = function () {
                    console.log("DEPRECATED: Update your code to use 'toURL'");
                    return this.toURL();
                };

                /**
                 * Returns a URI that can be used to identify this entry.
                 *
                 * @param {DOMString} mimeType for a FileEntry, the mime type to be used to interpret the file, when loaded through this URI.
                 * @return uri
                 */
                Entry.prototype.toURI = function (mimeType) {
                    console.log("DEPRECATED: Update your code to use 'toURL'");
                    return this.toURL();
                };

                /**
                 * Remove a file or directory. It is an error to attempt to delete a
                 * directory that is not empty. It is an error to attempt to delete a
                 * root directory of a file system.
                 *
                 * @param successCallback {Function} called with no parameters
                 * @param errorCallback {Function} called with a FileError
                 */
                Entry.prototype.remove = function (successCallback, errorCallback) {
                    argscheck.checkArgs('FF', 'Entry.remove', arguments);
                    var fail = errorCallback && function (code) {
                        errorCallback(new FileError(code));
                    };
                    exec(successCallback, fail, 'File', 'remove', [this.toInternalURL()]);
                };

                /**
                 * Look up the parent DirectoryEntry of this entry.
                 *
                 * @param successCallback {Function} called with the parent DirectoryEntry object
                 * @param errorCallback {Function} called with a FileError
                 */
                Entry.prototype.getParent = function (successCallback, errorCallback) {
                    argscheck.checkArgs('FF', 'Entry.getParent', arguments);
                    var fs = this.filesystem;
                    var win = successCallback && function (result) {
                        var DirectoryEntry = require('./DirectoryEntry');
                        var entry = new DirectoryEntry(result.name, result.fullPath, fs, result.nativeURL);
                        successCallback(entry);
                    };
                    var fail = errorCallback && function (code) {
                        errorCallback(new FileError(code));
                    };
                    exec(win, fail, 'File', 'getParent', [this.toInternalURL()]);
                };

                module.exports = Entry;

            });

            // file:../plugins/cordova-plugin-file/File.js
            define("cordova-plugin-file.File", function (require, exports, module) {

                /**
                 * Constructor.
                 * name {DOMString} name of the file, without path information
                 * fullPath {DOMString} the full path of the file, including the name
                 * type {DOMString} mime type
                 * lastModifiedDate {Date} last modified date
                 * size {Number} size of the file in bytes
                 */

                var File = function (name, localURL, type, lastModifiedDate, size) {
                    this.name = name || '';
                    this.localURL = localURL || null;
                    this.type = type || null;
                    this.lastModified = lastModifiedDate || null;
                    // For backwards compatibility, store the timestamp in lastModifiedDate as well
                    this.lastModifiedDate = lastModifiedDate || null;
                    this.size = size || 0;

                    // These store the absolute start and end for slicing the file.
                    this.start = 0;
                    this.end = this.size;
                };

                /**
                 * Returns a "slice" of the file. Since Cordova Files don't contain the actual
                 * content, this really returns a File with adjusted start and end.
                 * Slices of slices are supported.
                 * start {Number} The index at which to start the slice (inclusive).
                 * end {Number} The index at which to end the slice (exclusive).
                 */
                File.prototype.slice = function (start, end) {
                    var size = this.end - this.start;
                    var newStart = 0;
                    var newEnd = size;
                    if (arguments.length) {
                        if (start < 0) {
                            newStart = Math.max(size + start, 0);
                        } else {
                            newStart = Math.min(size, start);
                        }
                    }

                    if (arguments.length >= 2) {
                        if (end < 0) {
                            newEnd = Math.max(size + end, 0);
                        } else {
                            newEnd = Math.min(end, size);
                        }
                    }

                    var newFile = new File(this.name, this.localURL, this.type, this.lastModified, this.size);
                    newFile.start = this.start + newStart;
                    newFile.end = this.start + newEnd;
                    return newFile;
                };

                module.exports = File;

            });

            // file:../plugins/cordova-plugin-file/FileEntry.js
            define("cordova-plugin-file.FileEntry", function (require, exports, module) {

                var utils = require('cordova/utils');
                var exec = require('cordova/exec');
                var Entry = require('./Entry');
                var FileWriter = require('./FileWriter');
                var File = require('./File');
                var FileError = require('./FileError');

                /**
                 * An interface representing a file on the file system.
                 *
                 * {boolean} isFile always true (readonly)
                 * {boolean} isDirectory always false (readonly)
                 * {DOMString} name of the file, excluding the path leading to it (readonly)
                 * {DOMString} fullPath the absolute full path to the file (readonly)
                 * {FileSystem} filesystem on which the file resides (readonly)
                 */
                var FileEntry = function (name, fullPath, fileSystem, nativeURL) {
                    // remove trailing slash if it is present
                    if (fullPath && /\/$/.test(fullPath)) {
                        fullPath = fullPath.substring(0, fullPath.length - 1);
                    }
                    if (nativeURL && /\/$/.test(nativeURL)) {
                        nativeURL = nativeURL.substring(0, nativeURL.length - 1);
                    }

                    FileEntry.__super__.constructor.apply(this, [true, false, name, fullPath, fileSystem, nativeURL]);
                };

                utils.extend(FileEntry, Entry);

                /**
                 * Creates a new FileWriter associated with the file that this FileEntry represents.
                 *
                 * @param {Function} successCallback is called with the new FileWriter
                 * @param {Function} errorCallback is called with a FileError
                 */
                FileEntry.prototype.createWriter = function (successCallback, errorCallback) {
                    this.file(function (filePointer) {
                        var writer = new FileWriter(filePointer);

                        if (writer.localURL === null || writer.localURL === '') {
                            if (errorCallback) {
                                errorCallback(new FileError(FileError.INVALID_STATE_ERR));
                            }
                        } else {
                            if (successCallback) {
                                successCallback(writer);
                            }
                        }
                    }, errorCallback);
                };

                /**
                 * Returns a File that represents the current state of the file that this FileEntry represents.
                 *
                 * @param {Function} successCallback is called with the new File object
                 * @param {Function} errorCallback is called with a FileError
                 */
                FileEntry.prototype.file = function (successCallback, errorCallback) {
                    var localURL = this.toInternalURL();
                    var win = successCallback && function (f) {
                        var file = new File(f.name, localURL, f.type, f.lastModifiedDate, f.size);
                        successCallback(file);
                    };
                    var fail = errorCallback && function (code) {
                        errorCallback(new FileError(code));
                    };
                    exec(win, fail, 'File', 'getFileMetadata', [localURL]);
                };

                module.exports = FileEntry;

            });

            // file:../plugins/cordova-plugin-file/FileError.js
            define("cordova-plugin-file.FileError", function (require, exports, module) {
                /**
                 * FileError
                 */
                function FileError(error) {
                    this.code = error || null;
                }

                // File error codes
                // Found in DOMException
                FileError.NOT_FOUND_ERR = 1;
                FileError.SECURITY_ERR = 2;
                FileError.ABORT_ERR = 3;

                // Added by File API specification
                FileError.NOT_READABLE_ERR = 4;
                FileError.ENCODING_ERR = 5;
                FileError.NO_MODIFICATION_ALLOWED_ERR = 6;
                FileError.INVALID_STATE_ERR = 7;
                FileError.SYNTAX_ERR = 8;
                FileError.INVALID_MODIFICATION_ERR = 9;
                FileError.QUOTA_EXCEEDED_ERR = 10;
                FileError.TYPE_MISMATCH_ERR = 11;
                FileError.PATH_EXISTS_ERR = 12;

                module.exports = FileError;

            });

            // file:../plugins/cordova-plugin-file/FileReader.js
            define("cordova-plugin-file.FileReader", function (require, exports, module) {

                var exec = require('cordova/exec');
                var modulemapper = require('cordova/modulemapper');
                var utils = require('cordova/utils');
                var FileError = require('./FileError');
                var ProgressEvent = require('./ProgressEvent');
                var origFileReader = modulemapper.getOriginalSymbol(window, 'FileReader');

                /**
                 * This class reads the mobile device file system.
                 *
                 * For Android:
                 *      The root directory is the root of the file system.
                 *      To read from the SD card, the file name is "sdcard/my_file.txt"
                 * @constructor
                 */
                var FileReader = function () {
                    this._readyState = 0;
                    this._error = null;
                    this._result = null;
                    this._progress = null;
                    this._localURL = '';
                    this._realReader = origFileReader ? new origFileReader() : {}; // eslint-disable-line new-cap
                };

                /**
                 * Defines the maximum size to read at a time via the native API. The default value is a compromise between
                 * minimizing the overhead of many exec() calls while still reporting progress frequently enough for large files.
                 * (Note attempts to allocate more than a few MB of contiguous memory on the native side are likely to cause
                 * OOM exceptions, while the JS engine seems to have fewer problems managing large strings or ArrayBuffers.)
                 */
                FileReader.READ_CHUNK_SIZE = 256 * 1024;

                // States
                FileReader.EMPTY = 0;
                FileReader.LOADING = 1;
                FileReader.DONE = 2;

                utils.defineGetter(FileReader.prototype, 'readyState', function () {
                    return this._localURL ? this._readyState : this._realReader.readyState;
                });

                utils.defineGetter(FileReader.prototype, 'error', function () {
                    return this._localURL ? this._error : this._realReader.error;
                });

                utils.defineGetter(FileReader.prototype, 'result', function () {
                    return this._localURL ? this._result : this._realReader.result;
                });

                function defineEvent(eventName) {
                    utils.defineGetterSetter(FileReader.prototype, eventName, function () {
                        return this._realReader[eventName] || null;
                    }, function (value) {
                        this._realReader[eventName] = value;
                    });
                }
                defineEvent('onloadstart');    // When the read starts.
                defineEvent('onprogress');     // While reading (and decoding) file or fileBlob data, and reporting partial file data (progress.loaded/progress.total)
                defineEvent('onload');         // When the read has successfully completed.
                defineEvent('onerror');        // When the read has failed (see errors).
                defineEvent('onloadend');      // When the request has completed (either in success or failure).
                defineEvent('onabort');        // When the read has been aborted. For instance, by invoking the abort() method.

                function initRead(reader, file) {
                    // Already loading something
                    if (reader.readyState === FileReader.LOADING) {
                        throw new FileError(FileError.INVALID_STATE_ERR);
                    }

                    reader._result = null;
                    reader._error = null;
                    reader._progress = 0;
                    reader._readyState = FileReader.LOADING;

                    if (typeof file.localURL === 'string') {
                        reader._localURL = file.localURL;
                    } else {
                        reader._localURL = '';
                        return true;
                    }

                    if (reader.onloadstart) {
                        reader.onloadstart(new ProgressEvent('loadstart', { target: reader }));
                    }
                }

                /**
                 * Callback used by the following read* functions to handle incremental or final success.
                 * Must be bound to the FileReader's this along with all but the last parameter,
                 * e.g. readSuccessCallback.bind(this, "readAsText", "UTF-8", offset, totalSize, accumulate)
                 * @param readType The name of the read function to call.
                 * @param encoding Text encoding, or null if this is not a text type read.
                 * @param offset Starting offset of the read.
                 * @param totalSize Total number of bytes or chars to read.
                 * @param accumulate A function that takes the callback result and accumulates it in this._result.
                 * @param r Callback result returned by the last read exec() call, or null to begin reading.
                 */
                function readSuccessCallback(readType, encoding, offset, totalSize, accumulate, r) {
                    if (this._readyState === FileReader.DONE) {
                        return;
                    }

                    var CHUNK_SIZE = FileReader.READ_CHUNK_SIZE;
                    if (readType === 'readAsDataURL') {
                        // Windows proxy does not support reading file slices as Data URLs
                        // so read the whole file at once.
                        CHUNK_SIZE = cordova.platformId === 'windows' ? totalSize : // eslint-disable-line no-undef
                            // Calculate new chunk size for data URLs to be multiply of 3
                            // Otherwise concatenated base64 chunks won't be valid base64 data
                            FileReader.READ_CHUNK_SIZE - (FileReader.READ_CHUNK_SIZE % 3) + 3;
                    }

                    if (typeof r !== 'undefined') {
                        accumulate(r);
                        this._progress = Math.min(this._progress + CHUNK_SIZE, totalSize);

                        if (typeof this.onprogress === 'function') {
                            this.onprogress(new ProgressEvent('progress', { loaded: this._progress, total: totalSize }));
                        }
                    }

                    if (typeof r === 'undefined' || this._progress < totalSize) {
                        var execArgs = [
                            this._localURL,
                            offset + this._progress,
                            offset + this._progress + Math.min(totalSize - this._progress, CHUNK_SIZE)];
                        if (encoding) {
                            execArgs.splice(1, 0, encoding);
                        }
                        exec(
                            readSuccessCallback.bind(this, readType, encoding, offset, totalSize, accumulate),
                            readFailureCallback.bind(this),
                            'File', readType, execArgs);
                    } else {
                        this._readyState = FileReader.DONE;

                        if (typeof this.onload === 'function') {
                            this.onload(new ProgressEvent('load', { target: this }));
                        }

                        if (typeof this.onloadend === 'function') {
                            this.onloadend(new ProgressEvent('loadend', { target: this }));
                        }
                    }
                }

                /**
                 * Callback used by the following read* functions to handle errors.
                 * Must be bound to the FileReader's this, e.g. readFailureCallback.bind(this)
                 */
                function readFailureCallback(e) {
                    if (this._readyState === FileReader.DONE) {
                        return;
                    }

                    this._readyState = FileReader.DONE;
                    this._result = null;
                    this._error = new FileError(e);

                    if (typeof this.onerror === 'function') {
                        this.onerror(new ProgressEvent('error', { target: this }));
                    }

                    if (typeof this.onloadend === 'function') {
                        this.onloadend(new ProgressEvent('loadend', { target: this }));
                    }
                }

                /**
                 * Abort reading file.
                 */
                FileReader.prototype.abort = function () {
                    if (origFileReader && !this._localURL) {
                        return this._realReader.abort();
                    }
                    this._result = null;

                    if (this._readyState === FileReader.DONE || this._readyState === FileReader.EMPTY) {
                        return;
                    }

                    this._readyState = FileReader.DONE;

                    // If abort callback
                    if (typeof this.onabort === 'function') {
                        this.onabort(new ProgressEvent('abort', { target: this }));
                    }
                    // If load end callback
                    if (typeof this.onloadend === 'function') {
                        this.onloadend(new ProgressEvent('loadend', { target: this }));
                    }
                };

                /**
                 * Read text file.
                 *
                 * @param file          {File} File object containing file properties
                 * @param encoding      [Optional] (see http://www.iana.org/assignments/character-sets)
                 */
                FileReader.prototype.readAsText = function (file, encoding) {
                    if (initRead(this, file)) {
                        return this._realReader.readAsText(file, encoding);
                    }

                    // Default encoding is UTF-8
                    var enc = encoding || 'UTF-8';

                    var totalSize = file.end - file.start;
                    readSuccessCallback.bind(this)('readAsText', enc, file.start, totalSize, function (r) {
                        if (this._progress === 0) {
                            this._result = '';
                        }
                        this._result += r;
                    }.bind(this));
                };

                /**
                 * Read file and return data as a base64 encoded data url.
                 * A data url is of the form:
                 *      data:[<mediatype>][;base64],<data>
                 *
                 * @param file          {File} File object containing file properties
                 */
                FileReader.prototype.readAsDataURL = function (file) {
                    if (initRead(this, file)) {
                        return this._realReader.readAsDataURL(file);
                    }

                    var totalSize = file.end - file.start;
                    readSuccessCallback.bind(this)('readAsDataURL', null, file.start, totalSize, function (r) {
                        var commaIndex = r.indexOf(',');
                        if (this._progress === 0) {
                            this._result = r;
                        } else {
                            this._result += r.substring(commaIndex + 1);
                        }
                    }.bind(this));
                };

                /**
                 * Read file and return data as a binary data.
                 *
                 * @param file          {File} File object containing file properties
                 */
                FileReader.prototype.readAsBinaryString = function (file) {
                    if (initRead(this, file)) {
                        return this._realReader.readAsBinaryString(file);
                    }

                    var totalSize = file.end - file.start;
                    readSuccessCallback.bind(this)('readAsBinaryString', null, file.start, totalSize, function (r) {
                        if (this._progress === 0) {
                            this._result = '';
                        }
                        this._result += r;
                    }.bind(this));
                };

                /**
                 * Read file and return data as a binary data.
                 *
                 * @param file          {File} File object containing file properties
                 */
                FileReader.prototype.readAsArrayBuffer = function (file) {
                    if (initRead(this, file)) {
                        return this._realReader.readAsArrayBuffer(file);
                    }

                    var totalSize = file.end - file.start;
                    readSuccessCallback.bind(this)('readAsArrayBuffer', null, file.start, totalSize, function (r) {
                        var resultArray = (this._progress === 0 ? new Uint8Array(totalSize) : new Uint8Array(this._result));
                        resultArray.set(new Uint8Array(r), this._progress);
                        this._result = resultArray.buffer;
                    }.bind(this));
                };

                module.exports = FileReader;

            });

            // file:../plugins/cordova-plugin-file/FileSystem.js
            define("cordova-plugin-file.FileSystem", function (require, exports, module) {

                var DirectoryEntry = require('./DirectoryEntry');

                /**
                 * An interface representing a file system
                 *
                 * @constructor
                 * {DOMString} name the unique name of the file system (readonly)
                 * {DirectoryEntry} root directory of the file system (readonly)
                 */
                var FileSystem = function (name, root) {
                    this.name = name;
                    if (root) {
                        this.root = new DirectoryEntry(root.name, root.fullPath, this, root.nativeURL);
                    } else {
                        this.root = new DirectoryEntry(this.name, '/', this);
                    }
                };

                FileSystem.prototype.__format__ = function (fullPath, nativeUrl) {
                    return fullPath;
                };

                FileSystem.prototype.toJSON = function () {
                    return '<FileSystem: ' + this.name + '>';
                };

                // Use instead of encodeURI() when encoding just the path part of a URI rather than an entire URI.
                FileSystem.encodeURIPath = function (path) {
                    // Because # is a valid filename character, it must be encoded to prevent part of the
                    // path from being parsed as a URI fragment.
                    return encodeURI(path).replace(/#/g, '%23');
                };

                module.exports = FileSystem;

            });

            // file:../plugins/cordova-plugin-file/fileSystemPaths.js
            define("cordova-plugin-file.fileSystemPaths", function (require, exports, module) {

                var exec = require('cordova/exec');
                var channel = require('cordova/channel');

                exports.file = {
                    // Read-only directory where the application is installed.
                    applicationDirectory: null,
                    // Root of app's private writable storage
                    applicationStorageDirectory: null,
                    // Where to put app-specific data files.
                    dataDirectory: null,
                    // Cached files that should survive app restarts.
                    // Apps should not rely on the OS to delete files in here.
                    cacheDirectory: null,
                    // Android: the application space on external storage.
                    externalApplicationStorageDirectory: null,
                    // Android: Where to put app-specific data files on external storage.
                    externalDataDirectory: null,
                    // Android: the application cache on external storage.
                    externalCacheDirectory: null,
                    // Android: the external storage (SD card) root.
                    externalRootDirectory: null,
                    // iOS: Temp directory that the OS can clear at will.
                    tempDirectory: null,
                    // iOS: Holds app-specific files that should be synced (e.g. to iCloud).
                    syncedDataDirectory: null,
                    // iOS: Files private to the app, but that are meaningful to other applications (e.g. Office files)
                    documentsDirectory: null,
                    // BlackBerry10: Files globally available to all apps
                    sharedDirectory: null
                };

                channel.waitForInitialization('onFileSystemPathsReady');
                channel.onCordovaReady.subscribe(function () {
                    function after(paths) {
                        for (var k in paths) {
                            exports.file[k] = paths[k];
                        }
                        channel.initializationComplete('onFileSystemPathsReady');
                    }
                    exec(after, null, 'File', 'requestAllPaths', []);
                });

            });

            // file:../plugins/cordova-plugin-file/fileSystems.js
            define("cordova-plugin-file.fileSystems", function (require, exports, module) {

                // Overridden by Android, BlackBerry 10 and iOS to populate fsMap.
                module.exports.getFs = function (name, callback) {
                    callback(null);
                };

            });

            // file:../plugins/cordova-plugin-file/fileSystems-roots.js
            define("cordova-plugin-file.fileSystems-roots", function (require, exports, module) {
                // Map of fsName -> FileSystem.
                var fsMap = null;
                var FileSystem = require('./FileSystem');
                var exec = require('cordova/exec');

                // Overridden by Android, BlackBerry 10 and iOS to populate fsMap.
                require('./fileSystems').getFs = function (name, callback) {
                    function success(response) {
                        fsMap = {};
                        for (var i = 0; i < response.length; ++i) {
                            var fsRoot = response[i];
                            if (fsRoot) {
                                var fs = new FileSystem(fsRoot.filesystemName, fsRoot);
                                fsMap[fs.name] = fs;
                            }
                        }
                        callback(fsMap[name]);
                    }

                    if (fsMap) {
                        callback(fsMap[name]);
                    } else {
                        exec(success, null, 'File', 'requestAllFileSystems', []);
                    }
                };

            });

            // file:../plugins/cordova-plugin-file/FileUploadOptions.js
            define("cordova-plugin-file.FileUploadOptions", function (require, exports, module) {

                /**
                 * Options to customize the HTTP request used to upload files.
                 * @constructor
                 * @param fileKey {String}   Name of file request parameter.
                 * @param fileName {String}  Filename to be used by the server. Defaults to image.jpg.
                 * @param mimeType {String}  Mimetype of the uploaded file. Defaults to image/jpeg.
                 * @param params {Object}    Object with key: value params to send to the server.
                 * @param headers {Object}   Keys are header names, values are header values. Multiple
                 *                           headers of the same name are not supported.
                 */
                var FileUploadOptions = function (fileKey, fileName, mimeType, params, headers, httpMethod) {
                    this.fileKey = fileKey || null;
                    this.fileName = fileName || null;
                    this.mimeType = mimeType || null;
                    this.params = params || null;
                    this.headers = headers || null;
                    this.httpMethod = httpMethod || null;
                };

                module.exports = FileUploadOptions;

            });

            // file:../plugins/cordova-plugin-file/FileUploadResult.js
            define("cordova-plugin-file.FileUploadResult", function (require, exports, module) {
                /*
                 *
                 * Licensed to the Apache Software Foundation (ASF) under one
                 * or more contributor license agreements.  See the NOTICE file
                 * distributed with this work for additional information
                 * regarding copyright ownership.  The ASF licenses this file
                 * to you under the Apache License, Version 2.0 (the
                 * "License"); you may not use this file except in compliance
                 * with the License.  You may obtain a copy of the License at
                 *
                 *   http://www.apache.org/licenses/LICENSE-2.0
                 *
                 * Unless required by applicable law or agreed to in writing,
                 * software distributed under the License is distributed on an
                 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
                 * KIND, either express or implied.  See the License for the
                 * specific language governing permissions and limitations
                 * under the License.
                 *
                */

                /**
                 * FileUploadResult
                 * @constructor
                 */
                module.exports = function FileUploadResult(size, code, content) {
                    this.bytesSent = size;
                    this.responseCode = code;
                    this.response = content;
                };

            });

            // file:../plugins/cordova-plugin-file/FileWriter.js
            define("cordova-plugin-file.FileWriter", function (require, exports, module) {

                var exec = require('cordova/exec');
                var FileError = require('./FileError');
                var FileReader = require('./FileReader');
                var ProgressEvent = require('./ProgressEvent');

                /**
                 * This class writes to the mobile device file system.
                 *
                 * For Android:
                 *      The root directory is the root of the file system.
                 *      To write to the SD card, the file name is "sdcard/my_file.txt"
                 *
                 * @constructor
                 * @param file {File} File object containing file properties
                 * @param append if true write to the end of the file, otherwise overwrite the file
                 */
                var FileWriter = function (file) {
                    this.fileName = '';
                    this.length = 0;
                    if (file) {
                        this.localURL = file.localURL || file;
                        this.length = file.size || 0;
                    }
                    // default is to write at the beginning of the file
                    this.position = 0;

                    this.readyState = 0; // EMPTY

                    this.result = null;

                    // Error
                    this.error = null;

                    // Event handlers
                    this.onwritestart = null;   // When writing starts
                    this.onprogress = null;     // While writing the file, and reporting partial file data
                    this.onwrite = null;        // When the write has successfully completed.
                    this.onwriteend = null;     // When the request has completed (either in success or failure).
                    this.onabort = null;        // When the write has been aborted. For instance, by invoking the abort() method.
                    this.onerror = null;        // When the write has failed (see errors).
                };

                // States
                FileWriter.INIT = 0;
                FileWriter.WRITING = 1;
                FileWriter.DONE = 2;

                /**
                 * Abort writing file.
                 */
                FileWriter.prototype.abort = function () {
                    // check for invalid state
                    if (this.readyState === FileWriter.DONE || this.readyState === FileWriter.INIT) {
                        throw new FileError(FileError.INVALID_STATE_ERR);
                    }

                    // set error
                    this.error = new FileError(FileError.ABORT_ERR);

                    this.readyState = FileWriter.DONE;

                    // If abort callback
                    if (typeof this.onabort === 'function') {
                        this.onabort(new ProgressEvent('abort', { 'target': this }));
                    }

                    // If write end callback
                    if (typeof this.onwriteend === 'function') {
                        this.onwriteend(new ProgressEvent('writeend', { 'target': this }));
                    }
                };

                /**
                 * Writes data to the file
                 *
                 * @param data text or blob to be written
                 * @param isPendingBlobReadResult {Boolean} true if the data is the pending blob read operation result
                 */
                FileWriter.prototype.write = function (data, isPendingBlobReadResult) {

                    var that = this;
                    var supportsBinary = (typeof window.Blob !== 'undefined' && typeof window.ArrayBuffer !== 'undefined');
                    /* eslint-disable no-undef */
                    var isProxySupportBlobNatively = (cordova.platformId === 'windows8' || cordova.platformId === 'windows');
                    var isBinary;

                    // Check to see if the incoming data is a blob
                    if (data instanceof File || (!isProxySupportBlobNatively && supportsBinary && data instanceof Blob)) {
                        var fileReader = new FileReader();
                        /* eslint-enable no-undef */
                        fileReader.onload = function () {
                            // Call this method again, with the arraybuffer as argument
                            FileWriter.prototype.write.call(that, this.result, true /* isPendingBlobReadResult */);
                        };
                        fileReader.onerror = function () {
                            // DONE state
                            that.readyState = FileWriter.DONE;

                            // Save error
                            that.error = this.error;

                            // If onerror callback
                            if (typeof that.onerror === 'function') {
                                that.onerror(new ProgressEvent('error', { 'target': that }));
                            }

                            // If onwriteend callback
                            if (typeof that.onwriteend === 'function') {
                                that.onwriteend(new ProgressEvent('writeend', { 'target': that }));
                            }
                        };

                        // WRITING state
                        this.readyState = FileWriter.WRITING;

                        if (supportsBinary) {
                            fileReader.readAsArrayBuffer(data);
                        } else {
                            fileReader.readAsText(data);
                        }
                        return;
                    }

                    // Mark data type for safer transport over the binary bridge
                    isBinary = supportsBinary && (data instanceof ArrayBuffer);
                    if (isBinary && cordova.platformId === 'windowsphone') { // eslint-disable-line no-undef
                        // create a plain array, using the keys from the Uint8Array view so that we can serialize it
                        data = Array.apply(null, new Uint8Array(data));
                    }

                    // Throw an exception if we are already writing a file
                    if (this.readyState === FileWriter.WRITING && !isPendingBlobReadResult) {
                        throw new FileError(FileError.INVALID_STATE_ERR);
                    }

                    // WRITING state
                    this.readyState = FileWriter.WRITING;

                    var me = this;

                    // If onwritestart callback
                    if (typeof me.onwritestart === 'function') {
                        me.onwritestart(new ProgressEvent('writestart', { 'target': me }));
                    }

                    // Write file
                    exec(
                        // Success callback
                        function (r) {
                            // If DONE (cancelled), then don't do anything
                            if (me.readyState === FileWriter.DONE) {
                                return;
                            }

                            // position always increases by bytes written because file would be extended
                            me.position += r;
                            // The length of the file is now where we are done writing.

                            me.length = me.position;

                            // DONE state
                            me.readyState = FileWriter.DONE;

                            // If onwrite callback
                            if (typeof me.onwrite === 'function') {
                                me.onwrite(new ProgressEvent('write', { 'target': me }));
                            }

                            // If onwriteend callback
                            if (typeof me.onwriteend === 'function') {
                                me.onwriteend(new ProgressEvent('writeend', { 'target': me }));
                            }
                        },
                        // Error callback
                        function (e) {
                            // If DONE (cancelled), then don't do anything
                            if (me.readyState === FileWriter.DONE) {
                                return;
                            }

                            // DONE state
                            me.readyState = FileWriter.DONE;

                            // Save error
                            me.error = new FileError(e);

                            // If onerror callback
                            if (typeof me.onerror === 'function') {
                                me.onerror(new ProgressEvent('error', { 'target': me }));
                            }

                            // If onwriteend callback
                            if (typeof me.onwriteend === 'function') {
                                me.onwriteend(new ProgressEvent('writeend', { 'target': me }));
                            }
                        }, 'File', 'write', [this.localURL, data, this.position, isBinary]);
                };

                /**
                 * Moves the file pointer to the location specified.
                 *
                 * If the offset is a negative number the position of the file
                 * pointer is rewound.  If the offset is greater than the file
                 * size the position is set to the end of the file.
                 *
                 * @param offset is the location to move the file pointer to.
                 */
                FileWriter.prototype.seek = function (offset) {
                    // Throw an exception if we are already writing a file
                    if (this.readyState === FileWriter.WRITING) {
                        throw new FileError(FileError.INVALID_STATE_ERR);
                    }

                    if (!offset && offset !== 0) {
                        return;
                    }

                    // See back from end of file.
                    if (offset < 0) {
                        this.position = Math.max(offset + this.length, 0);
                        // Offset is bigger than file size so set position
                        // to the end of the file.
                    } else if (offset > this.length) {
                        this.position = this.length;
                        // Offset is between 0 and file size so set the position
                        // to start writing.
                    } else {
                        this.position = offset;
                    }
                };

                /**
                 * Truncates the file to the size specified.
                 *
                 * @param size to chop the file at.
                 */
                FileWriter.prototype.truncate = function (size) {
                    // Throw an exception if we are already writing a file
                    if (this.readyState === FileWriter.WRITING) {
                        throw new FileError(FileError.INVALID_STATE_ERR);
                    }

                    // WRITING state
                    this.readyState = FileWriter.WRITING;

                    var me = this;

                    // If onwritestart callback
                    if (typeof me.onwritestart === 'function') {
                        me.onwritestart(new ProgressEvent('writestart', { 'target': this }));
                    }

                    // Write file
                    exec(
                        // Success callback
                        function (r) {
                            // If DONE (cancelled), then don't do anything
                            if (me.readyState === FileWriter.DONE) {
                                return;
                            }

                            // DONE state
                            me.readyState = FileWriter.DONE;

                            // Update the length of the file
                            me.length = r;
                            me.position = Math.min(me.position, r);

                            // If onwrite callback
                            if (typeof me.onwrite === 'function') {
                                me.onwrite(new ProgressEvent('write', { 'target': me }));
                            }

                            // If onwriteend callback
                            if (typeof me.onwriteend === 'function') {
                                me.onwriteend(new ProgressEvent('writeend', { 'target': me }));
                            }
                        },
                        // Error callback
                        function (e) {
                            // If DONE (cancelled), then don't do anything
                            if (me.readyState === FileWriter.DONE) {
                                return;
                            }

                            // DONE state
                            me.readyState = FileWriter.DONE;

                            // Save error
                            me.error = new FileError(e);

                            // If onerror callback
                            if (typeof me.onerror === 'function') {
                                me.onerror(new ProgressEvent('error', { 'target': me }));
                            }

                            // If onwriteend callback
                            if (typeof me.onwriteend === 'function') {
                                me.onwriteend(new ProgressEvent('writeend', { 'target': me }));
                            }
                        }, 'File', 'truncate', [this.localURL, size]);
                };

                module.exports = FileWriter;

            });

            // file:../plugins/cordova-plugin-file/Flags.js
            define("cordova-plugin-file.Flags", function (require, exports, module) {

                /**
                 * Supplies arguments to methods that lookup or create files and directories.
                 *
                 * @param create
                 *            {boolean} file or directory if it doesn't exist
                 * @param exclusive
                 *            {boolean} used with create; if true the command will fail if
                 *            target path exists
                 */
                function Flags(create, exclusive) {
                    this.create = create || false;
                    this.exclusive = exclusive || false;
                }

                module.exports = Flags;

            });

            // file:../plugins/cordova-plugin-file/LocalFileSystem.js
            define("cordova-plugin-file.LocalFileSystem", function (require, exports, module) {
                exports.TEMPORARY = 0;
                exports.PERSISTENT = 1;

            });

            // file:../plugins/cordova-plugin-file/Metadata.js
            define("cordova-plugin-file.Metadata", function (require, exports, module) {

                /**
                 * Information about the state of the file or directory
                 *
                 * {Date} modificationTime (readonly)
                 */
                var Metadata = function (metadata) {
                    if (typeof metadata === 'object') {
                        this.modificationTime = new Date(metadata.modificationTime);
                        this.size = metadata.size || 0;
                    } else if (typeof metadata === 'undefined') {
                        this.modificationTime = null;
                        this.size = 0;
                    } else {
                        /* Backwards compatiblity with platforms that only return a timestamp */
                        this.modificationTime = new Date(metadata);
                    }
                };

                module.exports = Metadata;

            });

            // file:../plugins/cordova-plugin-file/ProgressEvent.js
            define("cordova-plugin-file.ProgressEvent", function (require, exports, module) {

                // If ProgressEvent exists in global context, use it already, otherwise use our own polyfill
                // Feature test: See if we can instantiate a native ProgressEvent;
                // if so, use that approach,
                // otherwise fill-in with our own implementation.
                //
                // NOTE: right now we always fill in with our own. Down the road would be nice if we can use whatever is native in the webview.
                var ProgressEvent = (function () {
                    /*
                    var createEvent = function(data) {
                        var event = document.createEvent('Events');
                        event.initEvent('ProgressEvent', false, false);
                        if (data) {
                            for (var i in data) {
                                if (data.hasOwnProperty(i)) {
                                    event[i] = data[i];
                                }
                            }
                            if (data.target) {
                                // TODO: cannot call <some_custom_object>.dispatchEvent
                                // need to first figure out how to implement EventTarget
                            }
                        }
                        return event;
                    };
                    try {
                        var ev = createEvent({type:"abort",target:document});
                        return function ProgressEvent(type, data) {
                            data.type = type;
                            return createEvent(data);
                        };
                    } catch(e){
                    */
                    return function ProgressEvent(type, dict) {
                        this.type = type;
                        this.bubbles = false;
                        this.cancelBubble = false;
                        this.cancelable = false;
                        this.lengthComputable = false;
                        this.loaded = dict && dict.loaded ? dict.loaded : 0;
                        this.total = dict && dict.total ? dict.total : 0;
                        this.target = dict && dict.target ? dict.target : null;
                    };
                    // }
                })();

                module.exports = ProgressEvent;

            });

            // file:../plugins/cordova-plugin-file/requestFileSystem.js
            define("cordova-plugin-file.requestFileSystem", function (require, exports, module) {

                (function () {
                    // For browser platform: not all browsers use this file.
                    function checkBrowser() {
                        if (cordova.platformId === 'browser' && require('./isChrome')()) { // eslint-disable-line no-undef
                            module.exports = window.requestFileSystem || window.webkitRequestFileSystem;
                            return true;
                        }
                        return false;
                    }
                    if (checkBrowser()) {
                        return;
                    }

                    var argscheck = require('cordova/argscheck');
                    var FileError = require('./FileError');
                    var FileSystem = require('./FileSystem');
                    var exec = require('cordova/exec');
                    var fileSystems = require('./fileSystems');

                    /**
                     * Request a file system in which to store application data.
                     * @param type  local file system type
                     * @param size  indicates how much storage space, in bytes, the application expects to need
                     * @param successCallback  invoked with a FileSystem object
                     * @param errorCallback  invoked if error occurs retrieving file system
                     */
                    var requestFileSystem = function (type, size, successCallback, errorCallback) {
                        argscheck.checkArgs('nnFF', 'requestFileSystem', arguments);
                        var fail = function (code) {
                            if (errorCallback) {
                                errorCallback(new FileError(code));
                            }
                        };

                        if (type < 0) {
                            fail(FileError.SYNTAX_ERR);
                        } else {
                            // if successful, return a FileSystem object
                            var success = function (file_system) {
                                if (file_system) {
                                    if (successCallback) {
                                        fileSystems.getFs(file_system.name, function (fs) {
                                            // This should happen only on platforms that haven't implemented requestAllFileSystems (windows)
                                            if (!fs) {
                                                fs = new FileSystem(file_system.name, file_system.root);
                                            }
                                            successCallback(fs);
                                        });
                                    }
                                } else {
                                    // no FileSystem object returned
                                    fail(FileError.NOT_FOUND_ERR);
                                }
                            };
                            exec(success, fail, 'File', 'requestFileSystem', [type, size]);
                        }
                    };

                    module.exports = requestFileSystem;
                })();

            });

            // file:../plugins/cordova-plugin-file/resolveLocalFileSystemURI.js
            define("cordova-plugin-file.resolveLocalFileSystemURI", function (require, exports, module) {
                (function () {
                    // For browser platform: not all browsers use overrided `resolveLocalFileSystemURL`.
                    function checkBrowser() {
                        if (cordova.platformId === 'browser' && require('./isChrome')()) { // eslint-disable-line no-undef
                            module.exports.resolveLocalFileSystemURL = window.resolveLocalFileSystemURL || window.webkitResolveLocalFileSystemURL;
                            return true;
                        }
                        return false;
                    }
                    if (checkBrowser()) {
                        return;
                    }

                    var argscheck = require('cordova/argscheck');
                    var DirectoryEntry = require('./DirectoryEntry');
                    var FileEntry = require('./FileEntry');
                    var FileError = require('./FileError');
                    var exec = require('cordova/exec');
                    var fileSystems = require('./fileSystems');

                    /**
                     * Look up file system Entry referred to by local URI.
                     * @param {DOMString} uri  URI referring to a local file or directory
                     * @param successCallback  invoked with Entry object corresponding to URI
                     * @param errorCallback    invoked if error occurs retrieving file system entry
                     */
                    module.exports.resolveLocalFileSystemURL = module.exports.resolveLocalFileSystemURL || function (uri, successCallback, errorCallback) {
                        argscheck.checkArgs('sFF', 'resolveLocalFileSystemURI', arguments);
                        // error callback
                        var fail = function (error) {
                            if (errorCallback) {
                                errorCallback(new FileError(error));
                            }
                        };
                        // sanity check for 'not:valid:filename' or '/not:valid:filename'
                        // file.spec.12 window.resolveLocalFileSystemURI should error (ENCODING_ERR) when resolving invalid URI with leading /.
                        if (!uri || uri.split(':').length > 2) {
                            setTimeout(function () {
                                fail(FileError.ENCODING_ERR);
                            }, 0);
                            return;
                        }
                        // if successful, return either a file or directory entry
                        var success = function (entry) {
                            if (entry) {
                                if (successCallback) {
                                    // create appropriate Entry object
                                    var fsName = entry.filesystemName || (entry.filesystem && entry.filesystem.name) || (entry.filesystem === window.PERSISTENT ? 'persistent' : 'temporary'); // eslint-disable-line no-undef
                                    fileSystems.getFs(fsName, function (fs) {
                                        // This should happen only on platforms that haven't implemented requestAllFileSystems (windows)
                                        if (!fs) {
                                            fs = new FileSystem(fsName, { name: '', fullPath: '/' }); // eslint-disable-line no-undef
                                        }
                                        var result = (entry.isDirectory) ? new DirectoryEntry(entry.name, entry.fullPath, fs, entry.nativeURL) : new FileEntry(entry.name, entry.fullPath, fs, entry.nativeURL);
                                        successCallback(result);
                                    });
                                }
                            } else {
                                // no Entry object returned
                                fail(FileError.NOT_FOUND_ERR);
                            }
                        };

                        exec(success, fail, 'File', 'resolveLocalFileSystemURI', [uri]);
                    };

                    module.exports.resolveLocalFileSystemURI = function () {
                        console.log('resolveLocalFileSystemURI is deprecated. Please call resolveLocalFileSystemURL instead.');
                        module.exports.resolveLocalFileSystemURL.apply(this, arguments);
                    };
                })();

            });

            // file:../plugins/cordova-plugin-file-transfer/FileTransfer.js
            define("cordova-plugin-file-transfer.FileTransfer", function (require, exports, module) {

                /* global cordova, FileSystem */

                var argscheck = require('cordova/argscheck'),
                    exec = require('cordova/exec'),
                    FileTransferError = require('./FileTransferError'),
                    ProgressEvent = require('cordova-plugin-file.ProgressEvent');

                function newProgressEvent(result) {
                    var pe = new ProgressEvent();
                    pe.lengthComputable = result.lengthComputable;
                    pe.loaded = result.loaded;
                    pe.total = result.total;
                    return pe;
                }

                function getUrlCredentials(urlString) {
                    var credentialsPattern = /^https?\:\/\/(?:(?:(([^:@\/]*)(?::([^@\/]*))?)?@)?([^:\/?#]*)(?::(\d*))?).*$/,
                        credentials = credentialsPattern.exec(urlString);

                    return credentials && credentials[1];
                }

                function getBasicAuthHeader(urlString) {
                    var header = null;


                    // This is changed due to MS Windows doesn't support credentials in http uris
                    // so we detect them by regexp and strip off from result url
                    // Proof: http://social.msdn.microsoft.com/Forums/windowsapps/en-US/a327cf3c-f033-4a54-8b7f-03c56ba3203f/windows-foundation-uri-security-problem

                    if (window.btoa) {
                        var credentials = getUrlCredentials(urlString);
                        if (credentials) {
                            var authHeader = "Authorization";
                            var authHeaderValue = "Basic " + window.btoa(credentials);

                            header = {
                                name: authHeader,
                                value: authHeaderValue
                            };
                        }
                    }

                    return header;
                }

                function convertHeadersToArray(headers) {
                    var result = [];
                    for (var header in headers) {
                        if (headers.hasOwnProperty(header)) {
                            var headerValue = headers[header];
                            result.push({
                                name: header,
                                value: headerValue.toString()
                            });
                        }
                    }
                    return result;
                }

                var idCounter = 0;

                /**
                 * FileTransfer uploads a file to a remote server.
                 * @constructor
                 */
                var FileTransfer = function () {
                    this._id = ++idCounter;
                    this.onprogress = null; // optional callback
                };

                /**
                * Given an absolute file path, uploads a file on the device to a remote server
                * using a multipart HTTP request.
                * @param filePath {String}           Full path of the file on the device
                * @param server {String}             URL of the server to receive the file
                * @param successCallback (Function}  Callback to be invoked when upload has completed
                * @param errorCallback {Function}    Callback to be invoked upon error
                * @param options {FileUploadOptions} Optional parameters such as file name and mimetype
                * @param trustAllHosts {Boolean} Optional trust all hosts (e.g. for self-signed certs), defaults to false
                */
                FileTransfer.prototype.upload = function (filePath, server, successCallback, errorCallback, options, trustAllHosts) {
                    argscheck.checkArgs('ssFFO*', 'FileTransfer.upload', arguments);
                    // check for options
                    var fileKey = null;
                    var fileName = null;
                    var mimeType = null;
                    var params = null;
                    var chunkedMode = true;
                    var headers = null;
                    var httpMethod = null;
                    var basicAuthHeader = getBasicAuthHeader(server);
                    if (basicAuthHeader) {
                        server = server.replace(getUrlCredentials(server) + '@', '');

                        options = options || {};
                        options.headers = options.headers || {};
                        options.headers[basicAuthHeader.name] = basicAuthHeader.value;
                    }

                    if (options) {
                        fileKey = options.fileKey;
                        fileName = options.fileName;
                        mimeType = options.mimeType;
                        headers = options.headers;
                        httpMethod = options.httpMethod || "POST";
                        if (httpMethod.toUpperCase() == "PUT") {
                            httpMethod = "PUT";
                        } else {
                            httpMethod = "POST";
                        }
                        if (options.chunkedMode !== null || typeof options.chunkedMode != "undefined") {
                            chunkedMode = options.chunkedMode;
                        }
                        if (options.params) {
                            params = options.params;
                        }
                        else {
                            params = {};
                        }
                    }

                    if (cordova.platformId === "windowsphone") {
                        headers = headers && convertHeadersToArray(headers);
                        params = params && convertHeadersToArray(params);
                    }

                    var fail = errorCallback && function (e) {
                        var error = new FileTransferError(e.code, e.source, e.target, e.http_status, e.body, e.exception);
                        errorCallback(error);
                    };

                    var self = this;
                    var win = function (result) {
                        if (typeof result.lengthComputable != "undefined") {
                            if (self.onprogress) {
                                self.onprogress(newProgressEvent(result));
                            }
                        } else {
                            if (successCallback) {
                                successCallback(result);
                            }
                        }
                    };
                    exec(win, fail, 'FileTransfer', 'upload', [filePath, server, fileKey, fileName, mimeType, params, trustAllHosts, chunkedMode, headers, this._id, httpMethod]);
                };

                /**
                 * Downloads a file form a given URL and saves it to the specified directory.
                 * @param source {String}          URL of the server to receive the file
                 * @param target {String}         Full path of the file on the device
                 * @param successCallback (Function}  Callback to be invoked when upload has completed
                 * @param errorCallback {Function}    Callback to be invoked upon error
                 * @param trustAllHosts {Boolean} Optional trust all hosts (e.g. for self-signed certs), defaults to false
                 * @param options {FileDownloadOptions} Optional parameters such as headers
                 */
                FileTransfer.prototype.download = function (source, target, successCallback, errorCallback, trustAllHosts, options) {
                    argscheck.checkArgs('ssFF*', 'FileTransfer.download', arguments);
                    var self = this;

                    var basicAuthHeader = getBasicAuthHeader(source);
                    if (basicAuthHeader) {
                        source = source.replace(getUrlCredentials(source) + '@', '');

                        options = options || {};
                        options.headers = options.headers || {};
                        options.headers[basicAuthHeader.name] = basicAuthHeader.value;
                    }

                    var headers = null;
                    if (options) {
                        headers = options.headers || null;
                    }

                    if (cordova.platformId === "windowsphone" && headers) {
                        headers = convertHeadersToArray(headers);
                    }

                    var win = function (result) {
                        if (typeof result.lengthComputable != "undefined") {
                            if (self.onprogress) {
                                return self.onprogress(newProgressEvent(result));
                            }
                        } else if (successCallback) {
                            var entry = null;
                            if (result.isDirectory) {
                                entry = new (require('cordova-plugin-file.DirectoryEntry'))();
                            }
                            else if (result.isFile) {
                                entry = new (require('cordova-plugin-file.FileEntry'))();
                            }
                            entry.isDirectory = result.isDirectory;
                            entry.isFile = result.isFile;
                            entry.name = result.name;
                            entry.fullPath = result.fullPath;
                            entry.filesystem = new FileSystem(result.filesystemName || (result.filesystem == window.PERSISTENT ? 'persistent' : 'temporary'));
                            entry.nativeURL = result.nativeURL;
                            successCallback(entry);
                        }
                    };

                    var fail = errorCallback && function (e) {
                        var error = new FileTransferError(e.code, e.source, e.target, e.http_status, e.body, e.exception);
                        errorCallback(error);
                    };

                    exec(win, fail, 'FileTransfer', 'download', [source, target, trustAllHosts, this._id, headers]);
                };

                /**
                 * Aborts the ongoing file transfer on this object. The original error
                 * callback for the file transfer will be called if necessary.
                 */
                FileTransfer.prototype.abort = function () {
                    exec(null, null, 'FileTransfer', 'abort', [this._id]);
                };

                module.exports = FileTransfer;

            });

            // file:../plugins/cordova-plugin-file-transfer/FileTransferError.js
            define("cordova-plugin-file-transfer.FileTransferError", function (require, exports, module) {

                /**
                 * FileTransferError
                 * @constructor
                 */
                var FileTransferError = function (code, source, target, status, body, exception) {
                    this.code = code || null;
                    this.source = source || null;
                    this.target = target || null;
                    this.http_status = status || null;
                    this.body = body || null;
                    this.exception = exception || null;
                };

                FileTransferError.FILE_NOT_FOUND_ERR = 1;
                FileTransferError.INVALID_URL_ERR = 2;
                FileTransferError.CONNECTION_ERR = 3;
                FileTransferError.ABORT_ERR = 4;
                FileTransferError.NOT_MODIFIED_ERR = 5;

                module.exports = FileTransferError;

            });

            define("cordova-plugin-sqlite-2.sqlitePlugin", function (require, exports, module) {
                (function (global, factory) {
                    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
                        typeof define === 'function' && define.amd ? define(factory) :
                            (global.sqlitePlugin = factory());
                }(this, (function () {
                    'use strict';

                    var test = function () {
                        // Don't get fooled by e.g. browserify environments.
                        return (typeof process !== 'undefined') && !process.browser;
                    };

                    var install = function (func) {
                        return function () {
                            process.nextTick(func);
                        };
                    };

                    var nextTick = {
                        test: test,
                        install: install
                    };

                    var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

                    //based off rsvp https://github.com/tildeio/rsvp.js
                    //license https://github.com/tildeio/rsvp.js/blob/master/LICENSE
                    //https://github.com/tildeio/rsvp.js/blob/master/lib/rsvp/asap.js

                    var Mutation = commonjsGlobal.MutationObserver || commonjsGlobal.WebKitMutationObserver;

                    var test$1 = function () {
                        return Mutation;
                    };

                    var install$1 = function (handle) {
                        var called = 0;
                        var observer = new Mutation(handle);
                        var element = commonjsGlobal.document.createTextNode('');
                        observer.observe(element, {
                            characterData: true
                        });
                        return function () {
                            element.data = (called = ++called % 2);
                        };
                    };

                    var mutation = {
                        test: test$1,
                        install: install$1
                    };

                    var test$2 = function () {
                        if (commonjsGlobal.setImmediate) {
                            // we can only get here in IE10
                            // which doesn't handel postMessage well
                            return false;
                        }
                        return typeof commonjsGlobal.MessageChannel !== 'undefined';
                    };

                    var install$2 = function (func) {
                        var channel = new commonjsGlobal.MessageChannel();
                        channel.port1.onmessage = func;
                        return function () {
                            channel.port2.postMessage(0);
                        };
                    };

                    var messageChannel = {
                        test: test$2,
                        install: install$2
                    };

                    var test$3 = function () {
                        return 'document' in commonjsGlobal && 'onreadystatechange' in commonjsGlobal.document.createElement('script');
                    };

                    var install$3 = function (handle) {
                        return function () {

                            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
                            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
                            var scriptEl = commonjsGlobal.document.createElement('script');
                            scriptEl.onreadystatechange = function () {
                                handle();

                                scriptEl.onreadystatechange = null;
                                scriptEl.parentNode.removeChild(scriptEl);
                                scriptEl = null;
                            };
                            commonjsGlobal.document.documentElement.appendChild(scriptEl);

                            return handle;
                        };
                    };

                    var stateChange = {
                        test: test$3,
                        install: install$3
                    };

                    var test$4 = function () {
                        return true;
                    };

                    var install$4 = function (t) {
                        return function () {
                            setTimeout(t, 0);
                        };
                    };

                    var timeout = {
                        test: test$4,
                        install: install$4
                    };

                    var types = [
                        nextTick,
                        mutation,
                        messageChannel,
                        stateChange,
                        timeout
                    ];
                    var draining;
                    var currentQueue;
                    var queueIndex = -1;
                    var queue = [];
                    var scheduled = false;
                    function cleanUpNextTick() {
                        if (!draining || !currentQueue) {
                            return;
                        }
                        draining = false;
                        if (currentQueue.length) {
                            queue = currentQueue.concat(queue);
                        } else {
                            queueIndex = -1;
                        }
                        if (queue.length) {
                            nextTick$1();
                        }
                    }

                    //named nextTick for less confusing stack traces
                    function nextTick$1() {
                        if (draining) {
                            return;
                        }
                        scheduled = false;
                        draining = true;
                        var len = queue.length;
                        var timeout$$1 = setTimeout(cleanUpNextTick);
                        while (len) {
                            currentQueue = queue;
                            queue = [];
                            while (currentQueue && ++queueIndex < len) {
                                currentQueue[queueIndex].run();
                            }
                            queueIndex = -1;
                            len = queue.length;
                        }
                        currentQueue = null;
                        queueIndex = -1;
                        draining = false;
                        clearTimeout(timeout$$1);
                    }
                    var scheduleDrain;
                    var i = -1;
                    var len = types.length;
                    while (++i < len) {
                        if (types[i] && types[i].test && types[i].test()) {
                            scheduleDrain = types[i].install(nextTick$1);
                            break;
                        }
                    }
                    // v8 likes predictible objects
                    function Item(fun, array) {
                        this.fun = fun;
                        this.array = array;
                    }
                    Item.prototype.run = function () {
                        var fun = this.fun;
                        var array = this.array;
                        switch (array.length) {
                            case 0:
                                return fun();
                            case 1:
                                return fun(array[0]);
                            case 2:
                                return fun(array[0], array[1]);
                            case 3:
                                return fun(array[0], array[1], array[2]);
                            default:
                                return fun.apply(null, array);
                        }

                    };
                    var lib = immediate;
                    function immediate(task) {
                        var args = new Array(arguments.length - 1);
                        if (arguments.length > 1) {
                            for (var i = 1; i < arguments.length; i++) {
                                args[i - 1] = arguments[i];
                            }
                        }
                        queue.push(new Item(task, args));
                        if (!scheduled && !draining) {
                            scheduled = true;
                            scheduleDrain();
                        }
                    }

                    var argsarray = argsArray;

                    function argsArray(fun) {
                        return function () {
                            var len = arguments.length;
                            if (len) {
                                var args = [];
                                var i = -1;
                                while (++i < len) {
                                    args[i] = arguments[i];
                                }
                                return fun.call(this, args);
                            } else {
                                return fun.call(this, []);
                            }
                        };
                    }

                    var noopFn = function () { };

                    // Simple FIFO queue implementation to avoid having to do shift()
                    // on an array, which is slow.

                    function Queue() {
                        this.length = 0;
                    }

                    Queue.prototype.push = function (item) {
                        var node = { item: item };
                        if (this.last) {
                            this.last = this.last.next = node;
                        } else {
                            this.last = this.first = node;
                        }
                        this.length++;
                    };

                    Queue.prototype.shift = function () {
                        var node = this.first;
                        if (node) {
                            this.first = node.next;
                            if (!(--this.length)) {
                                this.last = undefined;
                            }
                            return node.item;
                        }
                    };

                    Queue.prototype.slice = function (start, end) {
                        start = typeof start === 'undefined' ? 0 : start;
                        end = typeof end === 'undefined' ? Infinity : end;

                        var output = [];

                        var i = 0;
                        for (var node = this.first; node; node = node.next) {
                            if (--end < 0) {
                                break;
                            } else if (++i > start) {
                                output.push(node.item);
                            }
                        }
                        return output;
                    };

                    var tinyQueue = Queue;

                    function WebSQLRows(array) {
                        this._array = array;
                        this.length = array.length;
                    }

                    WebSQLRows.prototype.item = function (i) {
                        return this._array[i];
                    };

                    function WebSQLResultSet(insertId, rowsAffected, rows) {
                        this.insertId = insertId;
                        this.rowsAffected = rowsAffected;
                        this.rows = new WebSQLRows(rows);
                    }

                    var WebSQLResultSet_1 = WebSQLResultSet;

                    function errorUnhandled() {
                        return true; // a non-truthy return indicates error was handled
                    }

                    // WebSQL has some bizarre behavior regarding insertId/rowsAffected. To try
                    // to match the observed behavior of Chrome/Safari as much as possible, we
                    // sniff the SQL message to try to massage the returned insertId/rowsAffected.
                    // This helps us pass the tests, although it's error-prone and should
                    // probably be revised.
                    function massageSQLResult(sql, insertId, rowsAffected, rows) {
                        if (/^\s*UPDATE\b/i.test(sql)) {
                            // insertId is always undefined for "UPDATE" statements
                            insertId = void 0;
                        } else if (/^\s*CREATE\s+TABLE\b/i.test(sql)) {
                            // WebSQL always returns an insertId of 0 for "CREATE TABLE" statements
                            insertId = 0;
                            rowsAffected = 0;
                        } else if (/^\s*DROP\s+TABLE\b/i.test(sql)) {
                            // WebSQL always returns insertId=undefined and rowsAffected=0
                            // for "DROP TABLE" statements. Go figure.
                            insertId = void 0;
                            rowsAffected = 0;
                        } else if (!/^\s*INSERT\b/i.test(sql)) {
                            // for all non-inserts (deletes, etc.) insertId is always undefined
                            // ¯\_(ツ)_/¯
                            insertId = void 0;
                        }
                        return new WebSQLResultSet_1(insertId, rowsAffected, rows);
                    }

                    function SQLTask(sql, args, sqlCallback, sqlErrorCallback) {
                        this.sql = sql;
                        this.args = args;
                        this.sqlCallback = sqlCallback;
                        this.sqlErrorCallback = sqlErrorCallback;
                    }

                    function runBatch(self, batch) {

                        function onDone() {
                            self._running = false;
                            runAllSql(self);
                        }

                        var readOnly = self._websqlDatabase._currentTask.readOnly;

                        self._websqlDatabase._db.exec(batch, readOnly, function (err, results) {
                            /* istanbul ignore next */
                            if (err) {
                                self._error = err;
                                return onDone();
                            }
                            for (var i = 0; i < results.length; i++) {
                                var res = results[i];
                                var batchTask = batch[i];
                                if (res.error) {
                                    if (batchTask.sqlErrorCallback(self, res.error)) {
                                        // user didn't handle the error
                                        self._error = res.error;
                                        return onDone();
                                    }
                                } else {
                                    batchTask.sqlCallback(self, massageSQLResult(
                                        batch[i].sql, res.insertId, res.rowsAffected, res.rows));
                                }
                            }
                            onDone();
                        });
                    }

                    function runAllSql(self) {
                        if (self._running || self._complete) {
                            return;
                        }
                        if (self._error) {
                            self._complete = true;
                            return self._websqlDatabase._onTransactionComplete(self._error);
                        }
                        if (!self._sqlQueue.length) {
                            self._complete = true;
                            return self._websqlDatabase._onTransactionComplete();
                        }
                        self._running = true;
                        var batch = [];
                        var task;
                        while ((task = self._sqlQueue.shift())) {
                            batch.push(task);
                        }
                        runBatch(self, batch);
                    }

                    function executeSql(self, sql, args, sqlCallback, sqlErrorCallback) {
                        self._sqlQueue.push(new SQLTask(sql, args, sqlCallback, sqlErrorCallback));
                        if (self._runningTimeout) {
                            return;
                        }
                        self._runningTimeout = true;
                        lib(function () {
                            self._runningTimeout = false;
                            runAllSql(self);
                        });
                    }

                    function WebSQLTransaction(websqlDatabase) {
                        this._websqlDatabase = websqlDatabase;
                        this._error = null;
                        this._complete = false;
                        this._runningTimeout = false;
                        this._sqlQueue = new tinyQueue();
                        if (!websqlDatabase._currentTask.readOnly) {
                            // Since we serialize all access to the database, there is no need to
                            // run read-only tasks in a transaction. This is a perf boost.
                            this._sqlQueue.push(new SQLTask('BEGIN;', [], noopFn, noopFn));
                        }
                    }

                    WebSQLTransaction.prototype.executeSql = function (sql, args, sqlCallback, sqlErrorCallback) {
                        args = Array.isArray(args) ? args : [];
                        sqlCallback = typeof sqlCallback === 'function' ? sqlCallback : noopFn;
                        sqlErrorCallback = typeof sqlErrorCallback === 'function' ? sqlErrorCallback : errorUnhandled;

                        executeSql(this, sql, args, sqlCallback, sqlErrorCallback);
                    };

                    WebSQLTransaction.prototype._checkDone = function () {
                        runAllSql(this);
                    };

                    var WebSQLTransaction_1 = WebSQLTransaction;

                    var ROLLBACK = [
                        { sql: 'ROLLBACK;', args: [] }
                    ];

                    var COMMIT = [
                        { sql: 'END;', args: [] }
                    ];

                    // v8 likes predictable objects
                    function TransactionTask(readOnly, txnCallback, errorCallback, successCallback) {
                        this.readOnly = readOnly;
                        this.txnCallback = txnCallback;
                        this.errorCallback = errorCallback;
                        this.successCallback = successCallback;
                    }

                    function WebSQLDatabase(dbVersion, db) {
                        this.version = dbVersion;
                        this._db = db;
                        this._txnQueue = new tinyQueue();
                        this._running = false;
                        this._currentTask = null;
                    }

                    WebSQLDatabase.prototype._onTransactionComplete = function (err) {
                        var self = this;

                        function done() {
                            if (err) {
                                self._currentTask.errorCallback(err);
                            } else {
                                self._currentTask.successCallback();
                            }
                            self._running = false;
                            self._currentTask = null;
                            self._runNextTransaction();
                        }

                        if (self._currentTask.readOnly) {
                            done(); // read-only doesn't require a transaction
                        } else if (err) {
                            self._db.exec(ROLLBACK, false, done);
                        } else {
                            self._db.exec(COMMIT, false, done);
                        }
                    };

                    WebSQLDatabase.prototype._runTransaction = function () {
                        var self = this;
                        var txn = new WebSQLTransaction_1(self);

                        lib(function () {
                            self._currentTask.txnCallback(txn);
                            txn._checkDone();
                        });
                    };

                    WebSQLDatabase.prototype._runNextTransaction = function () {
                        if (this._running) {
                            return;
                        }
                        var task = this._txnQueue.shift();

                        if (!task) {
                            return;
                        }

                        this._currentTask = task;
                        this._running = true;
                        this._runTransaction();
                    };

                    WebSQLDatabase.prototype._createTransaction = function (
                        readOnly, txnCallback, errorCallback, successCallback) {
                        errorCallback = errorCallback || noopFn;
                        successCallback = successCallback || noopFn;

                        if (typeof txnCallback !== 'function') {
                            throw new Error('The callback provided as parameter 1 is not a function.');
                        }

                        this._txnQueue.push(new TransactionTask(readOnly, txnCallback, errorCallback, successCallback));
                        this._runNextTransaction();
                    };

                    WebSQLDatabase.prototype.transaction = function (txnCallback, errorCallback, successCallback) {
                        this._createTransaction(false, txnCallback, errorCallback, successCallback);
                    };

                    WebSQLDatabase.prototype.readTransaction = function (txnCallback, errorCallback, successCallback) {
                        this._createTransaction(true, txnCallback, errorCallback, successCallback);
                    };

                    var WebSQLDatabase_1 = WebSQLDatabase;

                    function customOpenDatabase(SQLiteDatabase) {

                        function createDb(dbName, dbVersion) {
                            var sqliteDatabase = new SQLiteDatabase(dbName);
                            return new WebSQLDatabase_1(dbVersion, sqliteDatabase);
                        }

                        function openDatabase(args) {

                            if (args.length < 4) {
                                throw new Error('Failed to execute \'openDatabase\': ' +
                                    '4 arguments required, but only ' + args.length + ' present');
                            }

                            var dbName = args[0];
                            var dbVersion = args[1];
                            // db description and size are ignored
                            var callback = args[4] || noopFn;

                            var db = createDb(dbName, dbVersion);

                            lib(function () {
                                callback(db);
                            });

                            return db;
                        }

                        return argsarray(openDatabase);
                    }

                    var custom = customOpenDatabase;

                    var custom$1 = custom;

                    function map(arr, fun) {
                        var len = arr.length;
                        var res = Array(len);
                        for (var i = 0; i < len; i++) {
                            res[i] = fun(arr[i], i);
                        }
                        return res;
                    }

                    function zipObject(props, values) {
                        var res = {};
                        var len = Math.min(props.length, values.length);
                        for (var i = 0; i < len; i++) {
                            res[props[i]] = values[i];
                        }
                        return res;
                    }

                    function SQLiteResult(error, insertId, rowsAffected, rows) {
                        this.error = error;
                        this.insertId = insertId;
                        this.rowsAffected = rowsAffected;
                        this.rows = rows;
                    }

                    function massageError(err) {
                        return typeof err === 'string' ? new Error(err) : err;
                    }

                    function SQLiteDatabase(name) {
                        this._name = name;
                    }

                    function dearrayifyRow(res) {
                        // use a compressed array format to send minimal data between
                        // native and web layers
                        var rawError = res[0];
                        if (rawError) {
                            return new SQLiteResult(massageError(res[0]));
                        }
                        var insertId = res[1];
                        if (insertId === null) {
                            insertId = void 0; // per the spec, should be undefined
                        }
                        var rowsAffected = res[2];
                        var columns = res[3];
                        var rows = res[4];
                        var zippedRows = [];
                        for (var i = 0, len = rows.length; i < len; i++) {
                            zippedRows.push(zipObject(columns, rows[i]));
                        }

                        // v8 likes predictable objects
                        return new SQLiteResult(null, insertId, rowsAffected, zippedRows);
                    }

                    // send less data over the wire, use an array
                    function arrayifyQuery(query) {
                        return [query.sql, (query.args || [])];
                    }

                    SQLiteDatabase.prototype.exec = function exec(queries, readOnly, callback) {

                        function onSuccess(rawResults) {
                            if (typeof rawResults === 'string') {
                                rawResults = JSON.parse(rawResults);
                            }
                            var results = map(rawResults, dearrayifyRow);
                            callback(null, results);
                        }

                        function onError(err) {
                            callback(massageError(err));
                        }

                        cordova.exec(onSuccess, onError, 'SQLitePlugin', 'exec', [
                            this._name,
                            map(queries, arrayifyQuery),
                            readOnly
                        ]);
                    };

                    var openDB = custom$1(SQLiteDatabase);

                    function SQLitePlugin() {
                    }

                    function openDatabase(name, version, description, size, callback) {
                        if (name && typeof name === 'object') {
                            // accept SQLite Plugin 1-style object here
                            callback = version;
                            size = name.size;
                            description = name.description;
                            version = name.version;
                            name = name.name;
                        }
                        if (!size) {
                            size = 1;
                        }
                        if (!description) {
                            description = name;
                        }
                        if (!version) {
                            version = '1.0';
                        }
                        if (typeof name === 'undefined') {
                            throw new Error('please be sure to call: openDatabase("myname.db")');
                        }
                        return openDB(name, version, description, size, callback);
                    }
                    SQLitePlugin.prototype.openDatabase = openDatabase;
                    var index = new SQLitePlugin();
                    return index;
                })));
            });

            define('cordova/plugin_list', function (require, exports, module) {
                module.exports = [
                    {
                        "id": "cordova-plugin-battery-status.battery",
                        "pluginId": "cordova-plugin-battery-status",
                        "clobbers": [
                            "navigator.battery"
                        ]
                    },
                    {
                        "id": "cordova-plugin-camera.Camera",
                        "pluginId": "cordova-plugin-camera",
                        "clobbers": [
                            "Camera"
                        ]
                    },
                    {
                        "id": "cordova-plugin-camera.CameraPopoverOptions",
                        "pluginId": "cordova-plugin-camera",
                        "clobbers": [
                            "CameraPopoverOptions"
                        ]
                    },
                    {
                        "id": "cordova-plugin-camera.camera",
                        "pluginId": "cordova-plugin-camera",
                        "clobbers": [
                            "navigator.camera"
                        ]
                    },
                    {
                        "id": "cordova-plugin-camera.CameraPopoverHandle",
                        "pluginId": "cordova-plugin-camera",
                        "clobbers": [
                            "CameraPopoverHandle"
                        ]
                    },
                    {
                        "id": "cordova-plugin-dialogs.notification",
                        "pluginId": "cordova-plugin-dialogs",
                        "merges": [
                            "navigator.notification"
                        ]
                    },
                    {
                        "id": "cordova-plugin-geolocation.Coordinates",
                        "pluginId": "cordova-plugin-geolocation",
                        "clobbers": [
                            "Coordinates"
                        ]
                    },
                    {
                        "id": "cordova-plugin-geolocation.PositionError",
                        "pluginId": "cordova-plugin-geolocation",
                        "clobbers": [
                            "PositionError"
                        ]
                    },
                    {
                        "id": "cordova-plugin-geolocation.Position",
                        "pluginId": "cordova-plugin-geolocation",
                        "clobbers": [
                            "Position"
                        ]
                    },
                    {
                        "id": "cordova-plugin-geolocation.geolocation",
                        "pluginId": "cordova-plugin-geolocation",
                        "clobbers": [
                            "navigator.geolocation"
                        ]
                    },
                    {
                        "id": "cordova-plugin-inappbrowser.inappbrowser",
                        "pluginId": "cordova-plugin-inappbrowser",
                        "clobbers": [
                            "cordova.InAppBrowser.open"
                        ]
                    },
                    {
                        "id": "cordova-plugin-splashscreen.SplashScreen",
                        "pluginId": "cordova-plugin-splashscreen",
                        "clobbers": [
                            "navigator.splashscreen"
                        ]
                    },
                    {
                        "id": "cordova-plugin-app-exit.exitApp",
                        "pluginId": "cordova-plugin-app-exit",
                        "merges": [
                            "navigator.app"
                        ]
                    },
                    {
                        "id": "cordova-plugin-media.MediaError",
                        "pluginId": "cordova-plugin-media",
                        "clobbers": [
                            "window.MediaError"
                        ]
                    },
                    {
                        "id": "cordova-plugin-media.Media",
                        "pluginId": "cordova-plugin-media",
                        "clobbers": [
                            "window.Media"
                        ]
                    },
                    {
                        "id": "cordova-plugin-vibration.notification",
                        "pluginId": "cordova-plugin-vibration",
                        "merges": [
                            "navigator"
                        ]
                    },
                    {
                        "id": "cordova-plugin-screen-orientation.screenorientation",
                        "pluginId": "cordova-plugin-screen-orientation",
                        "clobbers": [
                            "cordova.plugins.screenorientation"
                        ]
                    },
                    {
                        "id": "cordova-plugin-file.DirectoryEntry",
                        "pluginId": "cordova-plugin-file",
                        "clobbers": [
                            "window.DirectoryEntry"
                        ]
                    },
                    {
                        "id": "cordova-plugin-file.DirectoryReader",
                        "pluginId": "cordova-plugin-file",
                        "clobbers": [
                            "window.DirectoryReader"
                        ]
                    },
                    {
                        "id": "cordova-plugin-file.Entry",
                        "pluginId": "cordova-plugin-file",
                        "clobbers": [
                            "window.Entry"
                        ]
                    },
                    {
                        "id": "cordova-plugin-file.File",
                        "pluginId": "cordova-plugin-file",
                        "clobbers": [
                            "window.File"
                        ]
                    },
                    {
                        "id": "cordova-plugin-file.FileEntry",
                        "pluginId": "cordova-plugin-file",
                        "clobbers": [
                            "window.FileEntry"
                        ]
                    },
                    {
                        "id": "cordova-plugin-file.FileError",
                        "pluginId": "cordova-plugin-file",
                        "clobbers": [
                            "window.FileError"
                        ]
                    },
                    {
                        "id": "cordova-plugin-file.FileReader",
                        "pluginId": "cordova-plugin-file",
                        "clobbers": [
                            "window.FileReader"
                        ]
                    },
                    {
                        "id": "cordova-plugin-file.FileSystem",
                        "pluginId": "cordova-plugin-file",
                        "clobbers": [
                            "window.FileSystem"
                        ]
                    },
                    {
                        "id": "cordova-plugin-file.FileUploadOptions",
                        "pluginId": "cordova-plugin-file",
                        "clobbers": [
                            "window.FileUploadOptions"
                        ]
                    },
                    {
                        "id": "cordova-plugin-file.FileUploadResult",
                        "pluginId": "cordova-plugin-file",
                        "clobbers": [
                            "window.FileUploadResult"
                        ]
                    },
                    {
                        "id": "cordova-plugin-file.FileWriter",
                        "pluginId": "cordova-plugin-file",
                        "clobbers": [
                            "window.FileWriter"
                        ]
                    },
                    {
                        "id": "cordova-plugin-file.Flags",
                        "pluginId": "cordova-plugin-file",
                        "clobbers": [
                            "window.Flags"
                        ]
                    },
                    {
                        "id": "cordova-plugin-file.LocalFileSystem",
                        "pluginId": "cordova-plugin-file",
                        "clobbers": [
                            "window.LocalFileSystem"
                        ],
                        "merges": [
                            "window"
                        ]
                    },
                    {
                        "id": "cordova-plugin-file.Metadata",
                        "pluginId": "cordova-plugin-file",
                        "clobbers": [
                            "window.Metadata"
                        ]
                    },
                    {
                        "id": "cordova-plugin-file.ProgressEvent",
                        "pluginId": "cordova-plugin-file",
                        "clobbers": [
                            "window.ProgressEvent"
                        ]
                    },
                    {
                        "id": "cordova-plugin-file.fileSystems",
                        "pluginId": "cordova-plugin-file"
                    },
                    {
                        "id": "cordova-plugin-file.requestFileSystem",
                        "pluginId": "cordova-plugin-file",
                        "clobbers": [
                            "window.requestFileSystem"
                        ]
                    },
                    {
                        "id": "cordova-plugin-file.resolveLocalFileSystemURI",
                        "pluginId": "cordova-plugin-file",
                        "merges": [
                            "window"
                        ]
                    },
                    {
                        "id": "cordova-plugin-file.isChrome",
                        "pluginId": "cordova-plugin-file",
                        "runs": true
                    },
                    {
                        "id": "cordova-plugin-file.iosFileSystem",
                        "pluginId": "cordova-plugin-file",
                        "merges": [
                            "FileSystem"
                        ]
                    },
                    {
                        "id": "cordova-plugin-file.fileSystems-roots",
                        "pluginId": "cordova-plugin-file",
                        "runs": true
                    },
                    {
                        "id": "cordova-plugin-network-information.network",
                        "pluginId": "cordova-plugin-network-information",
                        "clobbers": [
                            "navigator.connection",
                            "navigator.network.connection"
                        ]
                    },
                    {
                        "id": "cordova-plugin-network-information.Connection",
                        "pluginId": "cordova-plugin-network-information",
                        "clobbers": [
                            "Connection"
                        ]
                    },
                    {
                        "id": "cordova-plugin-sqlite-2.sqlitePlugin",
                        "pluginId": "cordova-plugin-sqlite-2",
                        "clobbers": [
                            "sqlitePlugin"
                        ]
                    }
                ];
            });

            // file: src/common/pluginloader.js
            define("cordova/pluginloader", function (require, exports, module) {

                var modulemapper = require('cordova/modulemapper');

                // Helper function to inject a <script> tag.
                // Exported for testing.
                exports.injectScript = function (url, onload, onerror) {
                    var script = document.createElement('script');
                    // onload fires even when script fails loads with an error.
                    script.onload = onload;
                    // onerror fires for malformed URLs.
                    script.onerror = onerror;
                    script.src = url;
                    document.head.appendChild(script);
                };

                function injectIfNecessary(id, url, onload, onerror) {
                    onerror = onerror || onload;
                    if (id in define.moduleMap) {
                        onload();
                    }
                }

                function onScriptLoadingComplete(moduleList, finishPluginLoading) {
                    // Loop through all the plugins and then through their clobbers and merges.
                    for (var i = 0, module; (module = moduleList[i]); i++) {
                        if (module.clobbers && module.clobbers.length) {
                            for (var j = 0; j < module.clobbers.length; j++) {
                                modulemapper.clobbers(module.id, module.clobbers[j]);
                            }
                        }

                        if (module.merges && module.merges.length) {
                            for (var k = 0; k < module.merges.length; k++) {
                                modulemapper.merges(module.id, module.merges[k]);
                            }
                        }

                        // Finally, if runs is truthy we want to simply require() the module.
                        if (module.runs) {
                            modulemapper.runs(module.id);
                        }
                    }

                    finishPluginLoading();
                }

                // Handler for the cordova_plugins.js content.
                // See plugman's plugin_loader.js for the details of this object.
                // This function is only called if the really is a plugins array that isn't empty.
                // Otherwise the onerror response handler will just call finishPluginLoading().
                function handlePluginsObject(path, moduleList, finishPluginLoading) {
                    // Now inject the scripts.
                    var scriptCounter = moduleList.length;

                    if (!scriptCounter) {
                        finishPluginLoading();
                        return;
                    }
                    function scriptLoadedCallback() {
                        if (!--scriptCounter) {
                            onScriptLoadingComplete(moduleList, finishPluginLoading);
                        }
                    }

                    for (var i = 0; i < moduleList.length; i++) {
                        injectIfNecessary(moduleList[i].id, path + moduleList[i].id, scriptLoadedCallback);
                    }
                }

                function findCordovaPath() {
                    var path = null;
                    var scripts = document.getElementsByTagName('script');
                    var term = '/cordova.js';
                    for (var n = scripts.length - 1; n > -1; n--) {
                        var src = scripts[n].src.replace(/\?.*$/, ''); // Strip any query param (CB-6007).
                        if (src.indexOf(term) === (src.length - term.length)) {
                            path = src.substring(0, src.length - term.length) + '/';
                            break;
                        }
                    }
                    return path;
                }

                // Tries to load all plugins' js-modules.
                // This is an async process, but onDeviceReady is blocked on onPluginsReady.
                // onPluginsReady is fired when there are no plugins to load, or they are all done.
                exports.load = function (callback) {
                    var pathPrefix = findCordovaPath();
                    if (pathPrefix === null) {
                        console.log('Could not find cordova.js script tag. Plugin loading may fail.');
                        pathPrefix = '';
                    }
                    var moduleList = require('cordova/plugin_list');
                    handlePluginsObject(pathPrefix, moduleList, callback);
                };

            });

            window.cordova = require('cordova');
            // file: src/scripts/bootstrap.js
            require('cordova/init');

        })();

        
    } else {
//        alert("旧版cordova");

(function(){window.devicePlatform="iOS";var require,define;(function(){var modules={};var requireStack=[];var inProgressModules={};function build(module){var factory=module.factory;module.exports={};delete module.factory;factory(require,module.exports,module);return module.exports}require=function(id){if(!modules[id]){throw"module "+id+" not found"}else{if(id in inProgressModules){var cycle=requireStack.slice(inProgressModules[id]).join("->")+"->"+id;throw"Cycle in require graph: "+cycle}}if(modules[id].factory){try{inProgressModules[id]=requireStack.length;requireStack.push(id);return build(modules[id])}finally{delete inProgressModules[id];requireStack.pop()}}return modules[id].exports};define=function(id,factory){if(modules[id]){throw"module "+id+" already defined"}modules[id]={id:id,factory:factory}};define.remove=function(id){delete modules[id]};define.moduleMap=modules})();if(typeof module==="object"&&typeof require==="function"){module.exports.require=require;module.exports.define=define}define("cordova",function(require,exports,module){var channel=require("cordova/channel");document.addEventListener("DOMContentLoaded",function(){channel.onDOMContentLoaded.fire()},false);if(document.readyState=="complete"||document.readyState=="interactive"){channel.onDOMContentLoaded.fire()}var m_document_addEventListener=document.addEventListener;var m_document_removeEventListener=document.removeEventListener;var m_window_addEventListener=window.addEventListener;var m_window_removeEventListener=window.removeEventListener;var documentEventHandlers={},windowEventHandlers={};document.addEventListener=function(evt,handler,capture){var e=evt.toLowerCase();if(typeof documentEventHandlers[e]!="undefined"){documentEventHandlers[e].subscribe(handler)}else{m_document_addEventListener.call(document,evt,handler,capture)}};window.addEventListener=function(evt,handler,capture){var e=evt.toLowerCase();if(typeof windowEventHandlers[e]!="undefined"){windowEventHandlers[e].subscribe(handler)}else{m_window_addEventListener.call(window,evt,handler,capture)}};document.removeEventListener=function(evt,handler,capture){var e=evt.toLowerCase();if(typeof documentEventHandlers[e]!="undefined"){documentEventHandlers[e].unsubscribe(handler)}else{m_document_removeEventListener.call(document,evt,handler,capture)}};window.removeEventListener=function(evt,handler,capture){var e=evt.toLowerCase();if(typeof windowEventHandlers[e]!="undefined"){windowEventHandlers[e].unsubscribe(handler)}else{m_window_removeEventListener.call(window,evt,handler,capture)}};function createEvent(type,data){var event=document.createEvent("Events");event.initEvent(type,false,false);if(data){for(var i in data){if(data.hasOwnProperty(i)){event[i]=data[i]}}}return event}if(typeof window.console==="undefined"){window.console={log:function(){}}}var cordova={define:define,require:require,addWindowEventHandler:function(event){return(windowEventHandlers[event]=channel.create(event))},addStickyDocumentEventHandler:function(event){return(documentEventHandlers[event]=channel.createSticky(event))},addDocumentEventHandler:function(event){return(documentEventHandlers[event]=channel.create(event))},removeWindowEventHandler:function(event){delete windowEventHandlers[event]},removeDocumentEventHandler:function(event){delete documentEventHandlers[event]},getOriginalHandlers:function(){return{"document":{"addEventListener":m_document_addEventListener,"removeEventListener":m_document_removeEventListener},"window":{"addEventListener":m_window_addEventListener,"removeEventListener":m_window_removeEventListener}}},fireDocumentEvent:function(type,data,bNoDetach){var evt=createEvent(type,data);if(typeof documentEventHandlers[type]!="undefined"){if(bNoDetach){documentEventHandlers[type].fire(evt)}else{setTimeout(function(){documentEventHandlers[type].fire(evt)},0)}}else{document.dispatchEvent(evt)}},fireWindowEvent:function(type,data){var evt=createEvent(type,data);if(typeof windowEventHandlers[type]!="undefined"){setTimeout(function(){windowEventHandlers[type].fire(evt)},0)}else{window.dispatchEvent(evt)}},callbackId:Math.floor(Math.random()*2000000000),callbacks:{},callbackStatus:{NO_RESULT:0,OK:1,CLASS_NOT_FOUND_EXCEPTION:2,ILLEGAL_ACCESS_EXCEPTION:3,INSTANTIATION_EXCEPTION:4,MALFORMED_URL_EXCEPTION:5,IO_EXCEPTION:6,INVALID_ACTION:7,JSON_EXCEPTION:8,ERROR:9},callbackSuccess:function(callbackId,args){try{cordova.callbackFromNative(callbackId,true,args.status,[args.message],args.keepCallback)}catch(e){console.log("Error in error callback: "+callbackId+" = "+e)}},callbackError:function(callbackId,args){try{cordova.callbackFromNative(callbackId,false,args.status,[args.message],args.keepCallback)}catch(e){console.log("Error in error callback: "+callbackId+" = "+e)}},callbackFromNative:function(callbackId,success,status,args,keepCallback){var callback=cordova.callbacks[callbackId];if(callback){if(success&&status==cordova.callbackStatus.OK){callback.success&&callback.success.apply(null,args)}else{if(!success){callback.fail&&callback.fail.apply(null,args)
}}if(!keepCallback){delete cordova.callbacks[callbackId]}}},addConstructor:function(func){channel.onCordovaReady.subscribe(function(){try{func()}catch(e){console.log("Failed to run constructor: "+e)}})}};channel.onPause=cordova.addDocumentEventHandler("pause");channel.onResume=cordova.addDocumentEventHandler("resume");channel.onDeviceReady=cordova.addStickyDocumentEventHandler("deviceready");module.exports=cordova});define("cordova/argscheck",function(require,exports,module){var exec=require("cordova/exec");var utils=require("cordova/utils");var moduleExports=module.exports;var typeMap={"A":"Array","D":"Date","N":"Number","S":"String","F":"Function","O":"Object"};function extractParamName(callee,argIndex){return(/.*?\((.*?)\)/).exec(callee)[1].split(", ")[argIndex]}function checkArgs(spec,functionName,args,opt_callee){if(!moduleExports.enableChecks){return}var errMsg=null;var typeName;for(var i=0;i<spec.length;++i){var c=spec.charAt(i),cUpper=c.toUpperCase(),arg=args[i];if(c=="*"){continue}typeName=utils.typeName(arg);if((arg===null||arg===undefined)&&c==cUpper){continue}if(typeName!=typeMap[cUpper]){errMsg="Expected "+typeMap[cUpper];break}}if(errMsg){errMsg+=", but got "+typeName+".";errMsg='Wrong type for parameter "'+extractParamName(opt_callee||args.callee,i)+'" of '+functionName+": "+errMsg;if(typeof jasmine=="undefined"){console.error(errMsg)}throw TypeError(errMsg)}}function getValue(value,defaultValue){return value===undefined?defaultValue:value}moduleExports.checkArgs=checkArgs;moduleExports.getValue=getValue;moduleExports.enableChecks=true});define("cordova/builder",function(require,exports,module){var utils=require("cordova/utils");function each(objects,func,context){for(var prop in objects){if(objects.hasOwnProperty(prop)){func.apply(context,[objects[prop],prop])}}}function clobber(obj,key,value){exports.replaceHookForTesting(obj,key);obj[key]=value;if(obj[key]!==value){utils.defineGetter(obj,key,function(){return value})}}function assignOrWrapInDeprecateGetter(obj,key,value,message){if(message){utils.defineGetter(obj,key,function(){console.log(message);delete obj[key];clobber(obj,key,value);return value})}else{clobber(obj,key,value)}}function include(parent,objects,clobber,merge){each(objects,function(obj,key){try{var result=obj.path?require(obj.path):{};if(clobber){if(typeof parent[key]==="undefined"){assignOrWrapInDeprecateGetter(parent,key,result,obj.deprecated)}else{if(typeof obj.path!=="undefined"){if(merge){recursiveMerge(parent[key],result)}else{assignOrWrapInDeprecateGetter(parent,key,result,obj.deprecated)}}}result=parent[key]}else{if(typeof parent[key]=="undefined"){assignOrWrapInDeprecateGetter(parent,key,result,obj.deprecated)}else{result=parent[key]}}if(obj.children){include(result,obj.children,clobber,merge)}}catch(e){utils.alert("Exception building cordova JS globals: "+e+' for key "'+key+'"')}})}function recursiveMerge(target,src){for(var prop in src){if(src.hasOwnProperty(prop)){if(target.prototype&&target.prototype.constructor===target){clobber(target.prototype,prop,src[prop])}else{if(typeof src[prop]==="object"&&typeof target[prop]==="object"){recursiveMerge(target[prop],src[prop])}else{clobber(target,prop,src[prop])}}}}}exports.buildIntoButDoNotClobber=function(objects,target){include(target,objects,false,false)};exports.buildIntoAndClobber=function(objects,target){include(target,objects,true,false)};exports.buildIntoAndMerge=function(objects,target){include(target,objects,true,true)};exports.recursiveMerge=recursiveMerge;exports.assignOrWrapInDeprecateGetter=assignOrWrapInDeprecateGetter;exports.replaceHookForTesting=function(){}});define("cordova/channel",function(require,exports,module){var utils=require("cordova/utils"),nextGuid=1;var Channel=function(type,sticky){this.type=type;this.handlers={};this.state=sticky?1:0;this.fireArgs=null;this.numHandlers=0;this.onHasSubscribersChange=null},channel={join:function(h,c){var len=c.length,i=len,f=function(){if(!(--i)){h()}};for(var j=0;j<len;j++){if(c[j].state===0){throw Error("Can only use join with sticky channels.")}c[j].subscribe(f)}if(!len){h()}},create:function(type){return channel[type]=new Channel(type,false)},createSticky:function(type){return channel[type]=new Channel(type,true)},deviceReadyChannelsArray:[],deviceReadyChannelsMap:{},waitForInitialization:function(feature){if(feature){var c=channel[feature]||this.createSticky(feature);this.deviceReadyChannelsMap[feature]=c;this.deviceReadyChannelsArray.push(c)}},initializationComplete:function(feature){var c=this.deviceReadyChannelsMap[feature];if(c){c.fire()}}};function forceFunction(f){if(typeof f!="function"){throw"Function required as first argument!"}}Channel.prototype.subscribe=function(f,c){forceFunction(f);if(this.state==2){f.apply(c||this,this.fireArgs);return}var func=f,guid=f.observer_guid;if(typeof c=="object"){func=utils.close(c,f)}if(!guid){guid=""+nextGuid++}func.observer_guid=guid;f.observer_guid=guid;if(!this.handlers[guid]){this.handlers[guid]=func;this.numHandlers++;
if(this.numHandlers==1){this.onHasSubscribersChange&&this.onHasSubscribersChange()}}};Channel.prototype.unsubscribe=function(f){forceFunction(f);var guid=f.observer_guid,handler=this.handlers[guid];if(handler){delete this.handlers[guid];this.numHandlers--;if(this.numHandlers===0){this.onHasSubscribersChange&&this.onHasSubscribersChange()}}};Channel.prototype.fire=function(e){var fail=false,fireArgs=Array.prototype.slice.call(arguments);if(this.state==1){this.state=2;this.fireArgs=fireArgs}if(this.numHandlers){var toCall=[];for(var item in this.handlers){toCall.push(this.handlers[item])}for(var i=0;i<toCall.length;++i){toCall[i].apply(this,fireArgs)}if(this.state==2&&this.numHandlers){this.numHandlers=0;this.handlers={};this.onHasSubscribersChange&&this.onHasSubscribersChange()}}};channel.createSticky("onDOMContentLoaded");channel.createSticky("onNativeReady");channel.createSticky("onCordovaReady");channel.createSticky("onCordovaInfoReady");channel.createSticky("onCordovaConnectionReady");channel.createSticky("onPluginsReady");channel.createSticky("onDeviceReady");channel.create("onResume");channel.create("onPause");channel.createSticky("onDestroy");channel.waitForInitialization("onCordovaReady");channel.waitForInitialization("onCordovaConnectionReady");module.exports=channel});define("cordova/commandProxy",function(require,exports,module){var CommandProxyMap={};module.exports={add:function(id,proxyObj){console.log("adding proxy for "+id);CommandProxyMap[id]=proxyObj;return proxyObj},remove:function(id){var proxy=CommandProxyMap[id];delete CommandProxyMap[id];CommandProxyMap[id]=null;return proxy},get:function(service,action){return(CommandProxyMap[service]?CommandProxyMap[service][action]:null)}}});define("cordova/exec",function(require,exports,module){var cordova=require("cordova"),channel=require("cordova/channel"),utils=require("cordova/utils"),jsToNativeModes={IFRAME_NAV:0,XHR_NO_PAYLOAD:1,XHR_WITH_PAYLOAD:2,XHR_OPTIONAL_PAYLOAD:3},bridgeMode,execIframe,execXhr,requestCount=0,vcHeaderValue=null,commandQueue=[],isInContextOfEvalJs=0;function createExecIframe(){var iframe=document.createElement("iframe");iframe.style.display="none";document.body.appendChild(iframe);return iframe}function shouldBundleCommandJson(){if(bridgeMode==jsToNativeModes.XHR_WITH_PAYLOAD){return true}if(bridgeMode==jsToNativeModes.XHR_OPTIONAL_PAYLOAD){var payloadLength=0;for(var i=0;i<commandQueue.length;++i){payloadLength+=commandQueue[i].length}return payloadLength<4500}return false}function massageArgsJsToNative(args){if(!args||utils.typeName(args)!="Array"){return args}var ret=[];var encodeArrayBufferAs8bitString=function(ab){return String.fromCharCode.apply(null,new Uint8Array(ab))};var encodeArrayBufferAsBase64=function(ab){return window.btoa(encodeArrayBufferAs8bitString(ab))};args.forEach(function(arg,i){if(utils.typeName(arg)=="ArrayBuffer"){ret.push({"CDVType":"ArrayBuffer","data":encodeArrayBufferAsBase64(arg)})}else{ret.push(arg)}});return ret}function massageMessageNativeToJs(message){if(message.CDVType=="ArrayBuffer"){var stringToArrayBuffer=function(str){var ret=new Uint8Array(str.length);for(var i=0;i<str.length;i++){ret[i]=str.charCodeAt(i)}return ret.buffer};var base64ToArrayBuffer=function(b64){return stringToArrayBuffer(atob(b64))};message=base64ToArrayBuffer(message.data)}return message}function convertMessageToArgsNativeToJs(message){var args=[];if(!message||!message.hasOwnProperty("CDVType")){args.push(message)}else{if(message.CDVType=="MultiPart"){message.messages.forEach(function(e){args.push(massageMessageNativeToJs(e))})}else{args.push(massageMessageNativeToJs(message))}}return args}function iOSExec(){if(bridgeMode===undefined){bridgeMode=navigator.userAgent.indexOf(" 4_")==-1?jsToNativeModes.XHR_NO_PAYLOAD:jsToNativeModes.IFRAME_NAV}var successCallback,failCallback,service,action,actionArgs,splitCommand;var callbackId=null;if(typeof arguments[0]!=="string"){successCallback=arguments[0];failCallback=arguments[1];service=arguments[2];action=arguments[3];actionArgs=arguments[4];callbackId="INVALID"}else{splitCommand=arguments[0].split(".");action=splitCommand.pop();service=splitCommand.join(".");actionArgs=Array.prototype.splice.call(arguments,1)}if(successCallback||failCallback){callbackId=service+cordova.callbackId++;cordova.callbacks[callbackId]={success:successCallback,fail:failCallback}}actionArgs=massageArgsJsToNative(actionArgs);var command=[callbackId,service,action,actionArgs];commandQueue.push(JSON.stringify(command));if(!isInContextOfEvalJs&&commandQueue.length==1){if(bridgeMode!=jsToNativeModes.IFRAME_NAV){if(execXhr&&execXhr.readyState!=4){execXhr=null}execXhr=execXhr||new XMLHttpRequest();execXhr.open("HEAD","/!gap_exec?"+(+new Date()),true);if(!vcHeaderValue){vcHeaderValue=/.*\((.*)\)/.exec(navigator.userAgent)[1]}execXhr.setRequestHeader("vc",vcHeaderValue);execXhr.setRequestHeader("rc",++requestCount);if(shouldBundleCommandJson()){execXhr.setRequestHeader("cmds",iOSExec.nativeFetchMessages())
}execXhr.send(null)}else{execIframe=execIframe||createExecIframe();execIframe.src="gap://ready"}}}iOSExec.jsToNativeModes=jsToNativeModes;iOSExec.setJsToNativeBridgeMode=function(mode){if(execIframe){execIframe.parentNode.removeChild(execIframe);execIframe=null}bridgeMode=mode};iOSExec.nativeFetchMessages=function(){if(!commandQueue.length){return""}var json="["+commandQueue.join(",")+"]";commandQueue.length=0;return json};iOSExec.nativeCallback=function(callbackId,status,message,keepCallback){return iOSExec.nativeEvalAndFetch(function(){var success=status===0||status===1;var args=convertMessageToArgsNativeToJs(message);cordova.callbackFromNative(callbackId,success,status,args,keepCallback)})};iOSExec.nativeEvalAndFetch=function(func){isInContextOfEvalJs++;try{func();return iOSExec.nativeFetchMessages()}finally{isInContextOfEvalJs--}};module.exports=iOSExec});define("cordova/modulemapper",function(require,exports,module){var builder=require("cordova/builder"),moduleMap=define.moduleMap,symbolList,deprecationMap;exports.reset=function(){symbolList=[];deprecationMap={}};function addEntry(strategy,moduleName,symbolPath,opt_deprecationMessage){if(!(moduleName in moduleMap)){throw new Error("Module "+moduleName+" does not exist.")}symbolList.push(strategy,moduleName,symbolPath);if(opt_deprecationMessage){deprecationMap[symbolPath]=opt_deprecationMessage}}exports.clobbers=function(moduleName,symbolPath,opt_deprecationMessage){addEntry("c",moduleName,symbolPath,opt_deprecationMessage)};exports.merges=function(moduleName,symbolPath,opt_deprecationMessage){addEntry("m",moduleName,symbolPath,opt_deprecationMessage)};exports.defaults=function(moduleName,symbolPath,opt_deprecationMessage){addEntry("d",moduleName,symbolPath,opt_deprecationMessage)};function prepareNamespace(symbolPath,context){if(!symbolPath){return context}var parts=symbolPath.split(".");var cur=context;for(var i=0,part;part=parts[i];++i){cur=cur[part]=cur[part]||{}}return cur}exports.mapModules=function(context){var origSymbols={};context.CDV_origSymbols=origSymbols;for(var i=0,len=symbolList.length;i<len;i+=3){var strategy=symbolList[i];var moduleName=symbolList[i+1];var symbolPath=symbolList[i+2];var lastDot=symbolPath.lastIndexOf(".");var namespace=symbolPath.substr(0,lastDot);var lastName=symbolPath.substr(lastDot+1);var module=require(moduleName);var deprecationMsg=symbolPath in deprecationMap?"Access made to deprecated symbol: "+symbolPath+". "+deprecationMsg:null;var parentObj=prepareNamespace(namespace,context);var target=parentObj[lastName];if(strategy=="m"&&target){builder.recursiveMerge(target,module)}else{if((strategy=="d"&&!target)||(strategy!="d")){if(!(symbolPath in origSymbols)){origSymbols[symbolPath]=target}builder.assignOrWrapInDeprecateGetter(parentObj,lastName,module,deprecationMsg)}}}};exports.getOriginalSymbol=function(context,symbolPath){var origSymbols=context.CDV_origSymbols;if(origSymbols&&(symbolPath in origSymbols)){return origSymbols[symbolPath]}var parts=symbolPath.split(".");var obj=context;for(var i=0;i<parts.length;++i){obj=obj&&obj[parts[i]]}return obj};exports.loadMatchingModules=function(matchingRegExp){for(var k in moduleMap){if(matchingRegExp.exec(k)){require(k)}}};exports.reset()});define("cordova/platform",function(require,exports,module){module.exports={id:"ios",initialize:function(){var modulemapper=require("cordova/modulemapper");modulemapper.loadMatchingModules(/cordova.*\/plugininit$/);modulemapper.loadMatchingModules(/cordova.*\/symbols$/);modulemapper.mapModules(window)}}});define("cordova/plugin/Acceleration",function(require,exports,module){var Acceleration=function(x,y,z,timestamp){this.x=x;this.y=y;this.z=z;this.timestamp=timestamp||(new Date()).getTime()};module.exports=Acceleration});define("cordova/plugin/Camera",function(require,exports,module){var argscheck=require("cordova/argscheck"),exec=require("cordova/exec"),Camera=require("cordova/plugin/CameraConstants"),CameraPopoverHandle=require("cordova/plugin/CameraPopoverHandle");var cameraExport={};for(var key in Camera){cameraExport[key]=Camera[key]}cameraExport.getPicture=function(successCallback,errorCallback,options){argscheck.checkArgs("fFO","Camera.getPicture",arguments);options=options||{};var getValue=argscheck.getValue;var quality=getValue(options.quality,50);var destinationType=getValue(options.destinationType,Camera.DestinationType.FILE_URI);var sourceType=getValue(options.sourceType,Camera.PictureSourceType.CAMERA);var targetWidth=getValue(options.targetWidth,-1);var targetHeight=getValue(options.targetHeight,-1);var encodingType=getValue(options.encodingType,Camera.EncodingType.JPEG);var mediaType=getValue(options.mediaType,Camera.MediaType.PICTURE);var allowEdit=!!options.allowEdit;var correctOrientation=!!options.correctOrientation;var saveToPhotoAlbum=!!options.saveToPhotoAlbum;var popoverOptions=getValue(options.popoverOptions,null);var cameraDirection=getValue(options.cameraDirection,Camera.Direction.BACK);var args=[quality,destinationType,sourceType,targetWidth,targetHeight,encodingType,mediaType,allowEdit,correctOrientation,saveToPhotoAlbum,popoverOptions,cameraDirection];
exec(successCallback,errorCallback,"Camera","takePicture",args);return new CameraPopoverHandle()};cameraExport.cleanup=function(successCallback,errorCallback){exec(successCallback,errorCallback,"Camera","cleanup",[])};module.exports=cameraExport});define("cordova/plugin/CameraConstants",function(require,exports,module){module.exports={DestinationType:{DATA_URL:0,FILE_URI:1,NATIVE_URI:2},EncodingType:{JPEG:0,PNG:1},MediaType:{PICTURE:0,VIDEO:1,ALLMEDIA:2},PictureSourceType:{PHOTOLIBRARY:0,CAMERA:1,SAVEDPHOTOALBUM:2},PopoverArrowDirection:{ARROW_UP:1,ARROW_DOWN:2,ARROW_LEFT:4,ARROW_RIGHT:8,ARROW_ANY:15},Direction:{BACK:0,FRONT:1}}});define("cordova/plugin/CameraPopoverHandle",function(require,exports,module){var exec=require("cordova/exec");var CameraPopoverHandle=function(){this.setPosition=function(popoverOptions){var args=[popoverOptions];exec(null,null,"Camera","repositionPopover",args)}};module.exports=CameraPopoverHandle});define("cordova/plugin/CameraPopoverOptions",function(require,exports,module){var Camera=require("cordova/plugin/CameraConstants");var CameraPopoverOptions=function(x,y,width,height,arrowDir){this.x=x||0;this.y=y||32;this.width=width||320;this.height=height||480;this.arrowDir=arrowDir||Camera.PopoverArrowDirection.ARROW_ANY};module.exports=CameraPopoverOptions});define("cordova/plugin/CaptureAudioOptions",function(require,exports,module){var CaptureAudioOptions=function(){this.limit=1;this.duration=0;this.mode=null};module.exports=CaptureAudioOptions});define("cordova/plugin/CaptureError",function(require,exports,module){var CaptureError=function(c){this.code=c||null};CaptureError.CAPTURE_INTERNAL_ERR=0;CaptureError.CAPTURE_APPLICATION_BUSY=1;CaptureError.CAPTURE_INVALID_ARGUMENT=2;CaptureError.CAPTURE_NO_MEDIA_FILES=3;CaptureError.CAPTURE_NOT_SUPPORTED=20;module.exports=CaptureError});define("cordova/plugin/CaptureImageOptions",function(require,exports,module){var CaptureImageOptions=function(){this.limit=1;this.mode=null};module.exports=CaptureImageOptions});define("cordova/plugin/CaptureVideoOptions",function(require,exports,module){var CaptureVideoOptions=function(){this.limit=1;this.duration=0;this.mode=null};module.exports=CaptureVideoOptions});define("cordova/plugin/CompassError",function(require,exports,module){var CompassError=function(err){this.code=(err!==undefined?err:null)};CompassError.COMPASS_INTERNAL_ERR=0;CompassError.COMPASS_NOT_SUPPORTED=20;module.exports=CompassError});define("cordova/plugin/CompassHeading",function(require,exports,module){var CompassHeading=function(magneticHeading,trueHeading,headingAccuracy,timestamp){this.magneticHeading=magneticHeading;this.trueHeading=trueHeading;this.headingAccuracy=headingAccuracy;this.timestamp=timestamp||new Date().getTime()};module.exports=CompassHeading});define("cordova/plugin/ConfigurationData",function(require,exports,module){function ConfigurationData(){this.type=null;this.height=0;this.width=0}module.exports=ConfigurationData});define("cordova/plugin/Connection",function(require,exports,module){module.exports={UNKNOWN:"unknown",ETHERNET:"ethernet",WIFI:"wifi",CELL_2G:"2g",CELL_3G:"3g",CELL_4G:"4g",CELL:"cellular",NONE:"none"}});define("cordova/plugin/Contact",function(require,exports,module){var argscheck=require("cordova/argscheck"),exec=require("cordova/exec"),ContactError=require("cordova/plugin/ContactError"),utils=require("cordova/utils");function convertIn(contact){var value=contact.birthday;try{contact.birthday=new Date(parseFloat(value))}catch(exception){console.log("Cordova Contact convertIn error: exception creating date.")}return contact}function convertOut(contact){var value=contact.birthday;if(value!==null){if(!utils.isDate(value)){try{value=new Date(value)}catch(exception){value=null}}if(utils.isDate(value)){value=value.valueOf()}contact.birthday=value}return contact}var Contact=function(id,displayName,name,nickname,phoneNumbers,emails,addresses,ims,organizations,birthday,note,photos,categories,urls){this.id=id||null;this.rawId=null;this.displayName=displayName||null;this.name=name||null;this.nickname=nickname||null;this.phoneNumbers=phoneNumbers||null;this.emails=emails||null;this.addresses=addresses||null;this.ims=ims||null;this.organizations=organizations||null;this.birthday=birthday||null;this.note=note||null;this.photos=photos||null;this.categories=categories||null;this.urls=urls||null};Contact.prototype.remove=function(successCB,errorCB){argscheck.checkArgs("FF","Contact.remove",arguments);var fail=errorCB&&function(code){errorCB(new ContactError(code))};if(this.id===null){fail(ContactError.UNKNOWN_ERROR)}else{exec(successCB,fail,"Contacts","remove",[this.id])}};Contact.prototype.clone=function(){var clonedContact=utils.clone(this);clonedContact.id=null;clonedContact.rawId=null;function nullIds(arr){if(arr){for(var i=0;i<arr.length;++i){arr[i].id=null}}}nullIds(clonedContact.phoneNumbers);nullIds(clonedContact.emails);nullIds(clonedContact.addresses);nullIds(clonedContact.ims);nullIds(clonedContact.organizations);
nullIds(clonedContact.categories);nullIds(clonedContact.photos);nullIds(clonedContact.urls);return clonedContact};Contact.prototype.save=function(successCB,errorCB){argscheck.checkArgs("FFO","Contact.save",arguments);var fail=errorCB&&function(code){errorCB(new ContactError(code))};var success=function(result){if(result){if(successCB){var fullContact=require("cordova/plugin/contacts").create(result);successCB(convertIn(fullContact))}}else{fail(ContactError.UNKNOWN_ERROR)}};var dupContact=convertOut(utils.clone(this));exec(success,fail,"Contacts","save",[dupContact])};module.exports=Contact});define("cordova/plugin/ContactAddress",function(require,exports,module){var ContactAddress=function(pref,type,formatted,streetAddress,locality,region,postalCode,country){this.id=null;this.pref=(typeof pref!="undefined"?pref:false);this.type=type||null;this.formatted=formatted||null;this.streetAddress=streetAddress||null;this.locality=locality||null;this.region=region||null;this.postalCode=postalCode||null;this.country=country||null};module.exports=ContactAddress});define("cordova/plugin/ContactError",function(require,exports,module){var ContactError=function(err){this.code=(typeof err!="undefined"?err:null)};ContactError.UNKNOWN_ERROR=0;ContactError.INVALID_ARGUMENT_ERROR=1;ContactError.TIMEOUT_ERROR=2;ContactError.PENDING_OPERATION_ERROR=3;ContactError.IO_ERROR=4;ContactError.NOT_SUPPORTED_ERROR=5;ContactError.PERMISSION_DENIED_ERROR=20;module.exports=ContactError});define("cordova/plugin/ContactField",function(require,exports,module){var ContactField=function(type,value,pref){this.id=null;this.type=(type&&type.toString())||null;this.value=(value&&value.toString())||null;this.pref=(typeof pref!="undefined"?pref:false)};module.exports=ContactField});define("cordova/plugin/ContactFindOptions",function(require,exports,module){var ContactFindOptions=function(filter,multiple){this.filter=filter||"";this.multiple=(typeof multiple!="undefined"?multiple:false)};module.exports=ContactFindOptions});define("cordova/plugin/ContactName",function(require,exports,module){var ContactName=function(formatted,familyName,givenName,middle,prefix,suffix){this.formatted=formatted||null;this.familyName=familyName||null;this.givenName=givenName||null;this.middleName=middle||null;this.honorificPrefix=prefix||null;this.honorificSuffix=suffix||null};module.exports=ContactName});define("cordova/plugin/ContactOrganization",function(require,exports,module){var ContactOrganization=function(pref,type,name,dept,title){this.id=null;this.pref=(typeof pref!="undefined"?pref:false);this.type=type||null;this.name=name||null;this.department=dept||null;this.title=title||null};module.exports=ContactOrganization});define("cordova/plugin/Coordinates",function(require,exports,module){var Coordinates=function(lat,lng,alt,acc,head,vel,altacc){this.latitude=lat;this.longitude=lng;this.accuracy=acc;this.altitude=(alt!==undefined?alt:null);this.heading=(head!==undefined?head:null);this.speed=(vel!==undefined?vel:null);if(this.speed===0||this.speed===null){this.heading=NaN}this.altitudeAccuracy=(altacc!==undefined)?altacc:null};module.exports=Coordinates});define("cordova/plugin/DirectoryEntry",function(require,exports,module){var argscheck=require("cordova/argscheck"),utils=require("cordova/utils"),exec=require("cordova/exec"),Entry=require("cordova/plugin/Entry"),FileError=require("cordova/plugin/FileError"),DirectoryReader=require("cordova/plugin/DirectoryReader");var DirectoryEntry=function(name,fullPath){DirectoryEntry.__super__.constructor.call(this,false,true,name,fullPath)};utils.extend(DirectoryEntry,Entry);DirectoryEntry.prototype.createReader=function(){return new DirectoryReader(this.fullPath)};DirectoryEntry.prototype.getDirectory=function(path,options,successCallback,errorCallback){argscheck.checkArgs("sOFF","DirectoryEntry.getDirectory",arguments);var win=successCallback&&function(result){var entry=new DirectoryEntry(result.name,result.fullPath);successCallback(entry)};var fail=errorCallback&&function(code){errorCallback(new FileError(code))};exec(win,fail,"File","getDirectory",[this.fullPath,path,options])};DirectoryEntry.prototype.removeRecursively=function(successCallback,errorCallback){argscheck.checkArgs("FF","DirectoryEntry.removeRecursively",arguments);var fail=errorCallback&&function(code){errorCallback(new FileError(code))};exec(successCallback,fail,"File","removeRecursively",[this.fullPath])};DirectoryEntry.prototype.getFile=function(path,options,successCallback,errorCallback){argscheck.checkArgs("sOFF","DirectoryEntry.getFile",arguments);var win=successCallback&&function(result){var FileEntry=require("cordova/plugin/FileEntry");var entry=new FileEntry(result.name,result.fullPath);successCallback(entry)};var fail=errorCallback&&function(code){errorCallback(new FileError(code))};exec(win,fail,"File","getFile",[this.fullPath,path,options])};module.exports=DirectoryEntry});define("cordova/plugin/DirectoryReader",function(require,exports,module){var exec=require("cordova/exec"),FileError=require("cordova/plugin/FileError");
function DirectoryReader(path){this.path=path||null}DirectoryReader.prototype.readEntries=function(successCallback,errorCallback){var win=typeof successCallback!=="function"?null:function(result){var retVal=[];for(var i=0;i<result.length;i++){var entry=null;if(result[i].isDirectory){entry=new (require("cordova/plugin/DirectoryEntry"))()}else{if(result[i].isFile){entry=new (require("cordova/plugin/FileEntry"))()}}entry.isDirectory=result[i].isDirectory;entry.isFile=result[i].isFile;entry.name=result[i].name;entry.fullPath=result[i].fullPath;retVal.push(entry)}successCallback(retVal)};var fail=typeof errorCallback!=="function"?null:function(code){errorCallback(new FileError(code))};exec(win,fail,"File","readEntries",[this.path])};module.exports=DirectoryReader});define("cordova/plugin/Entry",function(require,exports,module){var argscheck=require("cordova/argscheck"),exec=require("cordova/exec"),FileError=require("cordova/plugin/FileError"),Metadata=require("cordova/plugin/Metadata");function Entry(isFile,isDirectory,name,fullPath,fileSystem){this.isFile=!!isFile;this.isDirectory=!!isDirectory;this.name=name||"";this.fullPath=fullPath||"";this.filesystem=fileSystem||null}Entry.prototype.getMetadata=function(successCallback,errorCallback){argscheck.checkArgs("FF","Entry.getMetadata",arguments);var success=successCallback&&function(lastModified){var metadata=new Metadata(lastModified);successCallback(metadata)};var fail=errorCallback&&function(code){errorCallback(new FileError(code))};exec(success,fail,"File","getMetadata",[this.fullPath])};Entry.prototype.setMetadata=function(successCallback,errorCallback,metadataObject){argscheck.checkArgs("FFO","Entry.setMetadata",arguments);exec(successCallback,errorCallback,"File","setMetadata",[this.fullPath,metadataObject])};Entry.prototype.moveTo=function(parent,newName,successCallback,errorCallback){argscheck.checkArgs("oSFF","Entry.moveTo",arguments);var fail=errorCallback&&function(code){errorCallback(new FileError(code))};var srcPath=this.fullPath,name=newName||this.name,success=function(entry){if(entry){if(successCallback){var result=(entry.isDirectory)?new (require("cordova/plugin/DirectoryEntry"))(entry.name,entry.fullPath):new (require("cordova/plugin/FileEntry"))(entry.name,entry.fullPath);successCallback(result)}}else{fail&&fail(FileError.NOT_FOUND_ERR)}};exec(success,fail,"File","moveTo",[srcPath,parent.fullPath,name])};Entry.prototype.copyTo=function(parent,newName,successCallback,errorCallback){argscheck.checkArgs("oSFF","Entry.copyTo",arguments);var fail=errorCallback&&function(code){errorCallback(new FileError(code))};var srcPath=this.fullPath,name=newName||this.name,success=function(entry){if(entry){if(successCallback){var result=(entry.isDirectory)?new (require("cordova/plugin/DirectoryEntry"))(entry.name,entry.fullPath):new (require("cordova/plugin/FileEntry"))(entry.name,entry.fullPath);successCallback(result)}}else{fail&&fail(FileError.NOT_FOUND_ERR)}};exec(success,fail,"File","copyTo",[srcPath,parent.fullPath,name])};Entry.prototype.toURL=function(){return this.fullPath};Entry.prototype.toURI=function(mimeType){console.log("DEPRECATED: Update your code to use 'toURL'");return this.toURL()};Entry.prototype.remove=function(successCallback,errorCallback){argscheck.checkArgs("FF","Entry.remove",arguments);var fail=errorCallback&&function(code){errorCallback(new FileError(code))};exec(successCallback,fail,"File","remove",[this.fullPath])};Entry.prototype.getParent=function(successCallback,errorCallback){argscheck.checkArgs("FF","Entry.getParent",arguments);var win=successCallback&&function(result){var DirectoryEntry=require("cordova/plugin/DirectoryEntry");var entry=new DirectoryEntry(result.name,result.fullPath);successCallback(entry)};var fail=errorCallback&&function(code){errorCallback(new FileError(code))};exec(win,fail,"File","getParent",[this.fullPath])};module.exports=Entry});define("cordova/plugin/File",function(require,exports,module){var File=function(name,fullPath,type,lastModifiedDate,size){this.name=name||"";this.fullPath=fullPath||null;this.type=type||null;this.lastModifiedDate=lastModifiedDate||null;this.size=size||0;this.start=0;this.end=this.size};File.prototype.slice=function(start,end){var size=this.end-this.start;var newStart=0;var newEnd=size;if(arguments.length){if(start<0){newStart=Math.max(size+start,0)}else{newStart=Math.min(size,start)}}if(arguments.length>=2){if(end<0){newEnd=Math.max(size+end,0)}else{newEnd=Math.min(end,size)}}var newFile=new File(this.name,this.fullPath,this.type,this.lastModifiedData,this.size);newFile.start=this.start+newStart;newFile.end=this.start+newEnd;return newFile};module.exports=File});define("cordova/plugin/FileEntry",function(require,exports,module){var utils=require("cordova/utils"),exec=require("cordova/exec"),Entry=require("cordova/plugin/Entry"),FileWriter=require("cordova/plugin/FileWriter"),File=require("cordova/plugin/File"),FileError=require("cordova/plugin/FileError");var FileEntry=function(name,fullPath){FileEntry.__super__.constructor.apply(this,[true,false,name,fullPath])
};utils.extend(FileEntry,Entry);FileEntry.prototype.createWriter=function(successCallback,errorCallback){this.file(function(filePointer){var writer=new FileWriter(filePointer);if(writer.fileName===null||writer.fileName===""){errorCallback&&errorCallback(new FileError(FileError.INVALID_STATE_ERR))}else{successCallback&&successCallback(writer)}},errorCallback)};FileEntry.prototype.file=function(successCallback,errorCallback){var win=successCallback&&function(f){var file=new File(f.name,f.fullPath,f.type,f.lastModifiedDate,f.size);successCallback(file)};var fail=errorCallback&&function(code){errorCallback(new FileError(code))};exec(win,fail,"File","getFileMetadata",[this.fullPath])};module.exports=FileEntry});define("cordova/plugin/FileError",function(require,exports,module){function FileError(error){this.code=error||null}FileError.NOT_FOUND_ERR=1;FileError.SECURITY_ERR=2;FileError.ABORT_ERR=3;FileError.NOT_READABLE_ERR=4;FileError.ENCODING_ERR=5;FileError.NO_MODIFICATION_ALLOWED_ERR=6;FileError.INVALID_STATE_ERR=7;FileError.SYNTAX_ERR=8;FileError.INVALID_MODIFICATION_ERR=9;FileError.QUOTA_EXCEEDED_ERR=10;FileError.TYPE_MISMATCH_ERR=11;FileError.PATH_EXISTS_ERR=12;module.exports=FileError});define("cordova/plugin/FileReader",function(require,exports,module){var exec=require("cordova/exec"),modulemapper=require("cordova/modulemapper"),utils=require("cordova/utils"),File=require("cordova/plugin/File"),FileError=require("cordova/plugin/FileError"),ProgressEvent=require("cordova/plugin/ProgressEvent"),origFileReader=modulemapper.getOriginalSymbol(this,"FileReader");var FileReader=function(){this._readyState=0;this._error=null;this._result=null;this._fileName="";this._realReader=origFileReader?new origFileReader():{}};FileReader.EMPTY=0;FileReader.LOADING=1;FileReader.DONE=2;utils.defineGetter(FileReader.prototype,"readyState",function(){return this._fileName?this._readyState:this._realReader.readyState});utils.defineGetter(FileReader.prototype,"error",function(){return this._fileName?this._error:this._realReader.error});utils.defineGetter(FileReader.prototype,"result",function(){return this._fileName?this._result:this._realReader.result});function defineEvent(eventName){utils.defineGetterSetter(FileReader.prototype,eventName,function(){return this._realReader[eventName]||null},function(value){this._realReader[eventName]=value})}defineEvent("onloadstart");defineEvent("onprogress");defineEvent("onload");defineEvent("onerror");defineEvent("onloadend");defineEvent("onabort");function initRead(reader,file){if(reader.readyState==FileReader.LOADING){throw new FileError(FileError.INVALID_STATE_ERR)}reader._result=null;reader._error=null;reader._readyState=FileReader.LOADING;if(typeof file=="string"){console.warning("Using a string argument with FileReader.readAs functions is deprecated.");reader._fileName=file}else{if(typeof file.fullPath=="string"){reader._fileName=file.fullPath}else{reader._fileName="";return true}}reader.onloadstart&&reader.onloadstart(new ProgressEvent("loadstart",{target:reader}))}FileReader.prototype.abort=function(){if(origFileReader&&!this._fileName){return this._realReader.abort()}this._result=null;if(this._readyState==FileReader.DONE||this._readyState==FileReader.EMPTY){return}this._readyState=FileReader.DONE;if(typeof this.onabort==="function"){this.onabort(new ProgressEvent("abort",{target:this}))}if(typeof this.onloadend==="function"){this.onloadend(new ProgressEvent("loadend",{target:this}))}};FileReader.prototype.readAsText=function(file,encoding){if(initRead(this,file)){return this._realReader.readAsText(file,encoding)}var enc=encoding?encoding:"UTF-8";var me=this;var execArgs=[this._fileName,enc,file.start,file.end];exec(function(r){if(me._readyState===FileReader.DONE){return}me._result=r;if(typeof me.onload==="function"){me.onload(new ProgressEvent("load",{target:me}))}me._readyState=FileReader.DONE;if(typeof me.onloadend==="function"){me.onloadend(new ProgressEvent("loadend",{target:me}))}},function(e){if(me._readyState===FileReader.DONE){return}me._readyState=FileReader.DONE;me._result=null;me._error=new FileError(e);if(typeof me.onerror==="function"){me.onerror(new ProgressEvent("error",{target:me}))}if(typeof me.onloadend==="function"){me.onloadend(new ProgressEvent("loadend",{target:me}))}},"File","readAsText",execArgs)};FileReader.prototype.readAsDataURL=function(file){if(initRead(this,file)){return this._realReader.readAsDataURL(file)}var me=this;var execArgs=[this._fileName,file.start,file.end];exec(function(r){if(me._readyState===FileReader.DONE){return}me._readyState=FileReader.DONE;me._result=r;if(typeof me.onload==="function"){me.onload(new ProgressEvent("load",{target:me}))}if(typeof me.onloadend==="function"){me.onloadend(new ProgressEvent("loadend",{target:me}))}},function(e){if(me._readyState===FileReader.DONE){return}me._readyState=FileReader.DONE;me._result=null;me._error=new FileError(e);if(typeof me.onerror==="function"){me.onerror(new ProgressEvent("error",{target:me}))
}if(typeof me.onloadend==="function"){me.onloadend(new ProgressEvent("loadend",{target:me}))}},"File","readAsDataURL",execArgs)};FileReader.prototype.readAsBinaryString=function(file){if(initRead(this,file)){return this._realReader.readAsBinaryString(file)}var me=this;var execArgs=[this._fileName,file.start,file.end];exec(function(r){if(me._readyState===FileReader.DONE){return}me._readyState=FileReader.DONE;me._result=r;if(typeof me.onload==="function"){me.onload(new ProgressEvent("load",{target:me}))}if(typeof me.onloadend==="function"){me.onloadend(new ProgressEvent("loadend",{target:me}))}},function(e){if(me._readyState===FileReader.DONE){return}me._readyState=FileReader.DONE;me._result=null;me._error=new FileError(e);if(typeof me.onerror==="function"){me.onerror(new ProgressEvent("error",{target:me}))}if(typeof me.onloadend==="function"){me.onloadend(new ProgressEvent("loadend",{target:me}))}},"File","readAsBinaryString",execArgs)};FileReader.prototype.readAsArrayBuffer=function(file){if(initRead(this,file)){return this._realReader.readAsArrayBuffer(file)}var me=this;var execArgs=[this._fileName,file.start,file.end];exec(function(r){if(me._readyState===FileReader.DONE){return}me._readyState=FileReader.DONE;me._result=r;if(typeof me.onload==="function"){me.onload(new ProgressEvent("load",{target:me}))}if(typeof me.onloadend==="function"){me.onloadend(new ProgressEvent("loadend",{target:me}))}},function(e){if(me._readyState===FileReader.DONE){return}me._readyState=FileReader.DONE;me._result=null;me._error=new FileError(e);if(typeof me.onerror==="function"){me.onerror(new ProgressEvent("error",{target:me}))}if(typeof me.onloadend==="function"){me.onloadend(new ProgressEvent("loadend",{target:me}))}},"File","readAsArrayBuffer",execArgs)};module.exports=FileReader});define("cordova/plugin/FileSystem",function(require,exports,module){var DirectoryEntry=require("cordova/plugin/DirectoryEntry");var FileSystem=function(name,root){this.name=name||null;if(root){this.root=new DirectoryEntry(root.name,root.fullPath)}};module.exports=FileSystem});define("cordova/plugin/FileTransfer",function(require,exports,module){var argscheck=require("cordova/argscheck"),exec=require("cordova/exec"),FileTransferError=require("cordova/plugin/FileTransferError"),ProgressEvent=require("cordova/plugin/ProgressEvent");function newProgressEvent(result){var pe=new ProgressEvent();pe.lengthComputable=result.lengthComputable;pe.loaded=result.loaded;pe.total=result.total;return pe}function getBasicAuthHeader(urlString){var header=null;if(window.btoa){var url=document.createElement("a");url.href=urlString;var credentials=null;var protocol=url.protocol+"//";var origin=protocol+url.host;if(url.href.indexOf(origin)!=0){var atIndex=url.href.indexOf("@");credentials=url.href.substring(protocol.length,atIndex)}if(credentials){var authHeader="Authorization";var authHeaderValue="Basic "+window.btoa(credentials);header={name:authHeader,value:authHeaderValue}}}return header}var idCounter=0;var FileTransfer=function(){this._id=++idCounter;this.onprogress=null};FileTransfer.prototype.upload=function(filePath,server,successCallback,errorCallback,options,trustAllHosts){argscheck.checkArgs("ssFFO*","FileTransfer.upload",arguments);var fileKey=null;var fileName=null;var mimeType=null;var params=null;var chunkedMode=true;var headers=null;var basicAuthHeader=getBasicAuthHeader(server);if(basicAuthHeader){if(!options){options=new FileUploadOptions()}if(!options.headers){options.headers={}}options.headers[basicAuthHeader.name]=basicAuthHeader.value}if(options){fileKey=options.fileKey;fileName=options.fileName;mimeType=options.mimeType;headers=options.headers;if(options.chunkedMode!==null||typeof options.chunkedMode!="undefined"){chunkedMode=options.chunkedMode}if(options.params){params=options.params}else{params={}}}var fail=errorCallback&&function(e){var error=new FileTransferError(e.code,e.source,e.target,e.http_status,e.body);errorCallback(error)};var self=this;var win=function(result){if(typeof result.lengthComputable!="undefined"){if(self.onprogress){self.onprogress(newProgressEvent(result))}}else{successCallback&&successCallback(result)}};exec(win,fail,"FileTransfer","upload",[filePath,server,fileKey,fileName,mimeType,params,trustAllHosts,chunkedMode,headers,this._id])};FileTransfer.prototype.download=function(source,target,successCallback,errorCallback,trustAllHosts,options){argscheck.checkArgs("ssFF*","FileTransfer.download",arguments);var self=this;var basicAuthHeader=getBasicAuthHeader(source);if(basicAuthHeader){if(!options){options={}}if(!options.headers){options.headers={}}options.headers[basicAuthHeader.name]=basicAuthHeader.value}var headers=null;if(options){headers=options.headers||null}var win=function(result){if(typeof result.lengthComputable!="undefined"){if(self.onprogress){return self.onprogress(newProgressEvent(result))}}else{if(successCallback){var entry=null;if(result.isDirectory){entry=new (require("cordova/plugin/DirectoryEntry"))()}else{if(result.isFile){entry=new (require("cordova/plugin/FileEntry"))()
}}entry.isDirectory=result.isDirectory;entry.isFile=result.isFile;entry.name=result.name;entry.fullPath=result.fullPath;successCallback(entry)}}};var fail=errorCallback&&function(e){var error=new FileTransferError(e.code,e.source,e.target,e.http_status,e.body);errorCallback(error)};exec(win,fail,"FileTransfer","download",[source,target,trustAllHosts,this._id,headers])};FileTransfer.prototype.abort=function(successCallback,errorCallback){exec(successCallback,errorCallback,"FileTransfer","abort",[this._id])};module.exports=FileTransfer});define("cordova/plugin/FileTransferError",function(require,exports,module){var FileTransferError=function(code,source,target,status,body){this.code=code||null;this.source=source||null;this.target=target||null;this.http_status=status||null;this.body=body||null};FileTransferError.FILE_NOT_FOUND_ERR=1;FileTransferError.INVALID_URL_ERR=2;FileTransferError.CONNECTION_ERR=3;FileTransferError.ABORT_ERR=4;module.exports=FileTransferError});define("cordova/plugin/FileUploadOptions",function(require,exports,module){var FileUploadOptions=function(fileKey,fileName,mimeType,params,headers){this.fileKey=fileKey||null;this.fileName=fileName||null;this.mimeType=mimeType||null;this.params=params||null;this.headers=headers||null};module.exports=FileUploadOptions});define("cordova/plugin/FileUploadResult",function(require,exports,module){var FileUploadResult=function(){this.bytesSent=0;this.responseCode=null;this.response=null};module.exports=FileUploadResult});define("cordova/plugin/FileWriter",function(require,exports,module){var exec=require("cordova/exec"),FileError=require("cordova/plugin/FileError"),ProgressEvent=require("cordova/plugin/ProgressEvent");var FileWriter=function(file){this.fileName="";this.length=0;if(file){this.fileName=file.fullPath||file;this.length=file.size||0}this.position=0;this.readyState=0;this.result=null;this.error=null;this.onwritestart=null;this.onprogress=null;this.onwrite=null;this.onwriteend=null;this.onabort=null;this.onerror=null};FileWriter.INIT=0;FileWriter.WRITING=1;FileWriter.DONE=2;FileWriter.prototype.abort=function(){if(this.readyState===FileWriter.DONE||this.readyState===FileWriter.INIT){throw new FileError(FileError.INVALID_STATE_ERR)}this.error=new FileError(FileError.ABORT_ERR);this.readyState=FileWriter.DONE;if(typeof this.onabort==="function"){this.onabort(new ProgressEvent("abort",{"target":this}))}if(typeof this.onwriteend==="function"){this.onwriteend(new ProgressEvent("writeend",{"target":this}))}};FileWriter.prototype.write=function(text){if(this.readyState===FileWriter.WRITING){throw new FileError(FileError.INVALID_STATE_ERR)}this.readyState=FileWriter.WRITING;var me=this;if(typeof me.onwritestart==="function"){me.onwritestart(new ProgressEvent("writestart",{"target":me}))}exec(function(r){if(me.readyState===FileWriter.DONE){return}me.position+=r;me.length=me.position;me.readyState=FileWriter.DONE;if(typeof me.onwrite==="function"){me.onwrite(new ProgressEvent("write",{"target":me}))}if(typeof me.onwriteend==="function"){me.onwriteend(new ProgressEvent("writeend",{"target":me}))}},function(e){if(me.readyState===FileWriter.DONE){return}me.readyState=FileWriter.DONE;me.error=new FileError(e);if(typeof me.onerror==="function"){me.onerror(new ProgressEvent("error",{"target":me}))}if(typeof me.onwriteend==="function"){me.onwriteend(new ProgressEvent("writeend",{"target":me}))}},"File","write",[this.fileName,text,this.position])};FileWriter.prototype.seek=function(offset){if(this.readyState===FileWriter.WRITING){throw new FileError(FileError.INVALID_STATE_ERR)}if(!offset&&offset!==0){return}if(offset<0){this.position=Math.max(offset+this.length,0)}else{if(offset>this.length){this.position=this.length}else{this.position=offset}}};FileWriter.prototype.truncate=function(size){if(this.readyState===FileWriter.WRITING){throw new FileError(FileError.INVALID_STATE_ERR)}this.readyState=FileWriter.WRITING;var me=this;if(typeof me.onwritestart==="function"){me.onwritestart(new ProgressEvent("writestart",{"target":this}))}exec(function(r){if(me.readyState===FileWriter.DONE){return}me.readyState=FileWriter.DONE;me.length=r;me.position=Math.min(me.position,r);if(typeof me.onwrite==="function"){me.onwrite(new ProgressEvent("write",{"target":me}))}if(typeof me.onwriteend==="function"){me.onwriteend(new ProgressEvent("writeend",{"target":me}))}},function(e){if(me.readyState===FileWriter.DONE){return}me.readyState=FileWriter.DONE;me.error=new FileError(e);if(typeof me.onerror==="function"){me.onerror(new ProgressEvent("error",{"target":me}))}if(typeof me.onwriteend==="function"){me.onwriteend(new ProgressEvent("writeend",{"target":me}))}},"File","truncate",[this.fileName,size])};module.exports=FileWriter});define("cordova/plugin/Flags",function(require,exports,module){function Flags(create,exclusive){this.create=create||false;this.exclusive=exclusive||false}module.exports=Flags});define("cordova/plugin/GlobalizationError",function(require,exports,module){var GlobalizationError=function(code,message){this.code=code||null;
this.message=message||""};GlobalizationError.UNKNOWN_ERROR=0;GlobalizationError.FORMATTING_ERROR=1;GlobalizationError.PARSING_ERROR=2;GlobalizationError.PATTERN_ERROR=3;module.exports=GlobalizationError});define("cordova/plugin/InAppBrowser",function(require,exports,module){var exec=require("cordova/exec");var channel=require("cordova/channel");function InAppBrowser(){this.channels={"loadstart":channel.create("loadstart"),"loadstop":channel.create("loadstop"),"loaderror":channel.create("loaderror"),"exit":channel.create("exit")}}InAppBrowser.prototype={_eventHandler:function(event){if(event.type in this.channels){this.channels[event.type].fire(event)}},close:function(eventname){exec(null,null,"InAppBrowser","close",[])},addEventListener:function(eventname,f){if(eventname in this.channels){this.channels[eventname].subscribe(f)}},removeEventListener:function(eventname,f){if(eventname in this.channels){this.channels[eventname].unsubscribe(f)}}};module.exports=function(strUrl,strWindowName,strWindowFeatures){var iab=new InAppBrowser();var cb=function(eventname){iab._eventHandler(eventname)};exec(cb,cb,"InAppBrowser","open",[strUrl,strWindowName,strWindowFeatures]);return iab}});define("cordova/plugin/LocalFileSystem",function(require,exports,module){var exec=require("cordova/exec");var LocalFileSystem=function(){};LocalFileSystem.TEMPORARY=0;LocalFileSystem.PERSISTENT=1;module.exports=LocalFileSystem});define("cordova/plugin/Media",function(require,exports,module){var argscheck=require("cordova/argscheck"),utils=require("cordova/utils"),exec=require("cordova/exec");var mediaObjects={};var Media=function(src,successCallback,errorCallback,statusCallback){argscheck.checkArgs("SFFF","Media",arguments);this.id=utils.createUUID();mediaObjects[this.id]=this;this.src=src;this.successCallback=successCallback;this.errorCallback=errorCallback;this.statusCallback=statusCallback;this._duration=-1;this._position=-1;exec(null,this.errorCallback,"Media","create",[this.id,this.src])};Media.MEDIA_STATE=1;Media.MEDIA_DURATION=2;Media.MEDIA_POSITION=3;Media.MEDIA_ERROR=9;Media.MEDIA_NONE=0;Media.MEDIA_STARTING=1;Media.MEDIA_RUNNING=2;Media.MEDIA_PAUSED=3;Media.MEDIA_STOPPED=4;Media.MEDIA_MSG=["None","Starting","Running","Paused","Stopped"];Media.get=function(id){return mediaObjects[id]};Media.prototype.play=function(options){exec(null,null,"Media","startPlayingAudio",[this.id,this.src,options])};Media.prototype.stop=function(){var me=this;exec(function(){me._position=0},this.errorCallback,"Media","stopPlayingAudio",[this.id])};Media.prototype.seekTo=function(milliseconds){var me=this;exec(function(p){me._position=p},this.errorCallback,"Media","seekToAudio",[this.id,milliseconds])};Media.prototype.pause=function(){exec(null,this.errorCallback,"Media","pausePlayingAudio",[this.id])};Media.prototype.getDuration=function(){return this._duration};Media.prototype.getCurrentPosition=function(success,fail){var me=this;exec(function(p){me._position=p;success(p)},fail,"Media","getCurrentPositionAudio",[this.id])};Media.prototype.startRecord=function(){exec(null,this.errorCallback,"Media","startRecordingAudio",[this.id,this.src])};Media.prototype.stopRecord=function(){exec(null,this.errorCallback,"Media","stopRecordingAudio",[this.id])};Media.prototype.release=function(){exec(null,this.errorCallback,"Media","release",[this.id])};Media.prototype.setVolume=function(volume){exec(null,null,"Media","setVolume",[this.id,volume])};Media.onStatus=function(id,msgType,value){var media=mediaObjects[id];if(media){switch(msgType){case Media.MEDIA_STATE:media.statusCallback&&media.statusCallback(value);if(value==Media.MEDIA_STOPPED){media.successCallback&&media.successCallback()}break;case Media.MEDIA_DURATION:media._duration=value;break;case Media.MEDIA_ERROR:media.errorCallback&&media.errorCallback(value);break;case Media.MEDIA_POSITION:media._position=Number(value);break;default:console.error&&console.error("Unhandled Media.onStatus :: "+msgType);break}}else{console.error&&console.error("Received Media.onStatus callback for unknown media :: "+id)}};module.exports=Media});define("cordova/plugin/MediaError",function(require,exports,module){var _MediaError=window.MediaError;if(!_MediaError){window.MediaError=_MediaError=function(code,msg){this.code=(typeof code!="undefined")?code:null;this.message=msg||""}}_MediaError.MEDIA_ERR_NONE_ACTIVE=_MediaError.MEDIA_ERR_NONE_ACTIVE||0;_MediaError.MEDIA_ERR_ABORTED=_MediaError.MEDIA_ERR_ABORTED||1;_MediaError.MEDIA_ERR_NETWORK=_MediaError.MEDIA_ERR_NETWORK||2;_MediaError.MEDIA_ERR_DECODE=_MediaError.MEDIA_ERR_DECODE||3;_MediaError.MEDIA_ERR_NONE_SUPPORTED=_MediaError.MEDIA_ERR_NONE_SUPPORTED||4;_MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED=_MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED||4;module.exports=_MediaError});define("cordova/plugin/MediaFile",function(require,exports,module){var utils=require("cordova/utils"),exec=require("cordova/exec"),File=require("cordova/plugin/File"),CaptureError=require("cordova/plugin/CaptureError");
var MediaFile=function(name,fullPath,type,lastModifiedDate,size){MediaFile.__super__.constructor.apply(this,arguments)};utils.extend(MediaFile,File);MediaFile.prototype.getFormatData=function(successCallback,errorCallback){if(typeof this.fullPath==="undefined"||this.fullPath===null){errorCallback(new CaptureError(CaptureError.CAPTURE_INVALID_ARGUMENT))}else{exec(successCallback,errorCallback,"Capture","getFormatData",[this.fullPath,this.type])}};module.exports=MediaFile});define("cordova/plugin/MediaFileData",function(require,exports,module){var MediaFileData=function(codecs,bitrate,height,width,duration){this.codecs=codecs||null;this.bitrate=bitrate||0;this.height=height||0;this.width=width||0;this.duration=duration||0};module.exports=MediaFileData});define("cordova/plugin/Metadata",function(require,exports,module){var Metadata=function(time){this.modificationTime=(typeof time!="undefined"?new Date(time):null)};module.exports=Metadata});define("cordova/plugin/Position",function(require,exports,module){var Coordinates=require("cordova/plugin/Coordinates");var Position=function(coords,timestamp){if(coords){this.coords=new Coordinates(coords.latitude,coords.longitude,coords.altitude,coords.accuracy,coords.heading,coords.velocity,coords.altitudeAccuracy)}else{this.coords=new Coordinates()}this.timestamp=(timestamp!==undefined)?timestamp:new Date()};module.exports=Position});define("cordova/plugin/PositionError",function(require,exports,module){var PositionError=function(code,message){this.code=code||null;this.message=message||""};PositionError.PERMISSION_DENIED=1;PositionError.POSITION_UNAVAILABLE=2;PositionError.TIMEOUT=3;module.exports=PositionError});define("cordova/plugin/ProgressEvent",function(require,exports,module){var ProgressEvent=(function(){return function ProgressEvent(type,dict){this.type=type;this.bubbles=false;this.cancelBubble=false;this.cancelable=false;this.lengthComputable=false;this.loaded=dict&&dict.loaded?dict.loaded:0;this.total=dict&&dict.total?dict.total:0;this.target=dict&&dict.target?dict.target:null}})();module.exports=ProgressEvent});define("cordova/plugin/accelerometer",function(require,exports,module){var argscheck=require("cordova/argscheck"),utils=require("cordova/utils"),exec=require("cordova/exec"),Acceleration=require("cordova/plugin/Acceleration");var running=false;var timers={};var listeners=[];var accel=null;function start(){exec(function(a){var tempListeners=listeners.slice(0);accel=new Acceleration(a.x,a.y,a.z,a.timestamp);for(var i=0,l=tempListeners.length;i<l;i++){tempListeners[i].win(accel)}},function(e){var tempListeners=listeners.slice(0);for(var i=0,l=tempListeners.length;i<l;i++){tempListeners[i].fail(e)}},"Accelerometer","start",[]);running=true}function stop(){exec(null,null,"Accelerometer","stop",[]);running=false}function createCallbackPair(win,fail){return{win:win,fail:fail}}function removeListeners(l){var idx=listeners.indexOf(l);if(idx>-1){listeners.splice(idx,1);if(listeners.length===0){stop()}}}var accelerometer={getCurrentAcceleration:function(successCallback,errorCallback,options){argscheck.checkArgs("fFO","accelerometer.getCurrentAcceleration",arguments);var p;var win=function(a){removeListeners(p);successCallback(a)};var fail=function(e){removeListeners(p);errorCallback&&errorCallback(e)};p=createCallbackPair(win,fail);listeners.push(p);if(!running){start()}},watchAcceleration:function(successCallback,errorCallback,options){argscheck.checkArgs("fFO","accelerometer.watchAcceleration",arguments);var frequency=(options&&options.frequency&&typeof options.frequency=="number")?options.frequency:10000;var id=utils.createUUID();var p=createCallbackPair(function(){},function(e){removeListeners(p);errorCallback&&errorCallback(e)});listeners.push(p);timers[id]={timer:window.setInterval(function(){if(accel){successCallback(accel)}},frequency),listeners:p};if(running){if(accel){successCallback(accel)}}else{start()}return id},clearWatch:function(id){if(id&&timers[id]){window.clearInterval(timers[id].timer);removeListeners(timers[id].listeners);delete timers[id]}}};module.exports=accelerometer});define("cordova/plugin/accelerometer/symbols",function(require,exports,module){var modulemapper=require("cordova/modulemapper");modulemapper.defaults("cordova/plugin/Acceleration","Acceleration");modulemapper.defaults("cordova/plugin/accelerometer","navigator.accelerometer")});define("cordova/plugin/battery",function(require,exports,module){var cordova=require("cordova"),exec=require("cordova/exec");function handlers(){return battery.channels.batterystatus.numHandlers+battery.channels.batterylow.numHandlers+battery.channels.batterycritical.numHandlers}var Battery=function(){this._level=null;this._isPlugged=null;this.channels={batterystatus:cordova.addWindowEventHandler("batterystatus"),batterylow:cordova.addWindowEventHandler("batterylow"),batterycritical:cordova.addWindowEventHandler("batterycritical")};for(var key in this.channels){this.channels[key].onHasSubscribersChange=Battery.onHasSubscribersChange
}};Battery.onHasSubscribersChange=function(){if(this.numHandlers===1&&handlers()===1){exec(battery._status,battery._error,"Battery","start",[])}else{if(handlers()===0){exec(null,null,"Battery","stop",[])}}};Battery.prototype._status=function(info){if(info){var me=battery;var level=info.level;if(me._level!==level||me._isPlugged!==info.isPlugged){cordova.fireWindowEvent("batterystatus",info);if(level===20||level===5){if(level===20){cordova.fireWindowEvent("batterylow",info)}else{cordova.fireWindowEvent("batterycritical",info)}}}me._level=level;me._isPlugged=info.isPlugged}};Battery.prototype._error=function(e){console.log("Error initializing Battery: "+e)};var battery=new Battery();module.exports=battery});define("cordova/plugin/battery/symbols",function(require,exports,module){var modulemapper=require("cordova/modulemapper");modulemapper.defaults("cordova/plugin/battery","navigator.battery")});define("cordova/plugin/camera/symbols",function(require,exports,module){var modulemapper=require("cordova/modulemapper");modulemapper.defaults("cordova/plugin/Camera","navigator.camera");modulemapper.defaults("cordova/plugin/CameraConstants","Camera");modulemapper.defaults("cordova/plugin/CameraPopoverOptions","CameraPopoverOptions")});define("cordova/plugin/capture",function(require,exports,module){var exec=require("cordova/exec"),MediaFile=require("cordova/plugin/MediaFile");function _capture(type,successCallback,errorCallback,options){var win=function(pluginResult){var mediaFiles=[];var i;for(i=0;i<pluginResult.length;i++){var mediaFile=new MediaFile();mediaFile.name=pluginResult[i].name;mediaFile.fullPath=pluginResult[i].fullPath;mediaFile.type=pluginResult[i].type;mediaFile.lastModifiedDate=pluginResult[i].lastModifiedDate;mediaFile.size=pluginResult[i].size;mediaFiles.push(mediaFile)}successCallback(mediaFiles)};exec(win,errorCallback,"Capture",type,[options])}function Capture(){this.supportedAudioModes=[];this.supportedImageModes=[];this.supportedVideoModes=[]}Capture.prototype.captureAudio=function(successCallback,errorCallback,options){_capture("captureAudio",successCallback,errorCallback,options)};Capture.prototype.captureImage=function(successCallback,errorCallback,options){_capture("captureImage",successCallback,errorCallback,options)};Capture.prototype.captureVideo=function(successCallback,errorCallback,options){_capture("captureVideo",successCallback,errorCallback,options)};module.exports=new Capture()});define("cordova/plugin/capture/symbols",function(require,exports,module){var modulemapper=require("cordova/modulemapper");modulemapper.clobbers("cordova/plugin/CaptureError","CaptureError");modulemapper.clobbers("cordova/plugin/CaptureAudioOptions","CaptureAudioOptions");modulemapper.clobbers("cordova/plugin/CaptureImageOptions","CaptureImageOptions");modulemapper.clobbers("cordova/plugin/CaptureVideoOptions","CaptureVideoOptions");modulemapper.clobbers("cordova/plugin/ConfigurationData","ConfigurationData");modulemapper.clobbers("cordova/plugin/MediaFile","MediaFile");modulemapper.clobbers("cordova/plugin/MediaFileData","MediaFileData");modulemapper.clobbers("cordova/plugin/capture","navigator.device.capture")});define("cordova/plugin/compass",function(require,exports,module){var argscheck=require("cordova/argscheck"),exec=require("cordova/exec"),utils=require("cordova/utils"),CompassHeading=require("cordova/plugin/CompassHeading"),CompassError=require("cordova/plugin/CompassError"),timers={},compass={getCurrentHeading:function(successCallback,errorCallback,options){argscheck.checkArgs("fFO","compass.getCurrentHeading",arguments);var win=function(result){var ch=new CompassHeading(result.magneticHeading,result.trueHeading,result.headingAccuracy,result.timestamp);successCallback(ch)};var fail=errorCallback&&function(code){var ce=new CompassError(code);errorCallback(ce)};exec(win,fail,"Compass","getHeading",[options])},watchHeading:function(successCallback,errorCallback,options){argscheck.checkArgs("fFO","compass.watchHeading",arguments);var frequency=(options!==undefined&&options.frequency!==undefined)?options.frequency:100;var filter=(options!==undefined&&options.filter!==undefined)?options.filter:0;var id=utils.createUUID();if(filter>0){timers[id]="iOS";compass.getCurrentHeading(successCallback,errorCallback,options)}else{timers[id]=window.setInterval(function(){compass.getCurrentHeading(successCallback,errorCallback)},frequency)}return id},clearWatch:function(id){if(id&&timers[id]){if(timers[id]!="iOS"){clearInterval(timers[id])}else{exec(null,null,"Compass","stopHeading",[])}delete timers[id]}}};module.exports=compass});define("cordova/plugin/compass/symbols",function(require,exports,module){var modulemapper=require("cordova/modulemapper");modulemapper.clobbers("cordova/plugin/CompassHeading","CompassHeading");modulemapper.clobbers("cordova/plugin/CompassError","CompassError");modulemapper.clobbers("cordova/plugin/compass","navigator.compass")});define("cordova/plugin/console-via-logger",function(require,exports,module){var logger=require("cordova/plugin/logger");
var utils=require("cordova/utils");var console=module.exports;var WinConsole=window.console;var UseLogger=false;var Timers={};function noop(){}console.useLogger=function(value){if(arguments.length){UseLogger=!!value}if(UseLogger){if(logger.useConsole()){throw new Error("console and logger are too intertwingly")}}return UseLogger};console.log=function(){if(logger.useConsole()){return}logger.log.apply(logger,[].slice.call(arguments))};console.error=function(){if(logger.useConsole()){return}logger.error.apply(logger,[].slice.call(arguments))};console.warn=function(){if(logger.useConsole()){return}logger.warn.apply(logger,[].slice.call(arguments))};console.info=function(){if(logger.useConsole()){return}logger.info.apply(logger,[].slice.call(arguments))};console.debug=function(){if(logger.useConsole()){return}logger.debug.apply(logger,[].slice.call(arguments))};console.assert=function(expression){if(expression){return}var message=utils.vformat(arguments[1],[].slice.call(arguments,2));console.log("ASSERT: "+message)};console.clear=function(){};console.dir=function(object){console.log("%o",object)};console.dirxml=function(node){console.log(node.innerHTML)};console.trace=noop;console.group=console.log;console.groupCollapsed=console.log;console.groupEnd=noop;console.time=function(name){Timers[name]=new Date().valueOf()};console.timeEnd=function(name){var timeStart=Timers[name];if(!timeStart){console.warn("unknown timer: "+name);return}var timeElapsed=new Date().valueOf()-timeStart;console.log(name+": "+timeElapsed+"ms")};console.timeStamp=noop;console.profile=noop;console.profileEnd=noop;console.count=noop;console.exception=console.log;console.table=function(data,columns){console.log("%o",data)};function wrappedOrigCall(orgFunc,newFunc){return function(){var args=[].slice.call(arguments);try{orgFunc.apply(WinConsole,args)}catch(e){}try{newFunc.apply(console,args)}catch(e){}}}for(var key in console){if(typeof WinConsole[key]=="function"){console[key]=wrappedOrigCall(WinConsole[key],console[key])}}});define("cordova/plugin/contacts",function(require,exports,module){var argscheck=require("cordova/argscheck"),exec=require("cordova/exec"),ContactError=require("cordova/plugin/ContactError"),utils=require("cordova/utils"),Contact=require("cordova/plugin/Contact");var contacts={find:function(fields,successCB,errorCB,options){argscheck.checkArgs("afFO","contacts.find",arguments);if(!fields.length){errorCB&&errorCB(new ContactError(ContactError.INVALID_ARGUMENT_ERROR))}else{var win=function(result){var cs=[];for(var i=0,l=result.length;i<l;i++){cs.push(contacts.create(result[i]))}successCB(cs)};exec(win,errorCB,"Contacts","search",[fields,options])}},create:function(properties){argscheck.checkArgs("O","contacts.create",arguments);var contact=new Contact();for(var i in properties){if(typeof contact[i]!=="undefined"&&properties.hasOwnProperty(i)){contact[i]=properties[i]}}return contact}};module.exports=contacts});define("cordova/plugin/contacts/symbols",function(require,exports,module){var modulemapper=require("cordova/modulemapper");modulemapper.clobbers("cordova/plugin/contacts","navigator.contacts");modulemapper.clobbers("cordova/plugin/Contact","Contact");modulemapper.clobbers("cordova/plugin/ContactAddress","ContactAddress");modulemapper.clobbers("cordova/plugin/ContactError","ContactError");modulemapper.clobbers("cordova/plugin/ContactField","ContactField");modulemapper.clobbers("cordova/plugin/ContactFindOptions","ContactFindOptions");modulemapper.clobbers("cordova/plugin/ContactName","ContactName");modulemapper.clobbers("cordova/plugin/ContactOrganization","ContactOrganization")});define("cordova/plugin/device",function(require,exports,module){var argscheck=require("cordova/argscheck"),channel=require("cordova/channel"),utils=require("cordova/utils"),exec=require("cordova/exec");channel.waitForInitialization("onCordovaInfoReady");function Device(){this.available=false;this.platform=null;this.version=null;this.name=null;this.uuid=null;this.cordova=null;this.model=null;var me=this;channel.onCordovaReady.subscribe(function(){me.getInfo(function(info){me.available=true;me.platform=info.platform;me.version=info.version;me.name=info.name;me.uuid=info.uuid;me.cordova=info.cordova;me.model=info.model;channel.onCordovaInfoReady.fire()},function(e){me.available=false;utils.alert("[ERROR] Error initializing Cordova: "+e)})})}Device.prototype.getInfo=function(successCallback,errorCallback){argscheck.checkArgs("fF","Device.getInfo",arguments);exec(successCallback,errorCallback,"Device","getDeviceInfo",[])};module.exports=new Device()});define("cordova/plugin/device/symbols",function(require,exports,module){var modulemapper=require("cordova/modulemapper");modulemapper.clobbers("cordova/plugin/device","device")});define("cordova/plugin/echo",function(require,exports,module){var exec=require("cordova/exec"),utils=require("cordova/utils");module.exports=function(successCallback,errorCallback,message,forceAsync){var action="echo";var messageIsMultipart=(utils.typeName(message)=="Array");
var args=messageIsMultipart?message:[message];if(utils.typeName(message)=="ArrayBuffer"){if(forceAsync){console.warn("Cannot echo ArrayBuffer with forced async, falling back to sync.")}action+="ArrayBuffer"}else{if(messageIsMultipart){if(forceAsync){console.warn("Cannot echo MultiPart Array with forced async, falling back to sync.")}action+="MultiPart"}else{if(forceAsync){action+="Async"}}}exec(successCallback,errorCallback,"Echo",action,args)}});define("cordova/plugin/file/symbols",function(require,exports,module){var modulemapper=require("cordova/modulemapper"),symbolshelper=require("cordova/plugin/file/symbolshelper");symbolshelper(modulemapper.clobbers);modulemapper.merges("cordova/plugin/ios/Entry","Entry")});define("cordova/plugin/file/symbolshelper",function(require,exports,module){module.exports=function(exportFunc){exportFunc("cordova/plugin/DirectoryEntry","DirectoryEntry");exportFunc("cordova/plugin/DirectoryReader","DirectoryReader");exportFunc("cordova/plugin/Entry","Entry");exportFunc("cordova/plugin/File","File");exportFunc("cordova/plugin/FileEntry","FileEntry");exportFunc("cordova/plugin/FileError","FileError");exportFunc("cordova/plugin/FileReader","FileReader");exportFunc("cordova/plugin/FileSystem","FileSystem");exportFunc("cordova/plugin/FileUploadOptions","FileUploadOptions");exportFunc("cordova/plugin/FileUploadResult","FileUploadResult");exportFunc("cordova/plugin/FileWriter","FileWriter");exportFunc("cordova/plugin/Flags","Flags");exportFunc("cordova/plugin/LocalFileSystem","LocalFileSystem");exportFunc("cordova/plugin/Metadata","Metadata");exportFunc("cordova/plugin/ProgressEvent","ProgressEvent");exportFunc("cordova/plugin/requestFileSystem","requestFileSystem");exportFunc("cordova/plugin/resolveLocalFileSystemURI","resolveLocalFileSystemURI")}});define("cordova/plugin/filetransfer/symbols",function(require,exports,module){var modulemapper=require("cordova/modulemapper");modulemapper.clobbers("cordova/plugin/FileTransfer","FileTransfer");modulemapper.clobbers("cordova/plugin/FileTransferError","FileTransferError")});define("cordova/plugin/geolocation",function(require,exports,module){var argscheck=require("cordova/argscheck"),utils=require("cordova/utils"),exec=require("cordova/exec"),PositionError=require("cordova/plugin/PositionError"),Position=require("cordova/plugin/Position");var timers={};function parseParameters(options){var opt={maximumAge:0,enableHighAccuracy:false,timeout:Infinity};if(options){if(options.maximumAge!==undefined&&!isNaN(options.maximumAge)&&options.maximumAge>0){opt.maximumAge=options.maximumAge}if(options.enableHighAccuracy!==undefined){opt.enableHighAccuracy=options.enableHighAccuracy}if(options.timeout!==undefined&&!isNaN(options.timeout)){if(options.timeout<0){opt.timeout=0}else{opt.timeout=options.timeout}}}return opt}function createTimeout(errorCallback,timeout){var t=setTimeout(function(){clearTimeout(t);t=null;errorCallback({code:PositionError.TIMEOUT,message:"Position retrieval timed out."})},timeout);return t}var geolocation={lastPosition:null,getCurrentPosition:function(successCallback,errorCallback,options){argscheck.checkArgs("fFO","geolocation.getCurrentPosition",arguments);options=parseParameters(options);var timeoutTimer={timer:null};var win=function(p){clearTimeout(timeoutTimer.timer);if(!(timeoutTimer.timer)){return}var pos=new Position({latitude:p.latitude,longitude:p.longitude,altitude:p.altitude,accuracy:p.accuracy,heading:p.heading,velocity:p.velocity,altitudeAccuracy:p.altitudeAccuracy},(p.timestamp===undefined?new Date():((p.timestamp instanceof Date)?p.timestamp:new Date(p.timestamp))));geolocation.lastPosition=pos;successCallback(pos)};var fail=function(e){clearTimeout(timeoutTimer.timer);timeoutTimer.timer=null;var err=new PositionError(e.code,e.message);if(errorCallback){errorCallback(err)}};if(geolocation.lastPosition&&options.maximumAge&&(((new Date()).getTime()-geolocation.lastPosition.timestamp.getTime())<=options.maximumAge)){successCallback(geolocation.lastPosition)}else{if(options.timeout===0){fail({code:PositionError.TIMEOUT,message:"timeout value in PositionOptions set to 0 and no cached Position object available, or cached Position object's age exceeds provided PositionOptions' maximumAge parameter."})}else{if(options.timeout!==Infinity){timeoutTimer.timer=createTimeout(fail,options.timeout)}else{timeoutTimer.timer=true}exec(win,fail,"Geolocation","getLocation",[options.enableHighAccuracy,options.maximumAge])}}return timeoutTimer},watchPosition:function(successCallback,errorCallback,options){argscheck.checkArgs("fFO","geolocation.getCurrentPosition",arguments);options=parseParameters(options);var id=utils.createUUID();timers[id]=geolocation.getCurrentPosition(successCallback,errorCallback,options);var fail=function(e){clearTimeout(timers[id].timer);var err=new PositionError(e.code,e.message);if(errorCallback){errorCallback(err)}};var win=function(p){clearTimeout(timers[id].timer);if(options.timeout!==Infinity){timers[id].timer=createTimeout(fail,options.timeout)
}var pos=new Position({latitude:p.latitude,longitude:p.longitude,altitude:p.altitude,accuracy:p.accuracy,heading:p.heading,velocity:p.velocity,altitudeAccuracy:p.altitudeAccuracy},(p.timestamp===undefined?new Date():((p.timestamp instanceof Date)?p.timestamp:new Date(p.timestamp))));geolocation.lastPosition=pos;successCallback(pos)};exec(win,fail,"Geolocation","addWatch",[id,options.enableHighAccuracy]);return id},clearWatch:function(id){if(id&&timers[id]!==undefined){clearTimeout(timers[id].timer);timers[id].timer=false;exec(null,null,"Geolocation","clearWatch",[id])}}};module.exports=geolocation});define("cordova/plugin/geolocation/symbols",function(require,exports,module){var modulemapper=require("cordova/modulemapper");modulemapper.defaults("cordova/plugin/geolocation","navigator.geolocation");modulemapper.clobbers("cordova/plugin/PositionError","PositionError");modulemapper.clobbers("cordova/plugin/Position","Position");modulemapper.clobbers("cordova/plugin/Coordinates","Coordinates")});define("cordova/plugin/globalization",function(require,exports,module){var argscheck=require("cordova/argscheck"),exec=require("cordova/exec"),GlobalizationError=require("cordova/plugin/GlobalizationError");var globalization={getPreferredLanguage:function(successCB,failureCB){argscheck.checkArgs("fF","Globalization.getPreferredLanguage",arguments);exec(successCB,failureCB,"Globalization","getPreferredLanguage",[])},getLocaleName:function(successCB,failureCB){argscheck.checkArgs("fF","Globalization.getLocaleName",arguments);exec(successCB,failureCB,"Globalization","getLocaleName",[])},dateToString:function(date,successCB,failureCB,options){argscheck.checkArgs("dfFO","Globalization.dateToString",arguments);var dateValue=date.valueOf();exec(successCB,failureCB,"Globalization","dateToString",[{"date":dateValue,"options":options}])},stringToDate:function(dateString,successCB,failureCB,options){argscheck.checkArgs("sfFO","Globalization.stringToDate",arguments);exec(successCB,failureCB,"Globalization","stringToDate",[{"dateString":dateString,"options":options}])},getDatePattern:function(successCB,failureCB,options){argscheck.checkArgs("fFO","Globalization.getDatePattern",arguments);exec(successCB,failureCB,"Globalization","getDatePattern",[{"options":options}])},getDateNames:function(successCB,failureCB,options){argscheck.checkArgs("fFO","Globalization.getDateNames",arguments);exec(successCB,failureCB,"Globalization","getDateNames",[{"options":options}])},isDayLightSavingsTime:function(date,successCB,failureCB){argscheck.checkArgs("dfF","Globalization.isDayLightSavingsTime",arguments);var dateValue=date.valueOf();exec(successCB,failureCB,"Globalization","isDayLightSavingsTime",[{"date":dateValue}])},getFirstDayOfWeek:function(successCB,failureCB){argscheck.checkArgs("fF","Globalization.getFirstDayOfWeek",arguments);exec(successCB,failureCB,"Globalization","getFirstDayOfWeek",[])},numberToString:function(number,successCB,failureCB,options){argscheck.checkArgs("nfFO","Globalization.numberToString",arguments);exec(successCB,failureCB,"Globalization","numberToString",[{"number":number,"options":options}])},stringToNumber:function(numberString,successCB,failureCB,options){argscheck.checkArgs("sfFO","Globalization.stringToNumber",arguments);exec(successCB,failureCB,"Globalization","stringToNumber",[{"numberString":numberString,"options":options}])},getNumberPattern:function(successCB,failureCB,options){argscheck.checkArgs("fFO","Globalization.getNumberPattern",arguments);exec(successCB,failureCB,"Globalization","getNumberPattern",[{"options":options}])},getCurrencyPattern:function(currencyCode,successCB,failureCB){argscheck.checkArgs("sfF","Globalization.getCurrencyPattern",arguments);exec(successCB,failureCB,"Globalization","getCurrencyPattern",[{"currencyCode":currencyCode}])}};module.exports=globalization});define("cordova/plugin/globalization/symbols",function(require,exports,module){var modulemapper=require("cordova/modulemapper");modulemapper.clobbers("cordova/plugin/globalization","navigator.globalization");modulemapper.clobbers("cordova/plugin/GlobalizationError","GlobalizationError")});define("cordova/plugin/inappbrowser/symbols",function(require,exports,module){var modulemapper=require("cordova/modulemapper");modulemapper.clobbers("cordova/plugin/InAppBrowser","open")});define("cordova/plugin/ios/Contact",function(require,exports,module){var exec=require("cordova/exec"),ContactError=require("cordova/plugin/ContactError");module.exports={display:function(errorCB,options){if(this.id===null){if(typeof errorCB==="function"){var errorObj=new ContactError(ContactError.UNKNOWN_ERROR);errorCB(errorObj)}}else{exec(null,errorCB,"Contacts","displayContact",[this.id,options])}}}});define("cordova/plugin/ios/Entry",function(require,exports,module){module.exports={toURL:function(){return"file://localhost"+this.fullPath},toURI:function(){console.log("DEPRECATED: Update your code to use 'toURL'");return"file://localhost"+this.fullPath}}});
define("cordova/plugin/ios/console",function(require,exports,module){var exec=require("cordova/exec");function stringify(message){try{if(typeof message==="object"&&JSON&&JSON.stringify){try{return JSON.stringify(message)}catch(e){return"error JSON.stringify()ing argument: "+e}}else{return(typeof message==="undefined")?"undefined":message.toString()}}catch(e){return e.toString()}}function wrappedMethod(console,method){var origMethod=console[method];return function(){var args=[].slice.call(arguments),len=args.length,i=0,res=[];for(;i<len;i++){res.push(stringify(args[i]))}exec(null,null,"Debug Console","log",[res.join(" "),{logLevel:method.toUpperCase()}]);if(!origMethod){return}origMethod.apply(console,arguments)}}var console=window.console||{};console.setLevel=function(){};console.logLevel=0;var methods=["log","debug","info","warn","error"];for(var i=0;i<methods.length;i++){var method=methods[i];console[method]=wrappedMethod(console,method)}module.exports=console});define("cordova/plugin/ios/console/symbols",function(require,exports,module){var modulemapper=require("cordova/modulemapper");modulemapper.clobbers("cordova/plugin/ios/console","console")});define("cordova/plugin/ios/contacts",function(require,exports,module){var exec=require("cordova/exec");module.exports={newContactUI:function(successCallback){exec(successCallback,null,"Contacts","newContact",[])},chooseContact:function(successCallback,options){var win=function(result){var fullContact=require("cordova/plugin/contacts").create(result);successCallback(fullContact.id,fullContact)};exec(win,null,"Contacts","chooseContact",[options])}}});define("cordova/plugin/ios/contacts/symbols",function(require,exports,module){require("cordova/plugin/contacts/symbols");var modulemapper=require("cordova/modulemapper");modulemapper.merges("cordova/plugin/ios/contacts","navigator.contacts");modulemapper.merges("cordova/plugin/ios/Contact","Contact")});define("cordova/plugin/ios/geolocation/symbols",function(require,exports,module){var modulemapper=require("cordova/modulemapper");modulemapper.merges("cordova/plugin/geolocation","navigator.geolocation")});define("cordova/plugin/ios/logger/plugininit",function(require,exports,module){var logger=require("cordova/plugin/logger");logger.useConsole(false)});define("cordova/plugin/ios/notification",function(require,exports,module){var Media=require("cordova/plugin/Media");module.exports={beep:function(count){(new Media("beep.wav")).play()}}});define("cordova/plugin/logger",function(require,exports,module){var logger=exports;var exec=require("cordova/exec");var utils=require("cordova/utils");var UseConsole=true;var Queued=[];var DeviceReady=false;var CurrentLevel;var Levels=["LOG","ERROR","WARN","INFO","DEBUG"];var LevelsMap={};for(var i=0;i<Levels.length;i++){var level=Levels[i];LevelsMap[level]=i;logger[level]=level}CurrentLevel=LevelsMap.WARN;logger.level=function(value){if(arguments.length){if(LevelsMap[value]===null){throw new Error("invalid logging level: "+value)}CurrentLevel=LevelsMap[value]}return Levels[CurrentLevel]};logger.useConsole=function(value){if(arguments.length){UseConsole=!!value}if(UseConsole){if(typeof console=="undefined"){throw new Error("global console object is not defined")}if(typeof console.log!="function"){throw new Error("global console object does not have a log function")}if(typeof console.useLogger=="function"){if(console.useLogger()){throw new Error("console and logger are too intertwingly")}}}return UseConsole};logger.log=function(message){logWithArgs("LOG",arguments)};logger.error=function(message){logWithArgs("ERROR",arguments)};logger.warn=function(message){logWithArgs("WARN",arguments)};logger.info=function(message){logWithArgs("INFO",arguments)};logger.debug=function(message){logWithArgs("DEBUG",arguments)};function logWithArgs(level,args){args=[level].concat([].slice.call(args));logger.logLevel.apply(logger,args)}logger.logLevel=function(level,message){var formatArgs=[].slice.call(arguments,2);message=utils.vformat(message,formatArgs);if(LevelsMap[level]===null){throw new Error("invalid logging level: "+level)}if(LevelsMap[level]>CurrentLevel){return}if(!DeviceReady&&!UseConsole){Queued.push([level,message]);return}if(!UseConsole){exec(null,null,"Logger","logLevel",[level,message]);return}if(console.__usingCordovaLogger){throw new Error("console and logger are too intertwingly")}switch(level){case logger.LOG:console.log(message);break;case logger.ERROR:console.log("ERROR: "+message);break;case logger.WARN:console.log("WARN: "+message);break;case logger.INFO:console.log("INFO: "+message);break;case logger.DEBUG:console.log("DEBUG: "+message);break}};logger.__onDeviceReady=function(){if(DeviceReady){return}DeviceReady=true;for(var i=0;i<Queued.length;i++){var messageArgs=Queued[i];logger.logLevel(messageArgs[0],messageArgs[1])}Queued=null};document.addEventListener("deviceready",logger.__onDeviceReady,false)});define("cordova/plugin/logger/symbols",function(require,exports,module){var modulemapper=require("cordova/modulemapper");
modulemapper.clobbers("cordova/plugin/logger","cordova.logger")});define("cordova/plugin/media/symbols",function(require,exports,module){var modulemapper=require("cordova/modulemapper");modulemapper.defaults("cordova/plugin/Media","Media");modulemapper.clobbers("cordova/plugin/MediaError","MediaError")});define("cordova/plugin/network",function(require,exports,module){var exec=require("cordova/exec"),cordova=require("cordova"),channel=require("cordova/channel"),utils=require("cordova/utils");if(typeof navigator!="undefined"){utils.defineGetter(navigator,"onLine",function(){return this.connection.type!="none"})}function NetworkConnection(){this.type="unknown"}NetworkConnection.prototype.getInfo=function(successCallback,errorCallback){exec(successCallback,errorCallback,"NetworkStatus","getConnectionInfo",[])};var me=new NetworkConnection();var timerId=null;var timeout=500;channel.onCordovaReady.subscribe(function(){me.getInfo(function(info){me.type=info;if(info==="none"){timerId=setTimeout(function(){cordova.fireDocumentEvent("offline");timerId=null},timeout)}else{if(timerId!==null){clearTimeout(timerId);timerId=null}cordova.fireDocumentEvent("online")}if(channel.onCordovaConnectionReady.state!==2){channel.onCordovaConnectionReady.fire()}},function(e){if(channel.onCordovaConnectionReady.state!==2){channel.onCordovaConnectionReady.fire()}console.log("Error initializing Network Connection: "+e)})});module.exports=me});define("cordova/plugin/networkstatus/symbols",function(require,exports,module){var modulemapper=require("cordova/modulemapper");modulemapper.clobbers("cordova/plugin/network","navigator.network.connection","navigator.network.connection is deprecated. Use navigator.connection instead.");modulemapper.clobbers("cordova/plugin/network","navigator.connection");modulemapper.defaults("cordova/plugin/Connection","Connection")});define("cordova/plugin/notification",function(require,exports,module){var exec=require("cordova/exec");var platform=require("cordova/platform");module.exports={alert:function(message,completeCallback,title,buttonLabel){var _title=(title||"Alert");var _buttonLabel=(buttonLabel||"OK");exec(completeCallback,null,"Notification","alert",[message,_title,_buttonLabel])},confirm:function(message,resultCallback,title,buttonLabels){var _title=(title||"Confirm");var _buttonLabels=(buttonLabels||["OK","Cancel"]);if(typeof _buttonLabels==="string"){console.log("Notification.confirm(string, function, string, string) is deprecated.  Use Notification.confirm(string, function, string, array).")}if(platform.id=="android"||platform.id=="ios"){if(typeof _buttonLabels==="string"){var buttonLabelString=_buttonLabels;_buttonLabels=buttonLabelString.split(",")}}else{if(Array.isArray(_buttonLabels)){var buttonLabelArray=_buttonLabels;_buttonLabels=buttonLabelArray.toString()}}exec(resultCallback,null,"Notification","confirm",[message,_title,_buttonLabels])},prompt:function(message,resultCallback,title,buttonLabels){var _message=(message||"Prompt message");var _title=(title||"Prompt");var _buttonLabels=(buttonLabels||["OK","Cancel"]);exec(resultCallback,null,"Notification","prompt",[_message,_title,_buttonLabels])},vibrate:function(mills){exec(null,null,"Notification","vibrate",[mills])},beep:function(count){exec(null,null,"Notification","beep",[count])}}});define("cordova/plugin/notification/symbols",function(require,exports,module){var modulemapper=require("cordova/modulemapper");modulemapper.clobbers("cordova/plugin/notification","navigator.notification");modulemapper.merges("cordova/plugin/ios/notification","navigator.notification")});define("cordova/plugin/requestFileSystem",function(require,exports,module){var argscheck=require("cordova/argscheck"),FileError=require("cordova/plugin/FileError"),FileSystem=require("cordova/plugin/FileSystem"),exec=require("cordova/exec");var requestFileSystem=function(type,size,successCallback,errorCallback){argscheck.checkArgs("nnFF","requestFileSystem",arguments);var fail=function(code){errorCallback&&errorCallback(new FileError(code))};if(type<0||type>3){fail(FileError.SYNTAX_ERR)}else{var success=function(file_system){if(file_system){if(successCallback){var result=new FileSystem(file_system.name,file_system.root);successCallback(result)}}else{fail(FileError.NOT_FOUND_ERR)}};exec(success,fail,"File","requestFileSystem",[type,size])}};module.exports=requestFileSystem});define("cordova/plugin/resolveLocalFileSystemURI",function(require,exports,module){var argscheck=require("cordova/argscheck"),DirectoryEntry=require("cordova/plugin/DirectoryEntry"),FileEntry=require("cordova/plugin/FileEntry"),FileError=require("cordova/plugin/FileError"),exec=require("cordova/exec");module.exports=function(uri,successCallback,errorCallback){argscheck.checkArgs("sFF","resolveLocalFileSystemURI",arguments);var fail=function(error){errorCallback&&errorCallback(new FileError(error))};if(!uri||uri.split(":").length>2){setTimeout(function(){fail(FileError.ENCODING_ERR)},0);return}var success=function(entry){var result;
if(entry){if(successCallback){result=(entry.isDirectory)?new DirectoryEntry(entry.name,entry.fullPath):new FileEntry(entry.name,entry.fullPath);successCallback(result)}}else{fail(FileError.NOT_FOUND_ERR)}};exec(success,fail,"File","resolveLocalFileSystemURI",[uri])}});define("cordova/plugin/splashscreen",function(require,exports,module){var exec=require("cordova/exec");var splashscreen={show:function(){exec(null,null,"SplashScreen","show",[])},hide:function(){exec(null,null,"SplashScreen","hide",[])}};module.exports=splashscreen});define("cordova/plugin/splashscreen/symbols",function(require,exports,module){var modulemapper=require("cordova/modulemapper");modulemapper.clobbers("cordova/plugin/splashscreen","navigator.splashscreen")});define("cordova/symbols",function(require,exports,module){var modulemapper=require("cordova/modulemapper");modulemapper.merges("cordova","cordova");modulemapper.clobbers("cordova/exec","cordova.exec");modulemapper.clobbers("cordova/exec","Cordova.exec")});define("cordova/utils",function(require,exports,module){var utils=exports;utils.defineGetterSetter=function(obj,key,getFunc,opt_setFunc){if(Object.defineProperty){var desc={get:getFunc,configurable:true};if(opt_setFunc){desc.set=opt_setFunc}Object.defineProperty(obj,key,desc)}else{obj.__defineGetter__(key,getFunc);if(opt_setFunc){obj.__defineSetter__(key,opt_setFunc)}}};utils.defineGetter=utils.defineGetterSetter;utils.arrayIndexOf=function(a,item){if(a.indexOf){return a.indexOf(item)}var len=a.length;for(var i=0;i<len;++i){if(a[i]==item){return i}}return -1};utils.arrayRemove=function(a,item){var index=utils.arrayIndexOf(a,item);if(index!=-1){a.splice(index,1)}return index!=-1};utils.typeName=function(val){return Object.prototype.toString.call(val).slice(8,-1)};utils.isArray=function(a){return utils.typeName(a)=="Array"};utils.isDate=function(d){return utils.typeName(d)=="Date"};utils.clone=function(obj){if(!obj||typeof obj=="function"||utils.isDate(obj)||typeof obj!="object"){return obj}var retVal,i;if(utils.isArray(obj)){retVal=[];for(i=0;i<obj.length;++i){retVal.push(utils.clone(obj[i]))}return retVal}retVal={};for(i in obj){if(!(i in retVal)||retVal[i]!=obj[i]){retVal[i]=utils.clone(obj[i])}}return retVal};utils.close=function(context,func,params){if(typeof params=="undefined"){return function(){return func.apply(context,arguments)}}else{return function(){return func.apply(context,params)}}};utils.createUUID=function(){return UUIDcreatePart(4)+"-"+UUIDcreatePart(2)+"-"+UUIDcreatePart(2)+"-"+UUIDcreatePart(2)+"-"+UUIDcreatePart(6)};utils.extend=(function(){var F=function(){};return function(Child,Parent){F.prototype=Parent.prototype;Child.prototype=new F();Child.__super__=Parent.prototype;Child.prototype.constructor=Child}}());utils.alert=function(msg){if(window.alert){window.alert(msg)}else{if(console&&console.log){console.log(msg)}}};utils.format=function(formatString){var args=[].slice.call(arguments,1);return utils.vformat(formatString,args)};utils.vformat=function(formatString,args){if(formatString===null||formatString===undefined){return""}if(arguments.length==1){return formatString.toString()}if(typeof formatString!="string"){return formatString.toString()}var pattern=/(.*?)%(.)(.*)/;var rest=formatString;var result=[];while(args.length){var arg=args.shift();var match=pattern.exec(rest);if(!match){break}rest=match[3];result.push(match[1]);if(match[2]=="%"){result.push("%");args.unshift(arg);continue}result.push(formatted(arg,match[2]))}result.push(rest);return result.join("")};function UUIDcreatePart(length){var uuidpart="";for(var i=0;i<length;i++){var uuidchar=parseInt((Math.random()*256),10).toString(16);if(uuidchar.length==1){uuidchar="0"+uuidchar}uuidpart+=uuidchar}return uuidpart}function formatted(object,formatChar){try{switch(formatChar){case"j":case"o":return JSON.stringify(object);case"c":return""}}catch(e){return"error JSON.stringify()ing argument: "+e}if((object===null)||(object===undefined)){return Object.prototype.toString.call(object)}return object.toString()}});window.cordova=require("cordova");(function(context){function replaceNavigator(origNavigator){var CordovaNavigator=function(){};CordovaNavigator.prototype=origNavigator;var newNavigator=new CordovaNavigator();if(CordovaNavigator.bind){for(var key in origNavigator){if(typeof origNavigator[key]=="function"){newNavigator[key]=origNavigator[key].bind(origNavigator)}}}return newNavigator}if(context.navigator){context.navigator=replaceNavigator(context.navigator)}var channel=require("cordova/channel");if(window._nativeReady){channel.onNativeReady.fire()}channel.join(function(){var builder=require("cordova/builder"),platform=require("cordova/platform");builder.buildIntoButDoNotClobber(platform.defaults,context);builder.buildIntoAndClobber(platform.clobbers,context);builder.buildIntoAndMerge(platform.merges,context);platform.initialize();channel.onCordovaReady.fire();channel.join(function(){require("cordova").fireDocumentEvent("deviceready")},channel.deviceReadyChannelsArray)
},[channel.onDOMContentLoaded,channel.onNativeReady,channel.onPluginsReady])}(window));(function(context){var onScriptLoadingComplete;var scriptCounter=0;function scriptLoadedCallback(){scriptCounter--;if(scriptCounter===0){onScriptLoadingComplete&&onScriptLoadingComplete()}}function injectScript(path){scriptCounter++;var script=document.createElement("script");script.onload=scriptLoadedCallback;script.src=path;document.head.appendChild(script)}function finishPluginLoading(){context.cordova.require("cordova/channel").onPluginsReady.fire()}function handlePluginsObject(modules){var mapper=context.cordova.require("cordova/modulemapper");onScriptLoadingComplete=function(){for(var i=0;i<modules.length;i++){var module=modules[i];if(!module){continue}if(module.clobbers&&module.clobbers.length){for(var j=0;j<module.clobbers.length;j++){mapper.clobbers(module.id,module.clobbers[j])}}if(module.merges&&module.merges.length){for(var k=0;k<module.merges.length;k++){mapper.merges(module.id,module.merges[k])}}if(module.runs&&!(module.clobbers&&module.clobbers.length)&&!(module.merges&&module.merges.length)){context.cordova.require(module.id)}}finishPluginLoading()};for(var i=0;i<modules.length;i++){injectScript(modules[i].file)}}try{var xhr=new context.XMLHttpRequest();xhr.onreadystatechange=function(){if(this.readyState!=4){return}if(this.status==200){var obj=JSON.parse(this.responseText);if(obj&&obj instanceof Array&&obj.length>0){handlePluginsObject(obj)}else{finishPluginLoading()}}else{finishPluginLoading()}};xhr.open("GET","cordova_plugins.json",true);xhr.send()}catch(err){finishPluginLoading()}}(window))})();

}
}
