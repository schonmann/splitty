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

var server = http.createServer(function(req, res) {
  var done = finalhandler(req, res);
  if(isWebEditor(req)){
    handleWebEditor(req,res);  
  }else{
    serve(req, res, done);    
  }    
});


function isWebEditor(request){
    return request.url.indexOf("editor") > 0;
};

function handleWebEditor(req,res){
    request('http://www.google.com', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(body);
        
      }
    })
};

server.listen(8000);






