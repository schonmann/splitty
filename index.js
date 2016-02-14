#! /usr/bin/env node


var userArgs     = process.argv.slice(2);
var http         = require('http')
var finalhandler = require('finalhandler')
var serveStatic  = require('serve-static')
var request      = require('request')
var serve        = serveStatic("./")
var editor       = serveStatic(__dirname)
var fs           = require("fs")
var sys          = require('sys')
const spawn      = require('child_process').spawn
const cache      = require('./app/cache/cache')
require('shelljs/global');

var CryptoJS = require("crypto-js");
var aes_key = "624dfb626f66ac58f35422b191e02e79"; //default key

var child;
const config = {
    host_path:pwd(),
    port:"8000",
    platform:process.platform,
    workspace:process.cwd(),
    key:genKey(aes_key)
    
}
userArgs.forEach((param)=>{
 var map = param.split("=")
 if(map[0] === "key"){
     aes_key =genKey(map[1]);
     map[1] = aes_key;
 }
 config[map[0]] = map[1];
})

console.log("key: " + config.key);

var server = http.createServer((req, res) => {
  var done = finalhandler(req, res)
  if(isWebEditor(req)){      
    editor(req,res,done)
  }else if(isHelp(req)){
	editor(req, res, done)
  }else{
    serve(req, res, done)
  }
})
var io = require('socket.io')(server)

function isWebEditor(request){        
    return request.url.indexOf("_editor") > 0;
}

function isHelp(request){        
    return request.url.indexOf("_help") > 0;
}

function getFileSeparator(){
    var isWin = /^win/.test(process.platform);
    if(isWin) return "\r\n"
    return "\n"
}

io.on('connection', (socket) => {
    socket.on('fileSave',(crypt_data) => {
        var data = decrypt(crypt_data);
        var path = config.workspace + data.filePath;
        if(data.filePath.startsWith(config.workspace)){
            path = data.filePath;
        }
        fs.writeFile(path,data.lines.join(getFileSeparator()))
    });
    
    socket.on('openFile', (crypt_filePath) => {
        var data = decrypt(crypt_filePath);
        var path = config.workspace + data.filename;
        var filePath = data.filename; 
        if(filePath.startsWith(config.workspace)){
            path = filePath;
        }        
        console.log("Open File: " + path)
        fs.readFile(path, "utf-8", (err, data) => {
          if (err)  socket.emit("stderr",encrypt({"stderr":err}))
          else {
              var fd = {}
              fd.data = data
              fd.fileName = filePath
              var spotSlash = filePath.split("/")
              var spotSplit = filePath.split(".")
              fd.extension = spotSplit[spotSplit.length - 1]
              fd.name = spotSlash[spotSlash.length - 1]
              socket.emit("openFile",encrypt(fd))
          }
        })
    })

    socket.on("find",(crypt_data) => {
        console.log("find");
        console.log(crypt_data);
        var data = decrypt(crypt_data);
        var parts = data.text.split("/")
        var out = []
        var params = "./"
        var searchTerm = "*"
        var dirs = ["./"]
        var path = parts[0]
        if(parts.length > 1){
            params = parts
            params = params.filter((e) => e != "")
            searchTerm = params[params.length - 1]
            params = params.slice(0,params.length-1)
            path ="./" + params.join("/")
        }
        if(cache.hasKey(path)){
          dirs = cache.get(path)   
        }
        else {
            dirs = ls(path)
        }
        if(dirs.length > 0){
            if(!cache.hasKey(path))cache.put(path,dirs)
            dirs = find(path).filter((file) => file.match(data.text))
        }
        else {
            dirs = find("./").filter((file) => file.match(data.text))
        }
        socket.emit("find",encrypt({"founded":dirs.slice(0,50)}))
        
    })
    
    
    socket.on('command',(crypt_data) =>{
        console.log("comand");
        console.log(crypt_data);
        var data = decrypt(crypt_data);
        if(typeof(data.command) === "undefined") return;
        
        var child = exec(data.command, {async:true, silent:true});
        console.log("exec: "+ data.command)
        child.stdout.on('data', (data) => {
            var buff = new Buffer(data);            
            socket.emit("stdout",encrypt({stdout:buff.toString("utf-8")}));
        });
        child.stderr.on('data', (data) => {
            var buff = new Buffer(data);            
            socket.emit("stderr",encrypt({stderr:buff.toString("utf-8")}));
        });
    })
    
    
    socket.on('config',()=>socket.emit("config",encrypt(config)));

});


function encrypt(message){
    if(typeof(message) !== "string"){
        message = JSON.stringify(message);   
    }
    return CryptoJS.AES.encrypt(message, config.key).toString();
}
function decrypt(message){
    var bytes  = CryptoJS.AES.decrypt(message, config.key);
    var plaintext = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(plaintext);
}

function genKey(baseKey){
    return CryptoJS.MD5(CryptoJS.MD5(baseKey).toString()).toString()
}


server.listen(config["port"])



