var FileAction = (()=>{
    var self = {};
    var fileRegex = /\w\.\w/gi;
    function renderOpenFiles(){
         var ctx = {};
        ctx.files = FileUtils.getOpenedFiles();
        Template.render(ctx,"template-footer","fileList");
        editor.focus();
    }
    
    Events.when(FileUtils.events.FILE_OPEN, renderOpenFiles);
    Events.when(FileUtils.events.FILE_CLOSE, renderOpenFiles);
    Events.when(FileUtils.events.FILE_DIRTY, renderOpenFiles);
    
   
    
    self.openSelectedFile = (file) => {
        if(file.startsWith("/")){
            FileUtils.open(file);
        }else{
            FileUtils.open("/"+file)
        }
        
    };
    
    self.execute = (value) => {
     fileRegex.lastIndex = 0;  
     if(fileRegex.exec(value) !== null){
        self.openSelectedFile(value);
     }
      else {
         if (value.length && value.charAt(value.length - 1) != "/"){
            EditorUI.setActionText(value+"/");
         }
         self.findFiles();
         return 1;
      }
         
    }; 
    var typingTimer;
    var doneTypingInterval = 800;
    self.onkeyup = (value) => {        
        clearTimeout(typingTimer);
        typingTimer = setTimeout(self.findFiles,doneTypingInterval);
    };
    
    self.findFiles = () => {
        var value = EditorUI.actionBoxValue();
        if(value === "") return;
        Shell.find(value, (founds) => {
            var ctx = {};
            ctx.files = [];
            founds.each((elem,i)=>{
                var obj = {};
                obj.name = elem.split("/").last();
                obj.path = elem;
                ctx.files.push(obj);
            });
            EditorUI.renderOutputAction(ctx,"template-found-files");
        });
    };
    
    self.init = (txtValue) => txtValue.value = "";
        
    self.getLabelAction = () => "open";
    
    self.executeAction = (e , value) => {
        var nextEl = document.querySelector('[tabindex="'+(parseInt(e.target.getAttribute("tabindex")) + 1)+'"]');
        var nextPrev = document.querySelector('[tabindex="'+(parseInt(e.target.getAttribute("tabindex")) - 1)+'"]');
        var exec =  e.keyCode == 13 && EditorUI.onEnterOption(value);
        exec = exec || (e.keyCode == 40 && nextEl && nextEl.focus()) || (e.keyCode == 38 && nextPrev && nextPrev.focus());
        return exec;        
    };
    
    self.startup = ()=>{
        var appParams = Splitty.params();
        if(typeof(appParams.openFile) === "undefined") return;
        const fileToOpen = appParams.openFile;
        ProportionAction.execute("0");
        self.openSelectedFile(fileToOpen);
    };
        
    
    Shortcut.bindEvent("open",{mac:"Command+Shift-O", win:"Ctrl+Shift-O"},self);
    
    
    Shortcut.bindEvent("open next",{mac:"Option-Left", win:"Alt-Left"},{
        action:()=> {
            FileUtils.openByIndex(FileUtils.currentFileIndex());
        }
    });
    Shortcut.bindEvent("open previous",{mac:"Option-Right", win:"Alt-Right"},{
        action:()=>{
            FileUtils.openByIndex(FileUtils.currentFileIndex() + 2);
        }
    });
    
    Shortcut.bindEvent("save file",{mac:"Command+S", win:"Ctrl+S"},{
        action:()=>{
           FileUtils.save();
        }
    });
    
    Shortcut.bindEvent("close file",{mac:"Option+Shift-Q", win:"Alt+Shift-Q"},{
        action:()=>{
           FileUtils.close();
        }
    });
    
    self.mkdir = (name,callback) => {
        Shell.exec("mkdir " + name + " && ls | head -c 10",callback);
    };
    self.delete = (name,callback) => {
        if(Splitty.isUnix()){
            Shell.exec("rm " + name + " && ls . | head -c 10",callback);
        }else{
            Shell.exec("del " + value + " && dir .",callback);
        }
    };
    self.deleteRecursive = (name,callback) => {
        if(Splitty.isUnix()){
            Shell.exec("rm -rf " + name + " && ls . | head -c 10",callback);
        }else{
            Shell.exec("RD /S /Q" + value + " && dir .",callback);
        }
    };
    self.createFile = (name,callback) => {
       self.touch(name,callback);
    };
    self.touch = (name,callback) => {
        if(Splitty.isUnix()){
            Shell.exec("touch " + name + " && ls . | head -c 10",callback);
        }else{
            Shell.exec("type nul > " + value + " && dir .",callback);
        }
    };
    self.renameFile = (name,oldName,callback) => {
        if(Splitty.isUnix()){
            Shell.exec("mv " + oldName + " " + name + " && ls . | head -c 10",callback);
        }else{
            //TODO implement Windows version
        }
    };
    
    Splitty.register(self);
    return self;
})();

