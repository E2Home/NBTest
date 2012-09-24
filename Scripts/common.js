function getiev() {
    var userAgent = window.navigator.userAgent.toLowerCase();
    $.browser.msie8 = $.browser.msie && /msie 8\.0/i.test(userAgent);
    $.browser.msie7 = $.browser.msie && /msie 7\.0/i.test(userAgent);
    $.browser.msie6 = !$.browser.msie8 && !$.browser.msie7 && $.browser.msie && /msie 6\.0/i.test(userAgent);
    var v;
    if ($.browser.msie8) {
        v = 8;
    }
    else if ($.browser.msie7) {
        v = 7;
    }
    else if ($.browser.msie6) {
        v = 6;
    }
    else { v = -1; }
    return v;
}
$(document).ready(function () {
    var v = getiev()
    if (v > 0) {
        $(document.body).addClass("ie ie" + v);
    }
});

//获取网站更目录
function Application_GetRoot() {

    var pathArr = window.location.pathname.split("/");

    if (pathArr.length == 1) {
        return "/";
    } else if (pathArr.length == 2) {
        return pathArr[0];
    } else {

        if (pathArr[0] == "") {  //模式对话框

            if (pathArr[2].indexOf("(") > -1 && pathArr[2].indexOf(")") > -1)
                return "/" + pathArr[1] + "/" + pathArr[2];
            else
                return "/" + pathArr[1];

        } else {

            if (pathArr[2].indexOf("(") > -1 && pathArr[2].indexOf(")") > -1)
                return "/" + pathArr[0] + "/" + pathArr[1];
            else
                return "/" + pathArr[0];

        }
    }
}
/*********************动态载入JS Satrt************************/
function ansyloadJS(url, onload) {
    var domscript = document.createElement('script');
    domscript.src = url;
    if (!!onload) {
        domscript.afterLoad = onload;
        domscript.onreadystatechange = function () {
            if (domscript.readyState == "loaded" || domscript.readyState == "complete" || domscript.readyState == "interactive") {
                domscript.afterLoad();
            }
        }
        domscript.onload = function () {
            if (!!domscript.afterLoad)
                domscript.afterLoad();
        }
    }
    document.getElementsByTagName('head')[0].appendChild(domscript);
}

/*********************动态载入JS End************************/
var popUpWin;
function PopUpCenterWindow(URLStr, width, height, newWin, scrollbars) {
    var popUpWin = 0;
    if (typeof (newWin) == "undefined") {
        newWin = false;
    }
    if (typeof (scrollbars) == "undefined") {
        scrollbars = 0;
    }
    if (typeof (width) == "undefined") {
        width = 800;
    }
    if (typeof (height) == "undefined") {
        height = 600;
    }
    var left = 0;
    var top = 0;
    if (screen.width >= width) {
        left = Math.floor((screen.width - width) / 2);
    }
    if (screen.height >= height) {
        top = Math.floor((screen.height - height) / 2);
    }
    if (newWin) {
        open(URLStr, '', 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=' + scrollbars + ',resizable=yes,copyhistory=yes,width=' + width + ',height=' + height + ',left=' + left + ', top=' + top + ',screenX=' + left + ',screenY=' + top + '');
        return;
    }

    if (popUpWin) {
        if (!popUpWin.closed) popUpWin.close();
    }
    popUpWin = open(URLStr, 'popUpWin', 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=' + scrollbars + ',resizable=yes,copyhistory=yes,width=' + width + ',height=' + height + ',left=' + left + ', top=' + top + ',screenX=' + left + ',screenY=' + top + '');
    popUpWin.focus();
}
function CloseModalDialog(callback, dooptioncallback, userstate) {
    if (top != null && top.$ != null && top.$.closeIfrm != undefined) {
        top.$.closeIfrm(callback, dooptioncallback, userstate);
    }
    else if ($ != null && $.closeIfrm != undefined) {
        $.closeIfrm(callback, dooptioncallback, userstate);
    }
    else {
        window.close();
    }
}
function OpenModalDialog(url, option) {
    var fun;
    try {
        if (top != null && top.$ != null && top.$.ShowIfrmDailog != undefined) {
            fun = top.$.ShowIfrmDailog
        }
        else if ($ != null && $.ShowIfrmDailog != undefined) {
            fun = $.ShowIfrmDailog;
        }
        else {
            alert("请引用Dialog脚本，建议如果是框架结构，则只在Top层框架里引用！");
        }
    }
    catch (e) {
        fun = $.ShowIfrmDailog;
    }
    if (fun != undefined)
        fun(url, option);
}
function StrFormat(temp, dataarry) {
    return temp.replace(/\{([\d]+)\}/g, function (s1, s2) { var s = dataarry[s2]; if (typeof (s) != "undefined") { if (s instanceof (Date)) { return s.getTimezoneOffset() } else { return encodeURIComponent(s) } } else { return "" } });
}
function StrFormatNoEncode(temp, dataarry) {
    return temp.replace(/\{([\d]+)\}/g, function (s1, s2) { var s = dataarry[s2]; if (typeof (s) != "undefined") { if (s instanceof (Date)) { return s.getTimezoneOffset() } else { return (s); } } else { return ""; } });
}

function showLoadingMsg(msg, position, isautohide, timeout) {
    var loadpanel = $("#loadpanel");
    if (loadpanel.length == 0) {
        loadpanel = $("<div id=\"loadpanel\" class=\"loadingpanel\"/>").appendTo("body");
    }
    loadpanel.html("<span>" + msg + "</span>");
    if (!position) {
        position = { right: 20, top: 3 };
    }
    loadpanel.css(position).show();
    if (isautohide) {
        showLoadTipTimerId = setTimeout(hideLoadingMsg, timeout);
    }
}
function hideLoadingMsg() {
    var loadpanel = $("#loadpanel");
    if (loadpanel.length > 0) {
        loadpanel.hide();
    }
}
var showErrorTipTimerId;
var showLoadTipTimerId;
var msg;
function showErrorTip(msg, position, isautohide, timeout) {
    var errorpanel = $("#errorpanel");
    if (errorpanel.length == 0) {
        errorpanel = $("<div id=\"errorpanel\" class=\"errorpanel\"/>").appendTo("body");
    }
    if (errorpanel.css("display") != "none") {
        errorpanel.find(">dt").append("<dl>" + msg + "</dl>");
        if (showErrorTipTimerId) {
            window.clearTimeout(showErrorTipTimerId);
        }
    }
    else {
        errorpanel.html("<dt><dl>" + msg + "</dl></dt>");
        if (!position) {
            position = { right: 20, top: 3 };
        }
        errorpanel.css(position).fadeIn();
    }
    if (isautohide) {
        showErrorTipTimerId = setTimeout(hideErrortip, timeout);
    }

}
function hideErrortip() {
    var errorpanel = $("#errorpanel");
    if (errorpanel.length > 0) {
        errorpanel.fadeOut();
    }
}
function removeParent() {
    $(this).parent().hide();
    return false;
}
function showValidateError(error, element) {
    var pos = element.offset();
    var height = element.height();
    if (pos.left + 155 >= document.documentElement.clientWidth) {
        pos.left = document.documentElement.clientWidth - 156;
    }
    var newpos = { left: pos.left + 20, top: pos.top + height + 2 }
    error.appendTo("form.required-validate").css(newpos);
}


/**      
* 对Date的扩展，将 Date 转化为指定格式的String      
* 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符      
* 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)      
* eg:      
* (new Date()).pattern("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423      
* (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04      
* (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04      
* (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04      
* (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18      
*/
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份         
        "d+": this.getDate(), //日         
        "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时         
        "H+": this.getHours(), //小时         
        "m+": this.getMinutes(), //分         
        "s+": this.getSeconds(), //秒         
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度         
        "S": this.getMilliseconds() //毫秒         
    };
    var week = {
        "0": "/u65e5",
        "1": "/u4e00",
        "2": "/u4e8c",
        "3": "/u4e09",
        "4": "/u56db",
        "5": "/u4e94",
        "6": "/u516d"
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

function FormatDate(value, fmt) {
    if ($.isDate(value)) {
        return new Date(Date.parse(value.replace(/-/g, '/'))).Format(fmt);
    }
    return value;
}

/**      
* 获取页面可见区域的宽度和高度 
*/
function getTotalWidth() {
    return document.documentElement.clientWidth;
}

function getTotalHeight() {
    return document.documentElement.clientHeight;
}

/**      
* 创建数据共享接口——简化框架之间相互传值
* http://www.planeart.cn/?p=1554
*/
var share = {

    /**
    * 跨框架数据共享接口
    * @param    {String}    存储的数据名
    * @param    {Any}        将要存储的任意数据(无此项则返回被查询的数据)
    */
    data: function (name, value) {
        var top = window.top,
             cache = top['_CACHE'] || {};
        top['_CACHE'] = cache;

        return value !== undefined ? cache[name] = value : cache[name];
    },

    /**
    * 数据共享删除接口
    * @param    {String}    删除的数据名
    */
    removeData: function (name) {
        var cache = window.top['_CACHE'];
        if (cache && cache[name]) delete cache[name];
    }

};

$.extend({
    // 判断是否为空对象
    isEmpty: function (obj) {
        if (typeof (obj) == "undefined" || obj == null || obj == "") {
            return true;
        }
        else {
            return false;
        }
    },
    // 判断字符串是否为日期
    isDate: function (str) {
        if (typeof str == 'string') {
            var d = new Date(str.replace(/-/g, "/"));
            return !isNaN(d);
        }
        else {
            return false;
        }
    }
});

/**      
* 参考DWZ的AjaxTodo方法
* http://j-ui.com/
*/
function ajaxTodo(url, data, callback, title) {
    // 定义ajax方法，内部调用
    function _ajaxTodo(url, data, callback) {
        var $callback = callback;
        if (!$.isFunction(callback)) {
            $callback = function (data) {
                if (data.IsSuccess) {
                    if (callback) {
                        eval('(' + callback + '(\"' + data.Data + '\"))');
                    }
                    else {
                        showLoadingMsg("操作成功", { left: 10, top: 10 }, true, 3000);
                    }
                }
                else {
                    showErrorTip(data.Msg, { left: 10, top: 10 }, true, 5000);
                }
            }
        }

        // 异步请求的相关参数
        var opts = {
            type: 'POST',
            url: url,
            data: data || {},
            dataType: "json",
            cache: false,
            success: $callback
        };

        // 判断是否为 JSON 格式的字符串，JSON 格式 主要用于提交子表数据或者列表数据。
        if (typeof (data) == "string" && data.match("^\{(.+:.+,*){1,}\}$")) {
            opts.contentType = 'application/json; charset=utf-8';
        }

        // 发起异步请求
        $.ajax(opts);
    }

    if (title && title != "") {
        if (confirm(title)) {
            _ajaxTodo(url, data, callback);
        }
    } else {
        _ajaxTodo(url, data, callback);
    }
}