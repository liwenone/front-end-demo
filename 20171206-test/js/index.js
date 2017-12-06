//解决第三方软键盘唤起时底部input输入框被遮挡问题
var bfscrolltop = document.body.scrollTop; //获取软键盘唤起前浏览器滚动部分的高度
$("input.inputframe").focus(function() { //在这里‘input.inputframe’是我的底部输入栏的输入框，当它获取焦点时触发事件
    interval = setInterval(function() { //设置一个计时器，时间设置与软键盘弹出所需时间相近
        document.body.scrollTop = document.body.scrollHeight; //获取焦点后将浏览器内所有内容高度赋给浏览器滚动部分高度
    }, 100)
}).blur(function() { //设定输入框失去焦点时的事件
    clearInterval(interval); //清除计时器
    document.body.scrollTop = bfscrolltop; //将软键盘唤起前的浏览器滚动部分高度重新赋给改变后的高度
});