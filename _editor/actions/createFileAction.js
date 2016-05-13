var CreateFileAction = (()=>{
    var self = {};
    
    self.execute = (value) => {
        self.createFile(value,()=>{
            FileAction.openSelectedFile(value); 
        });
    }; 
    self.mkdir = (name,callback) => {
        Shell.exec("mkdir " + name + " && ls",callback);
    };
    self.createFile = (name,callback) => {
        if(Splitty.isUnix()){
            Shell.exec("touch " + name + " && ls .",callback);
        }else{
            Shell.exec("type nul > " + value + " && dir .",callback);
        }
    };
    
    self.onkeyup = (value) => {        
    
    };
    
    self.init = (txtValue) => txtValue.value = "";
        
    self.getLabelAction = () => "new file";
    
    
    Shortcut.bindEvent("create new file",{mac:"Command+Shift-M", win:"Ctrl+Shift-M"},self);
    return self;
})();

