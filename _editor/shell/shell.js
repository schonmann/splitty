var Shell = (function(){
    var self = {}
    var _editor = null
    var _socket = null
    var stdioBuffer =  []
    var stderrBuffer =  []
    
    self.setEditor = (editor) => _editor = editor
    
    self.setSocket = (socket) => _socket = socket
    
    self.ls = () => exec("ls")

    self.bind = () => {
        socket.on("stdout",(data)=>stdioBuffer.push(data))
        socket.on("stderr",(data)=>stderrBuffer.push(data))
    }
    
    self.clear = () => stdioBuffer = []
    
    self.clearStdErr = () => stderrBuffer = []

    self.stdio = () => stdioBuffer.join("\r\n")

    self.setup = (editor,socket) => {
        self.setEditor(editor)
        self.setSocket(socket)
        self.bind()
    }
    
    function exec(cmd){ socket.emit("command", {command:cmd}) }
    
    return self
})();