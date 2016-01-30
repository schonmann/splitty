var TerminalAction = (()=>{
    var self = {}
    self.execute = (value) => {
        Shell.exec(value, (stdout) => {
            var ctxout = document.getElementById('ctxout')
            ctxout.focus()
            ctxout.style.display = "block"
            ctxout.innerHTML = "<pre>"+Shell.stdio()+"</pre>"
        })
        document.getElementById('optionValue').value = ""
        return 1
    }    
    self.onkeyup = (value) => {}
    self.init = (txtBox) => {txtBox.value = ""}
    self.getLabelAction = () => "$"
        
    Shortcut.bindEvent("terminal",{win: "Ctrl+Shift-Z", mac: "Command+Shift-Z"},self)
    return self;
})();