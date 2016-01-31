var SplitAction = (()=>{
    var self = {};
    
    self.execute = (value) => {
        RightSideAction.execute("http://localhost:"+NodeIT.config()["port"]+"/_editor?openFile="+value)
    }
    self.onkeyup = (value) => FileAction.onkeyup(value)
    
    self.init = (txtValue) => {txtValue.value = ""}
    self.getLabelAction = () => "split"
    
     
    Shortcut.bindEvent("split",{win: "Ctrl+Shift-S", mac: "Command+Shift-S"},self)
    return self;
})();