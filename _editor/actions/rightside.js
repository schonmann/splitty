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
    
    Shortcut.bindEvent("set right side",{win: "Ctrl-L", mac: "Command-L"},self)
    
    Shortcut.bindEvent("refresh right side",{mac:"Ctrl+Shift-L", win:"Ctrl+Shift-L"},{
        action:()=>{
            var frame = window.parent.document.getElementById('rightSideFrame')
            var src = frame.getAttribute('src')
            frame.setAttribute('src',src)
        }
    })
    return self;
})();