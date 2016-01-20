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
            Template.render(ctx,"template-found-files","foundFiles") 
        })
    }
    
    self.init = () => {
        
    }
    
    self.getLabelAction = () => "open"
    
    self.executeAction = (e , value) => {
        var nextEl = document.querySelector('[tabindex="'+(parseInt(e.target.getAttribute("tabindex")) + 1)+'"]')
        var nextPrev = document.querySelector('[tabindex="'+(parseInt(e.target.getAttribute("tabindex")) - 1)+'"]')
        var exec =  e.keyCode == 13 && EditorUI.onEnterOption(value)
        exec = exec || (e.keyCode == 40 && nextEl && nextEl.focus()) || (e.keyCode == 38 && nextPrev && nextPrev.focus())
        return exec;        
    }   
    
    
    return self;
})();