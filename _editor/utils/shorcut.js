var Shortcut = (()=>{
    var self = {};
    var _editor = null
    
    self.setEditor = (editor) => _editor = editor
    
    self.setup = (editor) => {
        self.setEditor(editor)
        _editor.commands.addCommand({name: "open",bindKey: {win: "Ctrl-O", mac: "Command-O"},exec: EditorUI.openFile})
        _editor.commands.addCommand({name: "refresh right side",bindKey: {win: "Ctrl-R", mac: "Command-R"},exec: Shell.ls})
        
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
    return self;
})()