var FileAction = (()=>{
    var self = {};
    
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
     self.openSelectedFile(value)   
    }
    
    self.onkeyup = (value) => {
        Shell.find(value, (founds) => {
            var ctx = {};
            ctx.files = [];
            founds.each((elem,i)=>{
                var obj = {};
                obj.name = elem.split("/").last()
                obj.path = elem
                ctx.files.push(obj)    
            })
            document.getElementById('ctxout').style.display = "block"
            Template.render(ctx,"template-found-files","ctxout") 
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
    NodeIT.register(self)
    return self;
})();

