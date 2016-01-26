var Shortcut = (()=>{
    var self = {};
    var _editor = null
    
    self.setEditor = (editor) => _editor = editor
    var actionContexts = {};
    
    self.setup = (editor) => {
        self.setEditor(editor)
        _editor.commands.addCommand({name: "open",bindKey: {win: "Ctrl+Shift-O", mac: "Command+Shift-O"},
                                     exec: resolveShortcut.bind({action:"open"})})
        
        _editor.commands.addCommand({name: "set right side",bindKey: {win: "Ctrl-L", mac: "Command-L"},exec:                        
                                     resolveShortcut.bind({action:"set right side"})})

        _editor.commands.addCommand({name: "bing search",bindKey: {win: "Ctrl+Shift-B", mac: "Command+Shift-B"},exec:                        
                                     resolveShortcut.bind({action:"bing search"})})
        
        _editor.commands.addCommand({name: "proportion",bindKey: {win: "Ctrl+Shift-P", mac: "Command+Shift-P"},exec:                        
                                     resolveShortcut.bind({action:"proportion"})})
        
        _editor.commands.addCommand({name: "terminal",bindKey: {win: "Ctrl+Shift-Z", mac: "Command+Shift-Z"},exec:                        
                                     resolveShortcut.bind({action:"terminal"})})                                    
        
        var indexed = [1,2,3,4,5,6,7,8,9]
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



