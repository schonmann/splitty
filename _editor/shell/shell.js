var Shell = (function(){
    var self = {}
    var _editor = null
    var _socket = null
    var stdioBuffer =  []
    var stderrBuffer =  []
    var stdioCallback = null
    self.setEditor = (editor) => _editor = editor
    
    self.setSocket = (socket) => _socket = socket
    
    self.ls = () => exec("ls")

    self.exec = (command,callback) => exec(command,callback)
    
    self.outputCallback = (data)=>{
        stdioBuffer.push(data)
        if (typeof(stdioCallback) == "function")
            stdioCallback(data)
        
    }
    
    self.bind = () => {
        socket.on("stdout", (data) => {
            var resp = Splitty.decrypt(data);
            self.outputCallback(resp.stdout);
        });
        socket.on("stderr", (data) => {
            var resp = Splitty.decrypt(data);
            self.outputCallback(resp.stderr);
        });
    }
    
    self.clear = () => stdioBuffer = []
    
    self.clearStdErr = () => stderrBuffer = []

    self.stdio = () => stdioBuffer.join("\n")

    self.setup = (editor,socket) => {
        self.setEditor(editor)
        self.setSocket(socket)
        self.bind()
    }
    
    self.find = (value,callback) => {
        socket.emit("find", Splitty.encrypt({text:value}));
        socket.on("find",(data)=>{
            var resp = Splitty.decrypt(data);
            callback(resp.founded);
        });
    }
    
    function exec(cmd,callback){ 
        stdioBuffer = []
        stdioCallback = callback
        socket.emit("command",  Splitty.encrypt({command:cmd})); 
    }
    
    return self
})();