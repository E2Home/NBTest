; (function($) {
    if ($.ShowIfrmDailog) {
        return;
    }
    else {
        // 配置信息的hash存储
        var Hash= {};
    }
    $.escapeHTML = function(string) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(string));
        return div.innerHTML;
    };
    $.documentCenter = function(el) {
        el = $(el);
        el.css({
            position: 'absolute',
            left: Math.max((document.documentElement.clientWidth - el.width()) / 2 + document.documentElement.scrollLeft, 0) + 'px',
            top: Math.max((document.documentElement.clientHeight - el.height()) / 2 + document.documentElement.scrollTop, 0) + 'px'
        });
    };
    $.getMargins = function(e, toInteger) {
        var el = jQuery(e);
        var t = el.css('marginTop') || '';
        var r = el.css('marginRight') || '';
        var b = el.css('marginBottom') || '';
        var l = el.css('marginLeft') || '';
        if (toInteger)
            return {
                t: parseInt(t) || 0,
                r: parseInt(r) || 0,
                b: parseInt(b) || 0,
                l: parseInt(l)
            };
        else
            return { t: t, r: r, b: b, l: l };
    };
    $.closeIfrm = function(callback, d, userstate) {
        if ($.browser.msie6) {
            $(document.body).removeClass("hiddenselect");
        }
        var count = $("div.bbit-window").length;
        var hash = Hash[count];

        callback && callback();
        if (d && hash.options.onclose) {
            hash.options.onclose(userstate);
            hash.options.onclose = null;
        }

        hash.overlayer.remove();
        $("#dailog_iframe_" + hash.options.newid).remove();
        hash.box.remove();
        if ($.browser.msie) {
            CollectGarbage();
        }

        // 清空hash存储对象
        hash = null;
        Hash[count] = null;
    };
    function Tp(temp, dataarry) {
        return temp.replace(/\$\{([\w]+)\}/g, function(s1, s2) { var s = dataarry[s2]; if (typeof (s) != "undefined") { return s; } else { return s1; } });
    }
    $.ShowIfrmDailog = function(url, options) {
        // 合并默认参数
        options = $.extend({
            width: 600,         // 宽度
            height: 400,        // 高度
            caption: '',        // 标题
            enabledrag: true,   // 是否可拖拽
            type: 1,            // 类型：1表示有边框有标题，2表示没有边框和标题
            onclose: null       // 关闭窗口的回调函数
        }, options);
        var newid = (new Date()).valueOf();
        options.newid = newid;
        options.caption = $.escapeHTML(options.caption);

        var count = $("div.bbit-window").length + 1;
        options.zIndex = 2000 * count + 3000;

        var wp = 14;
        if (options.type == 1) {
            var box = $("<div id='dailog_" + newid + "' class='bbit-window bbit-window-plain'></div>");
            var headtemplete = "<div id='dailog_head_${newid}' class='bbit-window-tl'><div class='bbit-window-tr'><div class='bbit-window-tc'><div style='mozuserselect: none; khtmluserselect: none' class='bbit-window-header' unselectable='on'><div class='bbit-tool bbit-tool-close'>&nbsp;</div><span class='bbit-window-header-text'>${caption}</span></div></div></div></div>";
            var bodytemplete = "<div class='bbit-window-bwrap'><div class='bbit-window-ml'><div class='bbit-window-mr'><div class='bbit-window-mc'><div id='dailog_body_${newid}' style='width: ${width}px; height: ${height}px' class='bbit-window-body'>${iframehtml}</div></div></div></div><div class='bbit-window-bl'><div class='bbit-window-br'><div class='bbit-window-bc'><div class='bbit-window-footer'></div></div></div></div></div>";
        }
        else {
            var wp = 0;
            var box = $("<div id='dailog_" + newid + "' class='bbit-window bbit-window-dailog'></div>");
            var headtemplete = "<div id='dailog_head_${newid}' class='bbit-dailog-tl'></div>";
            var bodytemplete = "<div class='bbit-window-bwrap'><div id='dailog_body_${newid}' style='width: ${width}px; height: ${height}px' class='bbit-window-body'>${iframehtml}</div></div>";
        }
        var iframetemplete = '<iframe id="dailog_iframe_${newid}" border="0" frameBorder="0" src="${url}" style="border:none;width:${width}px;height:${height}px"></iframe>';
        options.url = url + (url.indexOf('?') > -1 ? '&' : '?') + '_=' + (new Date()).valueOf();
        var html = [];
        options.iframehtml = Tp(iframetemplete, options);
        html.push(Tp(headtemplete, options));
        html.push(Tp(bodytemplete, options));
        box.css({ zIndex: options.zIndex, width: options.width + wp }).html(html.join(""));
        box.find("div.bbit-tool-close")
            .hover(function(e) { $(this).addClass("hover") }, function(e) { $(this).removeClass("hover") })
            .click(function(e) { $.closeIfrm(); });
        var margins = $.getMargins(document.body, true);
        var overlayer = $('<div></div>').css({
            position: 'absolute',
            left: 0,
            top: 0,
            width: Math.max(document.documentElement.clientWidth, document.body.scrollWidth),
            height: Math.max(document.documentElement.clientHeight, document.body.scrollHeight + margins.t + margins.b),
            zIndex: options.zIndex-1,
            background: '#fff',
            opacity: '0.5'
        }).bind('contextmenu', function() { return false; }).appendTo(document.body);
        var isdrag = false;
        if (options.enabledrag) {
            if ($.fn.easydrag) {
                box.addClass("bbit-window-draggable").easydrag(false)
                //.setHandler("dailog_head_" + newid)
                .ondrag(function(e) {
                    if (isdrag == false) {
                        isdrag = true;
                        $("#dailog_body_" + newid).css("visibility", "hidden");
                    }
                }).ondrop(function(e) {
                    isdrag = false;
                    $("#dailog_body_" + newid).css("visibility", "visible");
                });
            }
        }
        box.appendTo(document.body);
        $.documentCenter(box);
        if ($.browser.msie6) {
            $(document.body).addClass("hiddenselect");
            document.getElementById("dailog_iframe_" + newid).src = options.url;
        }
        else if ($.browser.msie7) {
            document.getElementById("dailog_iframe_" + newid).src = options.url;
        }
        // 存储对象
        Hash[count] = {
            options: options,
            box: box,
            overlayer: overlayer
        };
    }
})(jQuery);

/*
 * jqDnR - Minimalistic Drag'n'Resize for jQuery.
 *
 * Copyright (c) 2007 Brice Burgess <bhb@iceburg.net>, http://www.iceburg.net
 * Licensed under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * $Version: 2007.08.19 +r2
 */
(function($){
$.fn.jqDrag=function(h){return i(this,h,'d');};
$.fn.jqResize=function(h){return i(this,h,'r');};
$.jqDnR={dnr:{},e:0,
drag:function(v){
 if(M.k == 'd')E.css({left:M.X+v.pageX-M.pX,top:M.Y+v.pageY-M.pY});
 else E.css({width:Math.max(v.pageX-M.pX+M.W,0),height:Math.max(v.pageY-M.pY+M.H,0)});
  return false;},
stop:function(){E.css('opacity',M.o);$().unbind('mousemove',J.drag).unbind('mouseup',J.stop);}
};
var J=$.jqDnR,M=J.dnr,E=J.e,
i=function(e,h,k){return e.each(function(){h=(h)?$(h,e):e;
 h.bind('mousedown',{e:e,k:k},function(v){var d=v.data,p={};E=d.e;
 // attempt utilization of dimensions plugin to fix IE issues
 if(E.css('position') != 'relative'){try{E.position(p);}catch(e){}}
 M={X:p.left||f('left')||0,Y:p.top||f('top')||0,W:f('width')||E[0].scrollWidth||0,H:f('height')||E[0].scrollHeight||0,pX:v.pageX,pY:v.pageY,k:d.k,o:E.css('opacity')};
 E.css({opacity:0.8});$().mousemove($.jqDnR.drag).mouseup($.jqDnR.stop);
 return false;
 });
});},
f=function(k){return parseInt(E.css(k))||false;};
})(jQuery);