var RightSideAction = (()=>{
    var self = {};
    
    self.execute = (value) => {
        window.parent.document.getElementById("rightSideFrame").setAttribute('src',value)
    }
    
    self.onkeyup = (value) => {
        
    }
    
    self.init = () => {
        
    }
    self.getLabelAction = () => ">>>>"
    
        
    return self;
})();