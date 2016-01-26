var ProportionAction = (()=>{
    var self = {};
    
    self.execute = (value) => {
        var frame = window.parent.document.getElementById("frameEditor")
        var editor = window.parent.document.getElementById("rightSideFrame")
        frame.setAttribute('width',value + '%')
        frame.setAttribute('width',(100 - parseInt(value)) + '%')
    }    
    self.onkeyup = (value) => {}
    self.init = () => {}
    self.getLabelAction = () => "right width"
    
    return self;
})();
