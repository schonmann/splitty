var CreateFileAction = (()=>{
    var self = {};
    
    self.execute = (value) => {
        if(Splitty.isUnix()){
            Shell.exec("touch " + value + " && ls",()=>{
                FileAction.openSelectedFile(value);
            });
        }else{
            Shell.exec("type nul > " + value + " && dir",()=>{
                FileAction.openSelectedFile(value);
            });
        }
         
    }; 
    
    self.onkeyup = (value) => {        
    
    };
    
    self.init = (txtValue) => txtValue.value = "";
        
    self.getLabelAction = () => "new file";
    
    
    Shortcut.bindEvent("create new file",{mac:"Command+Shift-M", win:"Ctrl+Shift-M"},self);
    return self;
})();

