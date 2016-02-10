var OpenFileTree = (()=>{
    var self = {};
    self.icon = "ion-folder"
    self.title = "Open File Tree"
    
    self.execute = () => {
        Loader.load('filetree').exec("FileTree.open()")
    }
    
    self.action = "OpenFileTree.execute()"
    
    Toolbar.addToolbarCommand(self);
    return self;
})();