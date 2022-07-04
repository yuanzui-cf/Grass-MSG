const _room = document.getElementsByName("room")[0];
const _pass = document.getElementsByName("pass")[0];
const _submit = document.querySelector("[submit]");
const _showHideButton = document.querySelector("[showorhide]");
let passShow = false;
_showHideButton.addEventListener("click",() => {
    if(passShow == false){
        passShow = true;
        _showHideButton.innerText = "隐";
        _pass.setAttribute("type", "text");
    }
    else{
        passShow = false;
        _showHideButton.innerText = "显";
        _pass.setAttribute("type", "password");
    }
});
function createPass(){
    const httpRequest = new XMLHttpRequest();
    httpRequest.open('POST', `/api/v1/createpass`, true);
    httpRequest.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    httpRequest.send(`length=15`);
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            if(httpRequest.responseText){
                _pass.value = httpRequest.responseText;
            }
        }
    };
}
createPass();
_submit.addEventListener("click",() => {
    if(!_room.value){
        _room.setAttribute("style","border:1px solid rgb(213 56 56)");
    }
    if( _room.value){
        const httpRequest = new XMLHttpRequest();
        httpRequest.open('POST', `/api/v1/createroom`, true);
        httpRequest.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        httpRequest.send(`room=${_room.value}&roompass=${_pass.value}`);
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                if(httpRequest.responseText == "success"){
                    window.open(`index.html`, "_self");
                }
                else{
                    alert("创建失败");
                }
            }
        };
    }
});
_room.addEventListener("keyup",() => {
    _room.setAttribute("style","");
});