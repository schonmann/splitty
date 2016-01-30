var SplitAction = (()=>{
    var self = {};
    const PORT = 8000
    self.execute = (value) => {
        RightSideAction.execute("http://localhost:"+PORT+"/_editor?openFile="+value)
    }
    self.onkeyup = (value) => {}
    self.init = (txtValue) => {txtValue.value = ""}
    self.getLabelAction = () => "split"
    
     
    Shortcut.bindEvent("split",{win: "Ctrl+Shift-S", mac: "Command+Shift-S"},self)
    return self;
})();