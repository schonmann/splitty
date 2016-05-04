var FileUtils = (function(){
    
    var self = {};
    var _editor = null;
    var _socket = null;
    var openedFiles = [];
    var currentFile = 0;
    
    const ACE_SESSION_MAP = {
        "js":"javascript",
        "hs":"haskell",
        "txt":"text"
    };
    
    const EVENTS = {FILE_OPEN:"FILE OPEN",FILE_CLOSE:"FILE CLOSE", FILE_SAVE:"FILE SAVE", FILE_DIRTY:"FILE DIRTY"};
    Events.register(EVENTS.FILE_OPEN);
    Events.register(EVENTS.FILE_CLOSE);
    Events.register(EVENTS.FILE_SAVE);
    Events.register(EVENTS.FILE_DIRTY);
    
    
    
    self.events = EVENTS;
    
    self.setEditor = (editor) => _editor = editor;
    
    self.setSocket = (socket) => _socket = socket;
    
    self.bind = () => {
        _socket.on("openFile", (crypt_fd)=>{         
            var fd = Splitty.decrypt(crypt_fd);
            openedFiles.push(fd);
            fd.current = true;
            fd.dirty = false;
            fd.session = ace.createEditSession(fd.data,getMode(fd.extension));
            fd.session.on('change',needToSave);
            currentFile = openedFiles.length - 1;
            self.openInEditor(fd);
        });
    };
    self.getStoreOpenedFiles = () => {
        var opened = Splitty.prop("localFilesOpended");
        if(!opened){
            return [];
        }else{
            return JSON.parse(opened); 
        }
    };
    
    self.saveLocalOpenedFiles = (files) => {
        Splitty.prop("localFilesOpended",JSON.stringify(files));
    };
    function needToSave(e){
        var fd = openedFiles[self.currentFileIndex()];
        fd.dirty = true;
        Events.fire(EVENTS.FILE_DIRTY,fd);
    }
    
    function save(){
        if(openedFiles[currentFile] && openedFiles[currentFile].fileName){
            Events.fire(EVENTS.FILE_SAVE,editor.getSession().doc.$lines.join("\r\n"));
            _socket.emit('fileSave',Splitty.encrypt({filePath: openedFiles[currentFile].fileName, lines: editor.getSession().doc.$lines}));    
            openedFiles[currentFile].dirty = false;
            Events.fire(EVENTS.FILE_DIRTY,openedFiles[currentFile]);
        }
        
    }
    
    
    self.save = () => save();
    
    function getMode(ext){
        if(ACE_SESSION_MAP[ext])
            return "ace/mode/" + ACE_SESSION_MAP[ext];
        return "ace/mode/" + ext;
    }
    function clone(obj){
        return JSON.parse(JSON.stringify(obj));
    }
    self.openInEditor = (fd) => {
            if(!fd) return;
            for(var i=0; i < openedFiles.length;i++){
                if(openedFiles[i].current){
                    openedFiles[i].current = false;
                    break;
                }
            }
            fd.current = true;
            var mode = getMode(fd.extension);
            if(fd.session){
                _editor.setSession(fd.session);
            }
            Events.fire(EVENTS.FILE_OPEN,fd);
    };
    
    self.openByIndex = (index) => {  
        if(openedFiles.empty() || openedFiles.length < index)return;
        if(index <= 0) currentFile = 0;
        else if(index > openedFiles.length) currentFile = openedFiles.length;
        else currentFile = index - 1;
        if(openedFiles.length >= currentFile){
            var fd = openedFiles[currentFile];
            self.openInEditor(fd);
        }
            
    };
    
    self.closeByIndex = (index) => {
        var toClose = openedFiles[index-1];
        var isCurrent = toClose.current; 
        openedFiles.removeAt(index-1);
        currentFile = index - 2;
        if(currentFile < 0) currentFile = 0;
        if(isCurrent && openedFiles.length > 0){
            openedFiles[currentFile].current = true;
            self.openInEditor(openedFiles[currentFile]);
        }else if(openedFiles.empty()){
            var session = ace.createEditSession("","text");
            _editor.setSession(session);
        }
        Events.fire(EVENTS.FILE_CLOSE,toClose);
    };
    
    self.open = (filename) => {
        _socket.emit("openFile",Splitty.encrypt({"filename":filename}));
    };
    
    self.getOpenedFiles = () => openedFiles;
    
    self.pushLocalFile = (fileName) => {
        var localFiles = self.getStoreOpenedFiles();
        if(localFiles.empty((f) => f === fileName)){
            localFiles.push(fileName);
            self.saveLocalOpenedFiles(localFiles);    
        }
    };
    self.removeLocalFile = (fileName) => {
        var localFiles = self.getStoreOpenedFiles();
        localFiles.seekAndDestroy(fileName);
        self.saveLocalOpenedFiles(localFiles);
    };
    
    self.setup = (editor,socket) =>{
        self.setEditor(editor);
        self.setSocket(socket);
        self.bind();
    };
    self.currentFileIndex = () => currentFile
    Events.when(EVENTS.FILE_SAVE,(file) => openedFiles[currentFile].data = file)
    
    Events.when(EVENTS.FILE_OPEN,(fd) => {
        self.pushLocalFile(fd.fileName);
    });
    
    Events.when(EVENTS.FILE_CLOSE,(fd) => {
        self.removeLocalFile(fd.fileName);
    });
    
    self.close = () => {
        self.closeByIndex(self.currentFileIndex()+1);
    };
    
    self.startup = () => {
        var localFiles = self.getStoreOpenedFiles();
        localFiles.each((file)=>self.open(file));
    };
    
    Splitty.register(self);
    return self
})()