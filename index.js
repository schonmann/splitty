#! /usr/bin/env node


//var userArgs = process.argv.slice(2);
var http         = require('http')
var finalhandler = require('finalhandler')
var serveStatic  = require('serve-static')
var request      = require('request')
var serve        = serveStatic("./")
var editor       = serveStatic(__dirname)
var fs           = require("fs")
var sys          = require('sys')
const spawn      = require('child_process').spawn
require('shelljs/global');
var child;

const config = {
    host_path:__dirname
}



var server = http.createServer((req, res) => {
  var done = finalhandler(req, res)
  if(isWebEditor(req)){      
    editor(req,res,done)
  }else{
    serve(req, res, done)
  }
})
var io = require('socket.io')(server)

function isWebEditor(request){        
    return request.url.indexOf("_editor") > 0;
}

function getFileSeparator(){
    var isWin = /^win/.test(process.platform);
    if(isWin) return "\r\n"
    return "\n"
}

io.on('connection', (socket) => {
    socket.on('fileSave',
                    (data) => fs.writeFile(process.cwd() 
                            + data.filePath,data.lines.join(getFileSeparator())))
    
    socket.on('openFile', (filePath) => {
        fs.readFile(process.cwd()+filePath, "utf-8", (err, data) => {
          if (err)  socket.emit("stderr",err)
          else {
              var fd = {}
              fd.data = data
              fd.fileName = filePath
              var spotSlash = filePath.split("/")
              var spotSplit = filePath.split(".")
              fd.extension = spotSplit[spotSplit.length - 1]
              fd.name = spotSlash[spotSlash.length - 1]
              socket.emit("openFile",fd)
          }
        })
    })

    socket.on("find",(data) => {
        var out = find('./').filter((file) => file.match(data.text))
        socket.emit("find",out.slice(0,10))
    })
    socket.on('command',(data) =>{
        var child = exec(data.command, {async:true, silent:true});
        child.stdout.on('data', (data) => {
            var buff = new Buffer(data);            
            socket.emit("stdout",buff.toString("utf-8"))
        });
    })
    
    
    socket.on('config',()=>socket.emit("config",config))

})
server.listen(8000)



