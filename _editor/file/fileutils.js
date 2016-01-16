var FileUtils = (function(){
    
    var self = {}
    var _editor = null
    var _socket = null
    var openedFiles = []
    var currentFile = 0
    
    const EVENTS = {FILE_OPEN:"FILE OPEN",FILE_CLOSE:"FILE CLOSE", FILE_SAVE:"FILE SAVE"}
    Events.register(EVENTS.FILE_OPEN)
    Events.register(EVENTS.FILE_CLOSE)
    Events.register(EVENTS.FILE_SAVE)
    
    
    self.events = EVENTS
    
    self.setEditor = (editor) => _editor = editor
    
    self.setSocket = (socket) => _socket = socket
    
    self.bind = () => {
        bindChangeAce()        
        _socket.on("openFile", (fd)=>{
            openedFiles.push(fd)
            fd.current = true
            currentFile = openedFiles.length - 1
            self.openInEditor(fd)
            Events.fire(EVENTS.FILE_OPEN,fd)
        })
    }
    
    var bindChangeAce = () =>_editor.env.document.on("change",save)
    
    function save(e){
        if(openedFiles[currentFile] && openedFiles[currentFile].fileName){
            Events.fire(EVENTS.FILE_SAVE,editor.getSession().doc.$lines.join("\r\n"))            
            _socket.emit('fileSave', {filePath: openedFiles[currentFile].fileName, lines: editor.getSession().doc.$lines})    
        }
        
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
        if(!fd) return
        openedFiles.first((e)=> e.current === true ).current = false
        protectedChangeAce(()=> {
            fd.current = true;
            _editor.setValue(fd.data)
            _editor.gotoLine(1)    
        })
        Events.fire(EVENTS.FILE_OPEN,fd)
    }
    
    self.openByIndex = (index) => {  
        if(openedFiles.empty() || openedFiles.length < index)return
        currentFile = index - 1
        if(openedFiles.length >= currentFile)
            self.openInEditor(openedFiles[currentFile])
    }
    
    self.closeByIndex = (index) => {
        var toClose = openedFiles[index-1]
        var isCurrent = toClose.current 
        openedFiles.removeAt(index-1)
        currentFile = 0
        if(isCurrent && openedFiles.length > 0){
            openedFiles[0].current = true;
            
            self.openInEditor(openedFiles[0])            
        }else if(openedFiles.empty()){
            protectedChangeAce(() => _editor.setValue(""))
            
        }
        Events.fire(EVENTS.FILE_CLOSE,toClose)
        
    }
    
    self.open = (filename) => {
        _socket.emit("openFile",filename)
    }
    
    self.getOpenedFiles = () => openedFiles
    
    self.setup = (editor,socket) =>{
        self.setEditor(editor)
        self.setSocket(socket)
        self.bind()
         
        
    }

    Events.when(EVENTS.FILE_SAVE,(file) => openedFiles[currentFile].data = file)
    
    return self
})()