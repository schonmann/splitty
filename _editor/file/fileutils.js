var FileUtils = (function(){
    
    var self = {};
    var _editor = null;
    var _socket = null;
    var openedFiles = ['/readme.txt'];
    var currentFile = 0;
    
    self.setEditor = (editor) => _editor = editor;
    
    self.setSocket = (socket) => _socket = socket;
    
    self.bind = () => {
        _editor.env.document.on("change",function(e){        
            _socket.emit('fileSave', {filePath: openedFiles[currentFile], lines: editor.getSession().doc.$lines});        
        });
        _editor.commands.addCommand({
            name: "replace",
            bindKey: {win: "Ctrl-O", mac: "Command-O"},
            exec: Shell.ls
        });
    };
    
    self.open = (fileName) => {};
    
    self.setup = (editor,socket) =>{
        self.setEditor(editor);
        self.setSocket(socket);
        self.bind();
    };
    
    return self;
})();