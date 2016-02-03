var FileAction = (()=>{
    var self = {};
    var fileRegex = /\w\.\w/gi
    function renderOpenFiles(){
         var ctx = {};
        ctx.files = FileUtils.getOpenedFiles()        
        Template.render(ctx,"template-footer","footer")
        editor.focus()
    }
    
    Events.when(FileUtils.events.FILE_OPEN, renderOpenFiles)
    Events.when(FileUtils.events.FILE_CLOSE, renderOpenFiles)
    
   
    
    self.openSelectedFile = (file) => FileUtils.open("/"+file)
    
    self.execute = (value) => {
     if(fileRegex.exec(value) != null)    
        self.openSelectedFile(value)
      else {
         EditorUI.setActionText(value+"/")
         self.findFiles()
         return 1
      }
         
    }
    var acc = 0
    var oldValue = ""
    self.onkeyup = (value) => {
        if(value == "") return
        if(acc == 0 || acc > 8){
            setTimeout(()=>{
               self.findFiles()
            },700)
        }
        acc++;
    }
    
    self.findFiles = () => {
        Shell.find(EditorUI.actionBoxValue(), (founds) => {
            var ctx = {};
            ctx.files = [];
            founds.each((elem,i)=>{
                var obj = {};
                obj.name = elem.split("/").last()
                obj.path = elem
                ctx.files.push(obj)    
            })
            EditorUI.renderOutputAction(ctx,"template-found-files")
             acc = 0;
        })    
    }
    
    self.init = (txtValue) => txtValue.value = ""
        
    self.getLabelAction = () => "open"
    
    self.executeAction = (e , value) => {
        var nextEl = document.querySelector('[tabindex="'+(parseInt(e.target.getAttribute("tabindex")) + 1)+'"]')
        var nextPrev = document.querySelector('[tabindex="'+(parseInt(e.target.getAttribute("tabindex")) - 1)+'"]')
        var exec =  e.keyCode == 13 && EditorUI.onEnterOption(value)
        exec = exec || (e.keyCode == 40 && nextEl && nextEl.focus()) || (e.keyCode == 38 && nextPrev && nextPrev.focus())
        return exec;        
    }   
    
    self.startup = ()=>{
        
        var appParams = NodeIT.params()
        if(typeof(appParams["openFile"]) === "undefined") return
        const fileToOpen = appParams["openFile"]
        ProportionAction.execute("0")
        self.openSelectedFile(fileToOpen)
        
    }
        
    
    Shortcut.bindEvent("open",{mac:"Command+Shift-O", win:"Ctrl+Shift-O"},self)
    
    
    Shortcut.bindEvent("open next",{mac:"Option-Left", win:"Alt-Left"},{
        action:()=> {
            FileUtils.openByIndex(FileUtils.currentFileIndex())
        }
    })
    Shortcut.bindEvent("open previous",{mac:"Option-Right", win:"Alt-Right"},{
        action:()=>{
            FileUtils.openByIndex(FileUtils.currentFileIndex() + 2)
        }
    })
    
    
    NodeIT.register(self)
    return self;
})();

