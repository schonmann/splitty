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
    
    
    
    self.openBox = () => {
        _("header").style.height = "50px"
        _('foundFiles').style.height = "auto"
    }
    
    
    self.onEnterOption = (value) => {
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
    
    self.openFile = () => {
        self.openBox()
        _("optionValue").value = ""
        _("optionValue").focus()
    };
    
    self.closeInputBox = () => {
        _('header').style.height = '0px'
        var list = _('foundFiles')
        list.innerHTML = ""
        list.style.height = "0px"
        editor.focus()    
    }
    
    self.openSelectedFile = (file) => {        
         FileUtils.open("/"+file)
        self.closeInputBox()
    }
    
    return self
})()