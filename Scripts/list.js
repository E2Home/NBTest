$(function () {
    // 第二种检索方式：高级查询
    $("#btnAdvQuery").click(function (e) {
        var p = $("#advQueryPanel").find("form").serializeArray();
        $("table.flexigrid").flexOptions({ newp: 1, extParam: p }).flexReload();
        return false;
    });

    // 点击关闭按钮则关闭层
    $("#btnAdvCancel").click(function (e) {
        $("#advQueryPanel").slideUp(200);
        return false;
    });

    // 点击层内的地方不关闭
    $("#advQueryPanel").click(function (e) { return false; });
    // 点击不是层的地方则关闭层
    $(document).click(function (e) { $("#advQueryPanel").hide(); });

    // 点击回车即可查询
    $(document).keypress(function (e) { // 3.在输入框中按Enter同点击查询按钮
        if (e.keyCode == 13 && $("#advQueryPanel").is(":visible")) {
            $("#btnAdvQuery").click();
            return false;
        }
    })
});
// end of ready

// Grid中工具栏按钮弹出Dialog窗口的通用方法
function AddNewTwo(name, btn, grid) {
    OpenFormDialog(btn.url, btn.title, btn.options);
    return false;
}

// 弹出表单编辑窗口
function OpenFormDialog(url, title, options) {

    // 默认参数
    var opts = {
        width: 610,
        height: 450,
        onclose: refreshGrid
    };

    // 设置弹出窗口的参数
    var option = $.extend(opts, options, { caption: title });

    // 处理url地址中的参数
    var newUrl = url;
    var tree = $("div.treeview");
    if (tree.length > 0 && tree.getTCT())
        newUrl = unescape(newUrl).replace("{TreeId}", tree.getTCT().id);
    else
        newUrl = unescape(newUrl).replace("{TreeId}", '');

    // 弹出指定地址的窗口
    OpenModalDialog(newUrl, option);
}

// 删除记录
function DeleteRecord(url, name) {
    if (confirm("你确定要删除（" + name + "）?")) {
        showLoadingMsg("正在删除...", { left: 300, top: 2 });

        // 处理url地址中的参数
        var newUrl = url;
        var tree = $("div.treeview");
        if (tree.length > 0 && tree.getTCT())
            newUrl = unescape(newUrl).replace("{TreeId}", tree.getTCT().id);
        else
            newUrl = unescape(newUrl).replace("{TreeId}", '');

        ajaxTodo(newUrl, {}, ajaxCallBack)
    }
}

// 批量删除记录
function DeleteBatchRecord(url, btn) {
    var ids = $("table.flexigrid").getCheckedRows(); //选中行的主键
    if (ids.length <= 0)
        alert("请您选择要删除的记录！");
    else if (confirm("你确定要删除选中的记录吗?")) {
        showLoadingMsg("正在删除...", { left: 300, top: 2 });

        // 处理url地址中的参数
        var newUrl = btn.url || url;
        var tree = $("div.treeview");
        if (tree.length > 0 && tree.getTCT())
            newUrl = unescape(newUrl).replace("{TreeId}", tree.getTCT().id);
        else
            newUrl = unescape(newUrl).replace("{TreeId}", '');

        ajaxTodo(newUrl, { ids: ids.join(",") }, ajaxCallBack)
    }
}

// 删除客户端记录，一般出现在主从表
function DeleteClientItem(id, gridId) {
    if (gridId) {
        $("#" + gridId).flexDeleteRowData(id);
    }
    else {
        $("table.flexigrid").flexDeleteRowData(id);
    }
}

// 刷新列表Grid
function refreshGrid() {
    // 操作成功提示
    showLoadingMsg("操作成功", { left: 300, top: 2 }, true, 3000);

    // 同步刷新列表
    $("table.flexigrid").flexReload();

    // 同步刷新树
    var tree = $("div.treeview");
    if (tree.attr("sync") == "True" && tree.length > 0 && tree.getTCT())
        tree.refresh(tree.getTCT().id);
}

// ajax请求的回调方法
function ajaxCallBack(data) {
    if (data) {
        if (data.IsSuccess) {
            refreshGrid();
        }
        else {
            hideLoadingMsg();
            showErrorTip(data.Msg, { left: 300, top: 2 }, true, 5000);
        }
    }
    else {
        alert("ajax请求出错了,没有返回数据");
    }
}

// 选择返回记录
function GridSelectedRow(id, type) {
    if (type == "Single") {   // 单选
        CloseModalDialog(null, true, $("table.flexigrid").flexGetRowData(id));
    }
    else {      // 多选
        var date = $("table.flexigrid").getSelectedRows();
        if (date.length == 0) {
            alert("请选择一条记录");
        }
        else {
            CloseModalDialog(null, true, date);
        }
    }
}

// 关闭弹出层
function CloseDialog() {
    CloseModalDialog(null, false);
}

/*
* 更改Json数组中的属性, 对属性Id有特殊的处理。一般Id是重置一个新的Guid。
* 参数：
*       jsonArray json对象的数组
*       oldPropName 旧属性名称
*       newPropName 新属性名称
*/
function MapJsonArray(jsonArray, oldPropName, newPropName) {
    var other = $.map(jsonArray, function (item) {
        item[newPropName] = item[oldPropName];
        if (oldPropName == "Id") {
            item[oldPropName] = newGuid();
        }
        else {
            delete item[oldPropName];
        }
        return item;
    });

    return other;
}

// 创建一个GUID
function newGuid() {
    var guid = "";
    for (var i = 1; i <= 32; i++) {
        var n = Math.floor(Math.random() * 16.0).toString(16);
        guid += n;
        if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
            guid += "-";
    }
    return guid;
}

/* 
*   只能输入数字的插件，好像有个Bug：不能输入 0.12 ，只能输入 .12
*   网址：http://www.cnblogs.com/zxl/archive/2009/08/18/1549202.html
*/
(function (jQuery) {
    $.fn.numeral = function () {
        $(this).css("ime-mode", "disabled");
        this.bind("keypress", function () {
            if (event.keyCode == 46) {
                if (this.value.indexOf(".") != -1) {
                    return false;
                }
            } else {
                return event.keyCode >= 46 && event.keyCode <= 57;
            }
        });
        this.bind("blur", function () {
            if (this.value.lastIndexOf(".") == (this.value.length - 1)) {
                this.value = this.value.substr(0, this.value.length - 1);
            } else if (isNaN(this.value)) {
                this.value = "";
            }
        });
        this.bind("paste", function () {
            var s = clipboardData.getData('text');
            if (!/\D/.test(s));
            value = s.replace(/^0*/, '');
            return false;
        });
        this.bind("dragenter", function () {
            return false;
        });
        this.bind("keyup", function () {
            if (/(^0+)/.test(this.value)) {
                this.value = this.value.replace(/^0*/, '');
            }
        });
    }
})(jQuery);
$(document).ready(function (e) {
    $("#advQueryPanel").find("input.textNumber").numeral();
});