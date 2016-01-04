var FileUtils = (function(){
    var self = {};
    self.open = function(fileName){};
    self.ls = function(){
        exec("ls");
    };
    self.exec = function(command){
        exec(command);
    };
    function exec(cmd){
        socket.emit("command", {command:cmd});
    };
    return self;
})();