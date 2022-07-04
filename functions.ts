import { Store } from "./database";
const _data = new Store("database");
_data.load();
const _about:string = `About Grass Message
Copyright (c) Grass Development Team
---------------------
Grass Message is a simple IM system. You can use it to chat with your friend in a room.
This packet provide the service of GMSG.`
const value = {
    "about":_about
};
function pass(_length:number):string{
    const arr:string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    let _temp:string = "";
    for (let i = 0; i < _length; i++) {
        let pos = Math.round(Math.random() * (arr.length - 1));
        _temp += arr[pos];
    }
    return _temp;
}
function auth(user:any, pass:any):boolean{
    let _auth:boolean = false;
    for(let i = 0; i < _data.getLength("Key","user"); i++){
        if(user && pass){
            if(user == _data.read("Key","user",i) && pass == _data.read("Key","pass",i)){
                _auth = true;
            }
        }
    }
    return _auth;
}
export { value, pass, auth };