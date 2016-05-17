var CreateFileAction = (()=>{
    var self = {};
    
    self.execute = (value) => {
        FileAction.createFile(value,()=>{
            FileAction.openSelectedFile(value); 
        });
    }; 
    
    self.onkeyup = (value) => {        
    
    };
    
    self.init = (txtValue) => txtValue.value = "";
        
    self.getLabelAction = () => "new file";
    
    
    Shortcut.bindEvent("create new file",{mac:"Command+Shift-M", win:"Ctrl+Shift-M"},self);
    return self;
})();

