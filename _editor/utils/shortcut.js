var Shortcut = (()=>{
    var self = {};
    var _editor = null
    
    self.setEditor = (editor) => _editor = editor
    var actionContexts = {};
    
    self.setup = (editor) => {
        self.setEditor(editor)
        _editor.commands.addCommand({name: "open",bindKey: {win: "Ctrl+Shift-O", mac: "Command+Shift-O"},
                                     exec: resolveShortcut.bind({action:"open"})})
        
        _editor.commands.addCommand({name: "refresh right side",bindKey: {win: "Ctrl-L", mac: "Command-L"},exec:                        
                                     resolveShortcut.bind({action:"open"})})
        
        var indexed = [1,2,3,4]
        indexed.forEach((el) => {
            _editor.commands.addCommand(
                {name: "open file "+el,
                 bindKey: {
                     win: "Alt-"+el,
                     mac: "Option-"+el
                 },
                 exec: tryOpenFile.bind(el) })
            })
        
    }
    
    function tryOpenFile  ()  {        
        FileUtils.openByIndex(parseInt(this))
    }
    
    function resolveShortcut(){
        if(actionContexts[this.action]) EditorUI.setupContext(actionContexts[this.action])
    }
    
    self.registerContext = (event,context) => actionContexts[event] = context 
    
    return self;
})();



