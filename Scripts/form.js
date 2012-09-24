(function ($) {
    // jQuery validate
    $.extend($.validator.messages, {
        required: "必填字段",
        remote: "该字段必须唯一",
        email: "请输入正确格式的电子邮件",
        url: "请输入合法的网址",
        date: "请输入合法的日期",
        dateISO: "请输入合法的日期 (ISO).",
        number: "请输入合法的数字",
        digits: "只能输入整数",
        creditcard: "请输入合法的信用卡号",
        equalTo: "请再次输入相同的值",
        accept: "请输入拥有合法后缀名的字符串",
        maxlength: $.validator.format("长度最多是 {0} 的字符串"),
        minlength: $.validator.format("长度最少是 {0} 的字符串"),
        rangelength: $.validator.format("长度介于 {0} 和 {1} 之间的字符串"),
        range: $.validator.format("请输入一个介于 {0} 和 {1} 之间的值"),
        max: $.validator.format("请输入一个最大为 {0} 的值"),
        min: $.validator.format("请输入一个最小为 {0} 的值"),

        alphanumeric: "字母、数字、下划线",
        lettersonly: "必须是字母",
        phone: "数字、空格、括号",

        formatdate: "请输入合法的日期",
        compareDate: "结束时间必大于开始时间!"
    });

    $.validator.addMethod("formatdate", function (value, element) {
        return this.optional(element) || /^((((1[6-9]|[2-9]\d)\d{2})-(0?[13578]|1[02])-(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})-(0?[13456789]|1[012])-(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29-))$/.test(value);
    });

    $.validator.methods.compareDate = function (value, element, param) {
        var startDate = $(param).val();
        var date1 = new Date(Date.parse(startDate.replace("-", "/")));
        var date2 = new Date(Date.parse(value.replace("-", "/")));
        return date1 < date2;
    };

    $(function () {
        // validate form
        $("form.required-validate").each(function () {
            $(this).validate({
                submitHandler: function (form) {
                    return false;
                },
                errorElement: "div",
                errorClass: "cusErrorPanel",
                errorPlacement: showValidateError
            });
        });

        // 保存按钮事件
        $("#btnSave").click(function (e) {
            //alert("提交" + $("form.required-validate").length + "次");
            $("form.required-validate").submit();
            return false;
        });
        // 取消按钮事件
        $("#btnCancel").click(function (e) { CloseModalDialog(null, false); });
    });
})(jQuery);

/**
* 普通ajax表单提交
* @param {Object} form
* @param {Object} callback
*/
function validateCallback(form, callback) {
    var $form = $(form);
    if (!$form.valid()) {
        return false;
    }

    // 异步请求的相关参数
    var opts = {
        type: form.method || 'POST',
        url: $form.attr("action"),
        dataType: "json",
        cache: false,
        success: function (data) {
            if (data.IsSuccess) {
                CloseModalDialog(null, true);
            }
            else {
                showErrorTip(data.Msg, { left: 10, top: 10 }, true, 5000);
            }
        }
    };

    var formData = $form.serializeArray();

    // 是否为主从表
    var detail = $form.find("table.flexigrid");
    if (detail.length > 0) {
        var data = {};
        // 主表信息
        for (var i = 0; i < formData.length; i++) {
            data[formData[i].name] = formData[i].value;
        }
        // 从表信息
        data[detail.attr("id")] = detail.flexGetData();
        var json = JSON.stringify(data);
        $.extend(opts, { data: json, contentType: 'application/json; charset=utf-8' });
    }
    else {
        $.extend(opts, { data: formData });
    }

    $.ajax(opts);
    return false;
}

/**
* 自动聚焦表单的第一个输入框
* @param {Object} form
* @param {Object} callback
*/
$(function () {
    // 自动聚焦表单的第一个输入框
    try {
        $(':input:visible')[0].focus();
    }
    catch (_) {
    }

    /*
    * ASP.NET jQuery 食谱2 (表单中使用回车在TextBox之间向下移动)
    * http://www.cnblogs.com/iamlixin/archive/2012/01/08/2316682.html
    */
    // 表单中使用回车在TextBox之间向下移动
    $("input:text").bind("keydown", function (e) {
        if (e.which == 13) { // 获取Enter键值
            e.preventDefault(); // 阻止表单按Enter键默认行为，防止按回车键提交表单
            var nextIndex = $("input:text").index(this) + 1;
            var nextInput = $("input:text")[nextIndex];
            if (nextInput)
                nextInput.focus();
        }
    });

    /**      
    * 文本框调用后台的方法
    */
    $("input[ajaxTodo]").bind("blur", function () {
        var $this = $(this);
        var text = $this.val();
        if (!$.isEmpty(text)) {
            // 异步请求
            ajaxTodo($this.attr("ajaxTodo"), { name: text }, $this.attr("callback"));
        }
    });
});

