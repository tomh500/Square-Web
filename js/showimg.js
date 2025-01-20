// 获取按钮和弹窗元素
var btn = document.getElementById("btn-showimg");
var popup = document.getElementById("popup");
var closeBtn = document.getElementById("close");

// 当点击按钮时显示弹窗
btn.onclick = function() {
    popup.style.display = "block"; // 显示弹窗
}

// 当点击关闭按钮时关闭弹窗
closeBtn.onclick = function() {
    popup.style.display = "none"; // 隐藏弹窗
}

// 当点击弹窗以外区域时关闭弹窗
window.onclick = function(event) {
    if (event.target == popup) {
        popup.style.display = "none"; // 隐藏弹窗
    }
}
