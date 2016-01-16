var EditorUI = (()=> {
    var self = {}    
    var currentActionContext = null
    
    _ = (id) => document.getElementById(id)
    function renderOpenFiles(){
         var ctx = {};
        ctx.files = FileUtils.getOpenedFiles()        
        Template.render(ctx,"template-footer","footer")
        editor.focus()
    }
    
    Events.when(FileUtils.events.FILE_OPEN, renderOpenFiles)
    Events.when(FileUtils.events.FILE_CLOSE, renderOpenFiles)
    
    
    
    self.openBox = () => _("header").style.height = "50px"
    
    
    self.onEnterOption = (value) => {
        FileUtils.open(value)
        self.closeInputBox()
    }
    
    self.openFile = () => {
        self.openBox()
        _("optionValue").value = "/"
        _("optionValue").focus()
    };
    
    self.closeInputBox = () => {
        document.getElementById('header').style.height = '0px'
        editor.focus()    
    }
    return self
})()