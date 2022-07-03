#!/usr/bin/env node
import { value } from "./value";
import { Store } from "./database";
import exp from "constants";
const express = require('express');
const readline = require('readline');
const fs = require('fs');
const _data = new Store("database");
const _msg = new Store("msg");
const input = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
let port:number = 9000;
_msg.load();
console.log("Grass MSG [v 1.0.3]\nCopyright (c) Grass Development Team");
fs.access(`./database.data`, fs.constants.F_OK, (err:string|null) => {
    if (err) {
        const arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        let _pass = "";
        for (let i = 0; i < 12; i++) {
            let pos = Math.round(Math.random() * (arr.length - 1));
            _pass += arr[pos];
        }
        _data.write("admin", "Key", "user");
        _data.write(_pass, "Key", "pass");
        _data.write("admin", "Key", "group");
        _data.write("Default Room", "Room", "name");
        _data.write("", "Room", "pass");
        _data.write("all", "Room", "per");
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
            if(_public){
                server.use(express.static("public"));
            }
            server.get("/api/v1/message", (req:any, res:any) => {
                let _return:string = "";
                res.send("QwQ");
            })
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