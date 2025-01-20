// 获取音频元素
var bgm = document.getElementById("bgm");

// 获取按钮和弹窗元素
var btn = document.getElementById("btn-showimg");
var popup = document.getElementById("popup");
var closeBtn = document.getElementById("close");
var popupMessage = document.getElementById("popup-message");
bgm.volume = 0.2;  // 音量范围 0.0 到 1.0
// 页面加载完成后显示弹窗，并显示欢迎信息
window.onload = function() {
    // 显示弹窗并设置显示的文本
    popup.style.display = "flex"; // 使用 flex 来显示弹窗，并居中
    popupMessage.innerHTML = "<p>欢迎来到无损平方</p>"; // 设置弹窗的文本内容
    // 设置定时器在 3 秒后关闭弹窗
    setTimeout(function() {
        popup.style.display = "none"; // 隐藏弹窗
    }, 3000); // 3秒后关闭弹窗
}

// 当点击按钮时显示图片弹窗
btn.onclick = function() {
    // 显示弹窗并修改内容为图片
    popup.style.display = "flex";
    popupMessage.innerHTML = '<img src="images/bm.jpg" alt="报名图片" class="popup-image">'; // 改为显示图片
}

// 当点击关闭按钮时关闭弹窗，并播放音频
closeBtn.onclick = function() {
    popup.style.display = "none"; // 隐藏弹窗
    bgm.play(); // 播放背景音乐
}

// 当点击弹窗外部区域时关闭弹窗，并播放音频
window.onclick = function(event) {
    if (event.target == popup) {
        popup.style.display = "none"; // 隐藏弹窗
        bgm.play(); // 播放背景音乐
    }
}
