var EditorUI = (()=> {
    var self = {}    
    var currentActionContext = null
    
    _ = (id) => document.getElementById(id)
    
    
    
    self.openBox = () => {
        _("header").style.height = "50px"
        _('ctxout').style.display = "none"
        _("optionValue").focus()
    }
    
    self.actionBoxValue = () => _("optionValue").value
    self.block = () => document.getElementById("optionValue").disabled = true
    self.unblock = () => {
        document.getElementById("optionValue").disabled = false
        document.getElementById("optionValue").focus()
    }
    self.setActionText = (value) => {
        _("optionValue").value = value 
        _("optionValue").focus()
    }
    self.getActionText = () => _("optionValue").value
    
    
    self.onEnterOption = (value) => {       
        var ret = currentActionContext.execute(value);
        if(ret < 0 || typeof(ret) === "undefined")
            self.closeInputBox()
    }
    
    self.onChange = (value) => {
        if(typeof(currentActionContext["onchange"]) !== "undefined") {
            var ret = currentActionContext.onchange(value);
            if(ret < 0 || typeof(ret) === "undefined")
                self.closeInputBox()    
        }
    }
    
    self.onkeyup = (value) => { 
        if(typeof(currentActionContext["onkeyup"]) !== "undefined")
            currentActionContext.onkeyup(value)
    }
    
    self.onEscape = () => {
        self.closeInputBox()
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
        _("optionValue").value = ""
        editor.focus()    
    }    
    self.setupContext = (context) => {
      currentActionContext = context
      if(typeof(currentActionContext["init"]) !== "undefined"){
          self.openBox();
          self.setLabelAction(context.getLabelAction())
          currentActionContext.init(_("optionValue"))
      }else if(typeof(currentActionContext["action"]) !== "undefined"){
          currentActionContext.action()
      }
    } 
    self.setLabelAction = (value) => {
        _("spanDescription").innerHTML = "&nbsp;" + value + " >"
    }
    
    self.renderOutputAction = (data,template) => {
        if( _('header').style.height == "0px") return
        document.getElementById('ctxout').style.display = "block"
        Template.render(data,template,"ctxout") 
        
    }
    
    return self
})()