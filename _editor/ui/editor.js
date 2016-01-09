var EditorUI = (()=> {
    var self = {}
    
    function renderOpenFiles(){
         var ctx = {};
        ctx.files = FileUtils.getOpenedFiles()        
        Template.render(ctx,"template-footer","footer")
    }
    
    Events.when(FileUtils.events.FILE_OPEN, renderOpenFiles)
    Events.when(FileUtils.events.FILE_CLOSE, renderOpenFiles)
    
    return self
})()