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
    
    self.bind = () => {
        socket.on("stdout",(data)=>{
            stdioBuffer.push(data)
            if (typeof(stdioCallback) == "function")
                stdioCallback(data)
            
        })
        socket.on("stderr",(data)=>stderrBuffer.push(data))
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
        socket.emit("find", {text:value})
        socket.on("find",callback)
    }
    
    function exec(cmd,callback){ 
        stdioCallback = callback
        socket.emit("command", {command:cmd}) 
    }
    
    return self
})();