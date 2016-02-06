var TerminalAction = (()=>{
    var self = {}
    self.execute = (value) => {
        if(value.startsWith("alias:")){
            self.defineAlias(value)
            document.getElementById('optionValue').value = ""
        }else if(NodeIT.hasGlobal(value)){
            self.exec(NodeIT.global(value))    
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
    self.defineAlias = (value) => {
        var alias = value.replace("alias:","").trim().split("=")
        NodeIT.global(alias[0],alias[1])
    }
    self.onkeyup = (value) => {}
    self.init = (txtBox) => {txtBox.value = ""}
    self.getLabelAction = () => "$"
        
    Shortcut.bindEvent("terminal",{win: "Ctrl+Shift-Z", mac: "Command+Shift-Z"},self)
    return self;
})();