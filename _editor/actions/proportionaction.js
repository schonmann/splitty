var ProportionAction = (()=>{
    var self = {};
    
    self.execute = (value) => {
        var frame = window.parent.document.getElementById("rightSideFrame")
        var editor = window.parent.document.getElementById("frameEditor")
        frame.setAttribute('width',value + '%')
        editor.setAttribute('width',(100 - parseInt(value)) + '%')
    }    
    self.onkeyup = (value) => {}
    self.init = (txtValue) => {txtValue.value = ""}
    self.getLabelAction = () => "right side size"
    
     
    Shortcut.bindEvent("proportion",{win: "Ctrl+Shift-P", mac: "Command+Shift-P"},self)
    return self;
})();
