var FileUtils = (function(){
    
    var self = {}
    var _editor = null
    var _socket = null
    var openedFiles = []
    var currentFile = 0
    
    self.setEditor = (editor) => _editor = editor
    
    self.setSocket = (socket) => _socket = socket
    
    self.bind = () => {
        bindChangeAce()        
        _socket.on("openFile", (fd)=>{
            openedFiles.push(fd)
            currentFile = openedFiles.length - 1
            self.openInEditor(fd)
            
        })
    }
    
    var bindChangeAce = () =>_editor.env.document.on("change",save)
    
    function save(e){
        _socket.emit('fileSave', {filePath: openedFiles[currentFile].fileName, lines: editor.getSession().doc.$lines})
    }
    
    var unbindingChangeAce = () => _editor.session.removeListener('change',save);
    
    var protectedChangeAce = (callback) => {
        unbindingChangeAce()
        if(typeof(callback) === "function"){
            callback()
        }
        bindChangeAce()
    }
    
    self.openInEditor = (fd) => {
        protectedChangeAce(()=> {
            _editor.setValue(fd.data)
            _editor.gotoLine(1)    
        })
    }
    
    self.openByIndex = (index) => {    
        currentFile = index - 1
        if(openedFiles.length >= currentFile)
            self.openInEditor(openedFiles[currentFile])
    }
    
    self.open = (filename) => {
        _socket.emit("openFile",filename)
    }
    
    self.setup = (editor,socket) =>{
        self.setEditor(editor)
        self.setSocket(socket)
        self.bind()
    }
    
    return self
})()