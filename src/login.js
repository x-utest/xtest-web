const $ = require('./assets/libs/jquery.js'),
    { apiHost } = require('./config');


$(function ($) {
    var $form = $('.login-form').show();
    $form.parent().show()
    $('input', $form).keyup(function (e) { e.keyCode == 13 && doLogin() })
    $('.btn-login').click(doLogin);
    $('.btn-clear').click(function () {
        if (!confirm('确定要重新配置吗')) { return }
        return localStorage.apiHost = '', location.reload();
    });

    function doLogin() {
        var data = {};
        $('input', $form).each(function () { data[this.name] = this.value });
        if (!data.user || !data.password) { return alert('请完成输入') }
        $.ajax({
            url: `${apiHost}account/user-login/`,
            type: 'POST',
            contentType: 'multipart/form-data; charset=UTF-8',
            data: JSON.stringify(data),
            dataType: 'json',
            processData: false,
            success(res) {
                var token;
                if (res && res.code == 200 && (token = (res.data || {}).token)) {
                    document.cookie = 'token=' + token;
                    location.href = '/#'
                } else {
                    alert('登录失败，请检查输入')
                }
            }
        }).error(function () {
            alert('登录服务异常')
        });
    }
})
