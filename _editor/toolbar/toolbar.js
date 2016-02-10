var Toolbar = (()=>{
    var self = {};
    var toolbarCommands = []
    self.addToolbarCommand = (command) => toolbarCommands.push(command)
    self.render = ()=>{
        Template.render(toolbarCommands,"toolbar-commands","toolbar")
    }
    return self;
})();

