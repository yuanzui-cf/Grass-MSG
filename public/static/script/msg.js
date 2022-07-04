const _config = JSON.parse(decodeURIComponent(document.URL.replace(/.*#/gi, '')));
window.open("#","_self");
let content = "";
const title = document.querySelector("[title]");
const msg = document.querySelector("[msg]");
const send = document.getElementsByTagName("button")[0];
const text = document.getElementsByTagName("input")[0];
title.innerText = _config["room"];
function sendMsg(type = 0){
    const httpRequest = new XMLHttpRequest();
    httpRequest.open('POST', `/api/v1/send`, true);
    httpRequest.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    if(type == 0)
        httpRequest.send(`room=${_config.room}&pass=${_config.pass}&user=系统提示&content=${encodeURIComponent(_config.user)}%20加入了房间`);
    else
        httpRequest.send(`room=${_config.room}&pass=${_config.pass}&user=系统提示&content=${encodeURIComponent(_config.user)}%20退出了房间`);
}
sendMsg();
const t = setInterval(() => {
    const httpRequest = new XMLHttpRequest();
    httpRequest.open('POST', `/api/v1/message`, true);
    httpRequest.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    httpRequest.send(`room=${_config.room}&pass=${_config.pass}&user=${_config.user}`);
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            if(content != httpRequest.responseText){
                content = httpRequest.responseText;
                msg.innerHTML = decodeURIComponent(content);
                msg.scrollTop = msg.scrollHeight;
            }
        }
    };
},50);
send.addEventListener("click", () => {
    if(text.value){
        const httpRequest = new XMLHttpRequest();
        httpRequest.open('POST', `/api/v1/send`, true);
        httpRequest.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        httpRequest.send(`room=${_config.room}&pass=${_config.pass}&user=${_config.user}&content=${encodeURIComponent(text.value)}`);
        text.value = "";
    }
});
text.addEventListener('keypress',function(e){
    let keyCode = null;
    if(e.which) keyCode = e.which;
    else if(e.keyCode) keyCode = e.keyCode;
    if(keyCode == 13) {
        if(text.value){
            const httpRequest = new XMLHttpRequest();
            httpRequest.open('POST', `/api/v1/send`, true);
            httpRequest.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            httpRequest.send(`room=${_config.room}&pass=${_config.pass}&user=${_config.user}&content=${encodeURIComponent(text.value)}`);
            text.value = "";
        }
    };
});
window.addEventListener("beforeunload", () => {
    sendMsg(1);
})