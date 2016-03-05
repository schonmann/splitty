var RightSideAction = (()=>{
    var self = {};
    self.stack = [];
    self.execute = (value) => {
        var rightSideObj = {};
        rightSideObj.url = value;
        rightSideObj.width = 40;
        self.stack.push(rightSideObj);
        
        self.setUrl(value);
        ProportionAction.execute("40");
    };
    
    
    self.setUrl = (url) => {
       var doc = window.parent.document;
       doc.getElementById("rightSideFrame").setAttribute('src',url);
    };
    self.onkeyup = (value) => {};
    self.init = () => {};
    self.getLabelAction = () => ">>>>";
    
    
    Shortcut.bindEvent("set right side",{win: "Ctrl-L", mac: "Command-L"},self);
    
    
    Shortcut.bindEvent("refresh right side",{mac:"Command+Shift-X", win:"Ctrl+Shift-X"},{
        action:()=>{
            var frame = window.parent.document.getElementById('rightSideFrame');
            var src = frame.getAttribute('src');
            frame.setAttribute('src',src);
        }
    });
	
	Shortcut.bindEvent("show help",{mac:"Command+Shift-H", win:"Ctrl+Shift-H"},{
        action:()=>{
            var frame = window.parent.document.getElementById('rightSideFrame');
            var src = frame.getAttribute('src');
            frame.setAttribute('src','/_help/');
            ProportionAction.execute("19");
        }
    });
    Shortcut.bindEvent("hide right side",{mac:"Option+Shift+Right", win:"Alt+Shift+Right"},{
        action:()=>{
           ProportionAction.execute(0);
        }
    });
    
    Shortcut.bindEvent("show right side",{mac:"Option+Shift+Left", win:"Alt+Shift+Left"},{
        action:()=>{
           ProportionAction.execute(30);
        }
    });
    return self;
})();