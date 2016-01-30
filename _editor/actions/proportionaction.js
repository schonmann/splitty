var ProportionAction = (()=>{
    var self = {};
    
    self.execute = (value) => {
        NodeIT.prop("proportion",value)
        var frame = window.parent.document.getElementById("rightSideFrame")
        var editor = window.parent.document.getElementById("frameEditor")
        frame.setAttribute('width',value + '%')
        editor.setAttribute('width',(100 - parseInt(value)) + '%')
    }    
    self.onkeyup = (value) => {}
    self.init = (txtValue) => {txtValue.value = ""}
    self.getLabelAction = () => "right side size"
    
    
    self.startup = () => {
        if(NodeIT.hasProp("proportion")){
            self.execute(NodeIT.prop("proportion"))
        }
    }
     
    Shortcut.bindEvent("proportion",{win: "Ctrl+Shift-P", mac: "Command+Shift-P"},self)
    NodeIT.register(self)
    return self;
})();
