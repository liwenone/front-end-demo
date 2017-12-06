//解决第三方软键盘唤起时底部input输入框被遮挡问题
var is = false;
var bfscrolltop = document.body.scrollTop; //获取软键盘唤起前浏览器滚动部分的高度
$("input.inputframe").focus(function() { //在这里‘input.inputframe’是我的底部输入栏的输入框，当它获取焦点时触发事件
    resize();
    is = true;
}).blur(function() { //设定输入框失去焦点时的事件
    resize();
    is = false;
});

function resize() {
    setTimeout(function() {
        var height = $(window).height() - $(window).scrollTop();
        $('.content').height(height);
        $("html, body").animate({ scrollTop: 0 }, 0);
    }, 2000);
}

$(window).on('scroll', function(e) {
    if (is) {
        e.stopPropagation();
        e.preventDefault();
    }
})

resize();