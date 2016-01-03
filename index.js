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

var serve = serveStatic("./");

var server = http.createServer(function(req, res) {
  var done = finalhandler(req, res);
  serve(req, res, done);
});

server.listen(8000);






