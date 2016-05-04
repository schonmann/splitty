var SplitAction = (()=>{
    var self = {};
    
    self.execute = (value) => {
        var linkToFile = window.location.protocol+"//"+window.location.host+"/_editor?openFile="+value;
        linkToFile += "&key="+Splitty.params().key;
        linkToFile += "&proportion=100";
        RightSideAction.execute(linkToFile);
        ProportionAction.resize(50);
    };
    self.onkeyup = (value) => FileAction.onkeyup(value);
    
    self.init = (txtValue) => {txtValue.value = ""};
    self.getLabelAction = () => "split";
    
     
    Shortcut.bindEvent("split",{win: "Ctrl+Shift-S", mac: "Command+Shift-S"},self);
    
    return self;
})();