#! /usr/bin/env node

/*Objetivo e criar um simple utilitario de linha de comando para expor paginas html, js e css atraves de um simples web server
    A ideia e passar um arquivo (default index.html) para o nodeit e o nodeit criar um servidor para expor
    Alem disso, seria interessante criar um diretorio de Downloads que facilite  troca de arquivos entre servidores
    A cereja do bolo seria criar um modulo que permitisse ate a edicao de arquivo dentro do browser e tambem com o live preview dentro
    da mesma pagina, seria bem doido
*/
//var userArgs = process.argv.slice(2);

var http         = require('http')
var finalhandler = require('finalhandler')
var serveStatic  = require('serve-static')
var request      = require('request')
var serve        = serveStatic("./")
var editor       = serveStatic(__dirname)
var fs           = require("fs")
var sys          = require('sys')
var exec         = require('child_process').exec
var child;

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

io.on('connection', (socket) => {
    socket.on('fileSave',  (data) => fs.writeFile(process.cwd() + data.filePath, data.lines.join('\r\n')))
    
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

    socket.on('command',(data) =>{
        console.log(data.command)
        child = exec(data.command, function (error, stdout, stderr) {
          socket.emit("stdout",stdout)
        })
    })

})
server.listen(8000)





