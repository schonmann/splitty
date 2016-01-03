#! /usr/bin/env node

/*Objetivo e criar um simple utilitario de linha de comando para expor paginas html, js e css atraves de um simples web server
    A ideia e passar um arquivo (default index.html) para o nodeit e o nodeit criar um servidor para expor
    Alem disso, seria interessante criar um diretorio de Downloads que facilite  troca de arquivos entre servidores
    A cereja do bolo seria criar um modulo que permitisse ate a edicao de arquivo dentro do browser e tambem com o live preview dentro
    da mesma pagina, seria bem doido
*/
var http = require('http');
var userArgs = process.argv.slice(2);
var finalhandler = require('finalhandler');
var serveStatic = require('serve-static');
var request = require('request');
var serve = serveStatic("./");
var fs = require("fs");
var server = http.createServer(function(req, res) {
  var done = finalhandler(req, res);
  if(isWebEditor(req)){
    handleWebEditor(req,res);  
  }else{
    serve(req, res, done);    
  }    
});
var io = require('socket.io')(server);

function isWebEditor(request){
    return request.url.indexOf("_editor") > 0;
};

function handleWebEditor(req,res){
    request('https://raw.githubusercontent.com/shortty/nodeit/master/editor/index.html', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(body);
        
      }
    })
};

io.on('connection', function (socket) {
    socket.on('fileSave', function (data) {
        fs.writeFile(__dirname + data.filePath, data.lines.join('\r\n'));
        
    });
    
});


server.listen(8000);






