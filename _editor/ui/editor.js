var EditorUI = (()=> {
    var self = {}    
    var currentActionContext = null
    
    _ = (id) => document.getElementById(id)
    
    
    
    self.openBox = () => {
        _("header").style.height = "50px"
        _('ctxout').style.display = "none"
        _("optionValue").focus()
    }
    
    self.setActionText = (value) => _("optionValue").value = value
    self.getActionText = () => _("optionValue").value
    
    
    self.onEnterOption = (value) => {       
        var ret = currentActionContext.execute(value);
        if(ret < 0 || typeof(ret) === "undefined")
            self.closeInputBox()
    }
    
    self.onkeyup = (value) => {        
        currentActionContext.onkeyup(value)        
    }
    
    self.openFile = () => {
        self.openBox()
        _("optionValue").value = ""
        _("optionValue").focus()
    };
    
    self.closeInputBox = () => {
        _('header').style.height = '0px'
        var list = _('ctxout')
        list.innerHTML = ""
        list.style.display = "none"
        editor.focus()    
    }    
    self.setupContext = (context) => {
      currentActionContext = context
      self.openBox();
      self.setLabelAction(context.getLabelAction())
      currentActionContext.init(_("optionValue"))
    } 
    self.setLabelAction = (value) => {
        _("spanDescription").innerHTML = "&nbsp;" + value + " >"
    }
    
    return self
})()