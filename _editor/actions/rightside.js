var RightSideAction = (()=>{
    var self = {};
    
    self.execute = (value) => {
        self.setUrl(value)
        ProportionAction.execute("50")
    }
    self.setUrl = (url) => {
       var doc = window.parent.document
       doc.getElementById("rightSideFrame").setAttribute('src',url)
    }
    self.onkeyup = (value) => {}
    self.init = () => {}
    self.getLabelAction = () => ">>>>"
    
    
    Shortcut.bindEvent("set right side",{win: "Ctrl-L", mac: "Command-L"},self)
    return self;
})();