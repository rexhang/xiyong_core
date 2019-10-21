/**
 * native.js
 * @author rexhang (rexhang@outlook.com)
 * @date    2017-05-19 11:04:17
 * @version v1.0.0
 */
// 瀏覽器信息
var u         = navigator.userAgent;
var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;                               // Android
var isIos     = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);                                       // Ios
var isOpera   = u.indexOf("Opera") > -1;                                                          // Opera瀏覽器
var isFirefox = u.indexOf("Firefox") > -1;                                                        // Firefox瀏覽器
var isChrome  = u.indexOf("Chrome") > -1;                                                         // Chrome瀏覽器
var isSafari  = u.indexOf("Safari") > -1;                                                         // Safari瀏覽器
var isIe      = u.indexOf("compatible") > -1 && u.indexOf("MSIE") > -1 && !isOpera;               // Ie瀏覽器
var isWebKit  = u.indexOf("Chrome") > -1 && u.indexOf("Safari") > -1 && u.indexOf("WebKit") > -1; // WebKit瀏覽器
var isWeixin  = function (){
    var ua = window.navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i) == 'micromessenger'){
        return true;
    }else{
        return false;
    }
};

/*操作系統*/
var devOs = navigator.platform;

/*有關於客戶端屏幕的信息獲取*/
/*1、自上至下全部*/
var webAllWidth  = document.body.clientWidth;
var webAllHeight = document.body.clientHeight;
/*2、可見區域*/
var webWidth  = screen.width;
var webHeight = screen.height;
/*3、內寬高*/
var webInWidth = window.innerWidth;
var webInHeight = window.innerHeight;

/*location對象方法*/
var getUrl = function(key){
    return location[key]
}
var setUrl = function(key, value){
    location[key] = value;
}
var reload = function(){
    location.reload();
}

/*獲取URL參數信息*/
var getUrlParams = function(params){
    var reg = new RegExp("(^|&)"+ params +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}

/*DOM選擇器*/
var dom = function(params){
    return document.querySelector(params);
}
var doms = function(params){
    return document.querySelectorAll(params);
}

/*正則過濾服務*/
var validate = {
    badName: function(badname){ // 验证姓名不能包含特殊字符
        var badnameReg = /[\\\/<>&\"\'\`#\*\^\~\|,:;\?\(\)\[\]%\$]/;
        if(badnameReg.test(badname)){
            return true;
        }
        return false;
    },
    email: function(email){ // 验证邮箱格式
        var emailReg =  /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return emailReg.test(email);
    },
    space: function(space){ // 验证是否含空格
        var spaceReg = /\s+/;
        return spaceReg.test(space);
    },
    phone: function(phone){  //验证电话吗是否合格
        var phoneReg = /^1[3,5,7,8]\d{9}$/;
        return phoneReg.test(phone)
    }
}

/*時間戳過濾服務*/
var sysDate = new Date();
Date.prototype.format = function(format) {
    var date = {
        "M+"                  : this.getMonth() + 1,
        "d+"                  : this.getDate(),
        "h+"                  : this.getHours(),
        "m+"                  : this.getMinutes(),
        "s+"                  : this.getSeconds(),
        "q+"                  : Math.floor((this.getMonth() + 3) / 3),
        "S+"                  : this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
}

// 時間睡眠
function sleep(timer){
    var startTime = new Date().getTime();
    while (new Date().getTime() < startTime + timer*10);
}

// 自定義事件
var sysEvent = {
    on: function( eventName, callback ){
        if(!this[eventName]){
            this[eventName] = [];
        }
        this[eventName].push(callback);
    },
    emit: function( eventName ){
        var that = this;
        var params = arguments.length > 1 ? Array.prototype.slice.call(arguments,1) : [];
        if(that[eventName]){
            Array.prototype.forEach.call(that[eventName], function(arg){
                arg.apply(self, params);
            });
        }
    }
}

// 手機端禁止滑動
function sysStop(){
   event.preventDefault();
}
var mScroll = {
    disable: function(){
        document.body.addEventListener('touchmove', sysStop, false);
    },
    enable: function(){
        document.body.removeEventListener('touchmove', sysStop, false);
    }
}

/*GPS信息*/
var getGps = function (success) {
    // 定位配置信息
    var positionConfig = {
        /*指示浏览器获取高精度的位置，默认为false*/
        enableHighAccuracy: true,
        /*指定获取地理位置的超时时间，默认不限时，单位为毫秒*/
        timeout: 5000,
        /*最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置。*/
        maximumAge: 0
    }
    // 失败回调
    function error(err){
        switch(err.code) {
            case err.TIMEOUT:
                alert("发生超时！ 请再试一次！");
                break;
            case err.POSITION_UNAVAILABLE:
                alert('我们无法检测您的位置。 抱歉!');
                break;
            case err.PERMISSION_DENIED:
                alert('请允许地理位置访问此功能。');
                break;
            case err.UNKNOWN_ERROR:
                alert('出现未知错误！');
                break;
        }
    }
    navigator.geolocation.getCurrentPosition(success, error, positionConfig);
}


/*給window綁定功能對象*/
window.sys = {
    version               : 'v1.0.0',
    isAndroid             : isAndroid,
    isIos                 : isIos,
    isOpera               : isOpera,
    isFirefox             : isFirefox,
    isChrome              : isChrome,
    isSafari              : isSafari,
    isIe                  : isIe,
    isWebKit              : isWebKit,
    isWeixin              : isWeixin(),
    devOs                 : devOs,
    webWidth              : webWidth,
    webHeight             : webHeight,
    webAllWidth           : webAllWidth,
    webAllHeight          : webAllHeight,
    webInWidth            : webInWidth,
    webInHeight            : webInHeight,
    getUrl                : getUrl,
    setUrl                : setUrl,
    getUrlParams          : getUrlParams,
    dom                   : dom,
    doms                  : doms,
    validate              : validate,
    sysDate               : sysDate,
    reload                : reload,
    sleep                 : sleep,
    sysEvent              : sysEvent,
    mScroll               : mScroll,
    getGps                : getGps
}

window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
            };
})();
