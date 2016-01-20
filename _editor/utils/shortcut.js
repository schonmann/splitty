var Shortcut = (()=>{
    var self = {};
    var _editor = null
    
    self.setEditor = (editor) => _editor = editor
    
    self.setup = (editor) => {
        self.setEditor(editor)
        _editor.commands.addCommand({name: "open",bindKey: {win: "Ctrl+Shift-O", mac: "Command+Shift-O"},exec: EditorUI.openFile})
        _editor.commands.addCommand({name: "refresh right side",bindKey: {win: "Ctrl-R", mac: "Command+Shift-Z"},exec: refreshRightSide})
        
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
    
    function refreshRightSide(){
        
    }
    
    return self;
})()