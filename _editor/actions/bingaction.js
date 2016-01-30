var BingSearchAction = (()=>{
    var self = {};
    
    self.execute = (value) => {
        window.parent.document
                        .getElementById("rightSideFrame")
                        .setAttribute('src','http://www.bing.com/search?q='+value)
        
        ProportionAction.execute("50")                
                        
    }    
    self.onkeyup = (value) => {}
    self.init = (txtBox) => {txtBox.value = ""}
    self.getLabelAction = () => "bing"
    
    
    Shortcut.bindEvent("bing search",{win: "Ctrl+Shift-B", mac: "Command+Shift-B"},self)    
    return self;
})();