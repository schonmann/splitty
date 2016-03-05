var ProportionAction = (()=>{
    var self = {};
    
    self.execute = (value) => {
        Splitty.prop("proportion",value);
        var frame = window.parent.document.getElementById("rightSideFrame");
        var editor = window.parent.document.getElementById("frameEditor");
        frame.setAttribute('width',value + '%');
        var src = frame.getAttribute('src');
        var rightSideMap = Splitty.prop("rightside");
        if(!rightSideMap){
            rightSideMap = {};
        }else{
            rightSideMap = JSON.parse(rightSideMap);
        }
        rightSideMap[src] = value;
        Splitty.prop("rightside",JSON.stringify(rightSideMap));
        editor.setAttribute('width',(100 - parseInt(value)) + '%');
    }; 
    self.onkeyup = (value) => {};
    self.init = (txtValue) => {txtValue.value = ""};
    self.getLabelAction = () => "right side size";
    
    
    self.startup = () => {
        if(Splitty.hasProp("proportion")){
            self.execute(Splitty.prop("proportion"));
        }else if(Splitty.params().proportion){
            self.execute(Splitty.params().proportion);
        }
    };
     
    Shortcut.bindEvent("proportion",{win: "Ctrl+Shift-P", mac: "Command+Shift-P"},self);
    Splitty.register(self);
    return self;
})();
