var Shortcut = (()=>{
    var self = {};
    var _editor = null
    self.setEditor = (editor) => _editor = editor
    var actionContexts = {};
    var commands = []
    self.setup = (editor) => {
        self.setEditor(editor)
        commands.each((elem) => _editor.commands.addCommand(elem))               
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
    
    self.bindEvent =  (bindName,command,context) => {
         self.registerContext(bindName,context)
         var params = { 
                        name: bindName,
                        bindKey: command,
                        exec:resolveShortcut.bind({action: bindName})
                      }
        commands.push(params)
    }
    return self;
})();



