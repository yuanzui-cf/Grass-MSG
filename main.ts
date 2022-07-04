#!/usr/bin/env node
import { value, pass, auth } from "./functions";
import { Store } from "./database";
const express = require('express');
const readline = require('readline');
const fs = require('fs');
const bodyParser = require('body-parser');
const _data = new Store("database");
const _msg = new Store("msg");
const input = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
let port:number = 9000;
_msg.load();
console.log("Grass MSG [v 1.1.0]\nCopyright (c) Grass Development Team");
fs.access(`./database.data`, fs.constants.F_OK, (err:string|null) => {
    if (err) {
        const _pass:string = pass(12);
        _data.write("admin", "Key", "user");
        _data.write(_pass, "Key", "pass");
        _data.write("Default Room", "Room", "name");
        _data.write("", "Room", "pass");
        _data.write("false", "Room", "auth");
        _msg.write("", "Msg", "content");
        console.log(`Default Key Info\n--------------------\nName: admin\nPass: ${_pass}`);
    }
    else{
        _data.load();
    }
    fs.access(`./config.json`, fs.constants.F_OK, (err:string|null) => {
        let _public:boolean = false;
        if(!err){
            const _config = JSON.parse(fs.readFileSync("./config.json", "UTF-8"));
            if(_config["port"] && typeof _config["port"] == "number" && _config["port"] > 0 && _config["port"] <= 65535){
                port = _config["port"];
            }

        }
        fs.access(`./public`, fs.constants.F_OK, (err:string|null) => {
            if(!err){
                _public = true;
            }
            const server = express();
            server.use(bodyParser.urlencoded({ extended: false }));
            if(_public){
                server.use(express.static("public"));
            }
            server.post("/api/v1/message", (req:any, res:any) => {
                let _user:string|null = req.body.user;
                let _return:string = "";
                let room:number = -1;
                if(req.body.room){
                    for(let i = 0; i < _data.getLength("Room","name"); i++){
                        let _pass = "";
                        if(req.body.pass){
                            _pass = req.body.pass;
                        }
                        if(req.body.room == _data.read("Room","name",i) && _pass == _data.read("Room","pass",i)){
                            room = i;
                        }
                    }
                    if(room != -1){
                        let _content:string = decodeURIComponent(_msg.read("Msg","content",room));
                        _content = _content
                            .replace(/\[img\]/gi, `<img src="`)
                            .replace(/\[\/img\]/gi, `">`)
                            .replace(/(\[h1\])|(&lt;h1&gt;)/gi, `<h1>`)
                            .replace(/(\[\/h1\])|(&lt;\/h1&gt;)/gi, `</h1>`);
                        if(_user && _user != "Server"){
                            _return += `<style>[${_user}] p:first-child{color:#295c39;font-weight:bold}</style>`
                        }
                        _return += `${_content}`;
                        if(_data.read("Room","auth",room) == "true"){
                            if(!auth(req.body.key, req.body.keypass)){
                                _return = "";
                            }
                        }
                    }
                }
                res.send(_return);
            })
            server.post("/api/v1/send",(req:any, res:any) => {
                let _username:string|null = req.body.user;
                let _content:string|null = req.body.content;
                let room:number = -1;
                let _return:string = "";
                let _date = new Date();
                if(req.body.room){
                    for(let i = 0; i < _data.getLength("Room","name"); i++){
                        let _pass = "";
                        if(req.body.pass){
                            _pass = req.body.pass;
                        }
                        if(req.body.room == _data.read("Room","name",i) && _pass == _data.read("Room","pass",i)){
                            room = i;
                        }
                    }
                    if(_username && _username != "Server" && _content && room != -1){
                        let _send:boolean = true;
                        _content = _content
                            .replace(/</g, `&lt;`)
                            .replace(/>/g, `&gt;`);
                        _content = _content;
                        if(_data.read("Room","auth",room) == "ture"){
                            if(!auth(req.body.key, req.body.keypass)){
                                _send = false;
                            }
                        }
                        if(_send){
                            _msg.write(`${_msg.read("Msg","content",room)}<div ${_username} msg><p>[${_username} ${_date.getHours()}:${_date.getMinutes()}:${_date.getSeconds()}]</p><p>${_content}</p></div>`,"Msg","content",room);
                            _return = "success";
                        }
                    }
                }
                res.send(_return);
            });
            server.post("/api/v1/createroom",(req:any, res:any) => {
                let _return:string = "404";
                let _pass:string = "";
                let _auth:string = req.body.auth;
                let _sameName:boolean = false;
                if(req.body.room){
                    for(let i = 0; i < _data.getLength("Room","name"); i++){
                        if(req.body.room == _data.read("Room","name",i)){
                            _sameName = true;
                        }
                    }
                    if(!_sameName){
                        if(req.body.roompass){
                            _pass = req.body.roompass;
                        }
                        _data.write(req.body.room,"Room","name",_data.getLength("Room","name"));
                        _data.write(_pass,"Room","pass",_data.getLength("Room","pass"));
                        _data.write("false","Room","auth",_data.getLength("Room","auth"));
                        _msg.write("","Msg","content",_data.getLength("Room","name") - 1);
                        if(_auth == "true"){
                            _data.write("true","Room","auth",_data.getLength("Room","auth") - 1);
                        }
                        _return = "success";
                    }
                }
                res.send(_return);
            });
            server.post("/api/v1/createpass",(req:any, res:any) => {
                let _length:number|null = req.body.length;
                if(!_length || _length <= 0 || _length > 255){
                    _length = 12;
                }
                res.send(pass(_length));
            });
            server.post("/api/v1/check",(req:any, res:any) => {
                let _return:string = "Failed";
                let room:number = -1;
                const _roomName:string|null = req.body.room;
                const _roomPass:string|null = req.body.pass;
                const _user:string|null = req.body.user;
                const _userPass:string|null = req.body.keypass;
                for(let i = 0; i < _data.getLength("Room","name"); i++){
                    let _pass = "";
                    if(_roomPass){
                        _pass = req.body.pass;
                    }
                    if(_roomName == _data.read("Room","name",i) && _pass == _data.read("Room","pass",i)){
                        room = i;
                    }
                }
                if(room != -1){
                    if(_data.read("Room","auth",room) == "true"){
                        if(auth(_user, _userPass)){
                            _return = "success";
                        }
                    }
                    else{
                        _return = "success";
                    }
                }
                res.send(_return);
            });
            server.post("/api/v1/exit",(req:any, res:any) => {
                if(auth(req.body.key, req.body.keypass)){
                    process.exit();
                }
            });
            server.listen(port);
            function commandRead():void{
                input.question("> ", (command:string) => {
                    switch (command) {
                        case 'exit':
                            process.exit();
                        case 'about':
                            console.log(value.about);
                            break;
                        case 'reload':
                            _msg.load();
                            _data.load();
                            break;
                        case 'send':
                            input.question("Room Name: ", (_roomName:string) => {
                                let room = -1;
                                let _date = new Date();
                                for(let i = 0; i < _data.getLength("Room","name"); i++){
                                    if(_roomName == _data.read("Room","name",i)){
                                        room = i;
                                    }
                                }
                                if(room != -1){
                                    function sendMsg():void{
                                        input.question("Message> ", (msg:string = "") => {
                                            switch(msg){
                                                case '.exit':
                                                    return commandRead();
                                                default:
                                                    _msg.write(`${_msg.read("Msg","content",room)}<div Server msg><p>[Server ${_date.getHours()}:${_date.getMinutes()}:${_date.getSeconds()}]</p><p>${encodeURIComponent(msg)}</p></div>`,"Msg","content",room);
                                            }
                                            return sendMsg();
                                        });
                                    }
                                    sendMsg();
                                }
                                else{
                                    return commandRead();
                                }
                            });
                            break;
                        case 'clear':
                            input.question("Room Name: ", (_roomName:string) => {
                                if(_roomName == ".all"){
                                    for(let i = 0; i < _msg.getLength("Msg", "content"); i++){
                                        _msg.write('', "Msg", "content", i)
                                    }
                                }
                                else{
                                    let room = -1;
                                    let _date = new Date();
                                    for(let i = 0; i < _data.getLength("Room","name"); i++){
                                        if(_roomName == _data.read("Room","name",i)){
                                            room = i;
                                        }
                                    }
                                    if(room != -1){
                                        _msg.write('',"Msg","content",room);
                                    }
                                }
                                return commandRead();
                            });
                            break;
                        default:
                            console.log('Invalid command, please enter correctly command.');
                    }
                    return commandRead();
                });
            }
            commandRead();
        })
    });
});