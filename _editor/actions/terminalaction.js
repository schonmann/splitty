var TerminalAction = (()=>{
    var self = {}
    self.execute = (value) => {
        if (value.trim() === "") return 1
        if(value.startsWith("alias:")){
            self.defineAlias(value)
            document.getElementById('optionValue').value = ""
        }else if(self.hasAlias(value)){
            self.exec(self.getAlias(value))    
        }else{
            self.exec(value)
        }
        return 1
    }  
    
    self.escape = (html) => {
        return document.createElement('div')
            .appendChild(document.createTextNode(html))
            .parentNode
            .innerHTML
    }

    
    self.exec = (value) => {
        Shell.exec(value, (stdout) => {
            var ctxout = document.getElementById('ctxout')
            ctxout.focus()
            ctxout.style.display = "block"
            ctxout.innerHTML = "<pre>"+self.escape(Shell.stdio())+"</pre>"
        })
        document.getElementById('optionValue').value = ""
    }
    
    self.hasAlias = (alias) => NodeIT.hasGlobal("alias$$"+alias)
    self.getAlias = (alias) => NodeIT.global("alias$$"+alias)
    
    
    self.defineAlias = (value) => {
        var alias = value.replace("alias:","").trim().split("=")
        NodeIT.global("alias$$"+alias[0].trim(),alias[1].trim())
    }
    self.onkeyup = (value) => {}
    self.init = (txtBox) => {txtBox.value = ""}
    self.getLabelAction = () => "$"
        
    Shortcut.bindEvent("terminal",{win: "Ctrl+Shift-Z", mac: "Command+Shift-Z"},self)
    return self;
})();