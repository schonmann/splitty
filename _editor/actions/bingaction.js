var BingSearchAction = (()=>{
    var self = {};
    
    self.execute = (value) => {
        window.parent.document
                        .getElementById("rightSideFrame")
                        .setAttribute('src','http://www.bing.com/search?q='+value)
    }    
    self.onkeyup = (value) => {}
    self.init = (txtBox) => {txtBox.value = ""}
    self.getLabelAction = () => "bing"
    return self;
})();