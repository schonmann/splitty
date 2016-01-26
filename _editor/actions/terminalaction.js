var TerminalAction = (()=>{
    var self = {}
    self.execute = (value) => {
        Shell.exec(value, (stdout) => {
            var ctxout = document.getElementById('ctxout')
            ctxout.focus()
            ctxout.style.display = "block"
            ctxout.innerHTML = "<pre>"+stdout+"</pre>"
            
        })
        return 1
    }    
    self.onkeyup = (value) => {}
    self.init = (txtBox) => {txtBox.value = ""}
    self.getLabelAction = () => "$"
    return self;
})();