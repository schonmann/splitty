var EditorUI = (()=> {
    var self = {}
    Events.when(FileUtils.events.FILE_OPEN, (file) => {
        var ctx = {};
        ctx.files = FileUtils.getOpenedFiles()        
        Template.render(ctx,"template-footer","footer")
    })
    return self
})()