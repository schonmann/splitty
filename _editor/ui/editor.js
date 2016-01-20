var EditorUI = (()=> {
    var self = {}    
    var currentActionContext = null
    
    _ = (id) => document.getElementById(id)
    
    
    
    self.openBox = () => {
        _("header").style.height = "50px"
        _('foundFiles').style.height = "auto"
        _("optionValue").focus()
    }
    
    self.setActionText = (value) => _("optionValue").value = value
    self.getActionText = () => _("optionValue").value
    
    
    self.onEnterOption = (value) => {       
        currentActionContext.execute(value);
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
        var list = _('foundFiles')
        list.innerHTML = ""
        list.style.height = "0px"
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