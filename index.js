#! /usr/bin/env node

verifyNodeVersion();
var userArgs     = process.argv.slice(2);
var http         = require('http');
var finalhandler = require('finalhandler');
var serveStatic  = require('serve-static');
var request      = require('request');
var serve        = serveStatic("./");
var editor       = serveStatic(__dirname);
var fs           = require("fs");
var sys          = require('sys');
const spawn      = require('child_process').spawn;
const cache      = require('./app/cache/cache');
var open         = require('open');
require('shelljs/global');

var CryptoJS = require("crypto-js");
var aes_key = guid();

var child;
////////////////////////////////////////////////////////////////////////////////////
//                          Config Splitty Params
////////////////////////////////////////////////////////////////////////////////////
var config = null;
try{
    config = JSON.parse(fs.readFileSync(".splitty.json", "utf-8"));
}catch(e){
    config = {};
}
config["host_path"] = pwd();
config["platform"] = process.platform;
config["workspace"] = process.cwd();
if(!isDef(config["port"])) config["port"] = "8000";
if(!isDef(config["bindAddress"])) config["bindAddress"] = "localhost";
if(!isDef(config["key"])) config["key"] = aes_key;
else aes_key = config["key"];

if(!config["files"]) config["files"] = {};

userArgs.forEach((param)=>{
 if(param.indexOf("=") > 0){    
     var map = param.split("=");
     if(map[0] === "key"){
         aes_key = map[1];
         map[1] = aes_key;
     }
     config[map[0]] = map[1];
 }else{
     if(!config["files"]["toOpen"]) config["files"]["toOpen"] = [];
     config["files"]["toOpen"].push(param);
 }
});

////////////////////////////////////////////////////////////////////////////////////
var server = http.createServer((req, res) => {
  var done = finalhandler(req, res);
  if(isWebEditor(req)){      
    editor(req,res,done);
  }else if(isHelp(req)){
    editor(req, res, done);
  }else if(isTerminal(req)){
    editor(req,res,done);
  }else{
    serve(req, res, done);
  }
});
var io = require('socket.io')(server);

io.on('connection', (socket) => {
    
    socket.on('deleteConfigSections',(crypto_cnf) => {
        var configs = decrypt(crypto_cnf);
        configs.forEach((cnf)=>{
            delete config[cnf]
        });
    });
    
    socket.on('fileSave',(crypt_data) => {
        var data = decrypt(crypt_data);
        var path = config.workspace + data.filePath;
        if(data.filePath.startsWith(config.workspace)){
            path = data.filePath;
        }
        fs.writeFile(path,data.lines.join(getFileSeparator()));
    });
    
    socket.on('openFile', (crypt_filePath) => {
        var data = decrypt(crypt_filePath);
        var path = config.workspace + data.filename;
        var filePath = data.filename; 
        if(filePath.startsWith(config.workspace)){
            path = filePath;
        }        
        fs.readFile(path, "utf-8", (err, data) => {
          if (err)  socket.emit("stderr",encrypt({"stderr":err}));
          else {
              var fd = {};
              fd.data = data;
              fd.fileName = filePath;
              var spotSlash = filePath.split("/");
              var spotSplit = filePath.split(".");
              fd.extension = spotSplit[spotSplit.length - 1];
              fd.name = spotSlash[spotSlash.length - 1];
              socket.emit("openFile",encrypt(fd));
          }
        });
    });

    socket.on("find",(crypt_data) => {     
        var data = decrypt(crypt_data);
        var parts = data.text.split("/");
        var out = [];
        var params = "./";
        var searchTerm = "*";
        var dirs = ["./"];
        var path = parts[0];
        if(parts.length > 1){
            params = parts;
            params = params.filter((e) => e != "");
            searchTerm = params[params.length - 1];
            params = params.slice(0,params.length-1);
            path ="./" + params.join("/");
        }
        if(cache.hasKey(path)){
          dirs = cache.get(path);
        }
        else {
            dirs = ls(path);
        }
        if(dirs.length > 0){
            if(!cache.hasKey(path))cache.put(path,dirs);
            dirs = find(path).filter((file) => file.match(data.text));
        }
        else {
            dirs = find("./").filter((file) => file.match(data.text));
        }
        socket.emit("find",encrypt({"founded":dirs.slice(0,50)}));
    });
    
    socket.on('command',(crypt_data) =>{
        var data = decrypt(crypt_data);
        if(typeof(data.command) === "undefined") return;
        var child = exec(data.command, {async:true, silent:true});
        child.stdout.on('data', (data) => {
            var buff = new Buffer(data);            
            socket.emit("stdout",encrypt({stdout:buff.toString("utf-8")}));
        });
        child.stderr.on('data', (data) => {
            var buff = new Buffer(data);
            socket.emit("stderr",encrypt({stderr:buff.toString("utf-8")}));
        });
    });
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

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

function isOSX(){
    return config.platform === "darwin";
}
function isWindows(){
    return config.platform.startsWith("win");
}
function isLinux(){
    return config.platform === "linux";
}
function verifyNodeVersion(){
    var version = process.version;
    version     = version.replace("v","");
    var parts   = version.split(".");
    var majorVersion  = parseInt(parts[0]);
    var middleVersion = parseInt(parts[1]);
    var minorVersion  = parseInt(parts[2]);
    if(majorVersion < 4){
        console.log("Your current node version is not supported!");
        console.log("node version: " + process.version);
        console.log("Please, update you node to 4+ version");
        process.exit();
    }
};
function isDef(obj){
    return typeof(obj) !== "undefined";
}
function listen(port) {
  console.log("PID: " + process.pid);
  server.on("error",(err)=>{
      config.port = port+1;
      userArgs.push("port="+(config.port));
      var instance = spawn("splitty",userArgs);
      instance.stdout.on('data', (data) => {
        console.log(data.toString("utf-8"));
      });
  });
  server.listen(port, config["bindAddress"],()=>{
    console.log(config);
    console.log("       ");
    console.log("To open splitty editor browse to");
    var splitty_url = "http://localhost:"+config.port+"/_editor?key="+config.key+"&proportion=0";
    console.log(splitty_url);
    open(splitty_url);
  });
};
function isWebEditor(request){        
    return request.url.indexOf("_editor") > 0;
}
function isHelp(request){        
    return request.url.indexOf("_help") > 0;
}
function isTerminal(request){
   return request.url.indexOf("_terminal") > 0;
}

function getFileSeparator(){
    var isWin = /^win/.test(process.platform);
    if(isWin) return "\r\n";
    return "\n";
}
listen(parseInt(config["port"]));


