var RightSideAction = (()=>{
    var self = {};
    var stack = [];
    var current = -1;
    self.execute = (value) => {
        stack.push(value);
        current++;
        var map = self.getUrlMap();
        if(!map[value]){
            map[value] = 40;    
        }
        self.setUrl(value);
        ProportionAction.execute(map[value]);
        self.persistUrlMap(map);
    };
    self.getUrlMap = ()=>{
        var map = Splitty.prop("rightside");
        if(!map){
            map = {};
        }else{
            map = JSON.parse(map);
        }
        return map;
    };
    
    self.persistUrlMap = (map) => {
        Splitty.prop("rightside",JSON.stringify(map));
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
           ProportionAction.resize(0);
        }
    });
    
    Shortcut.bindEvent("show right side",{mac:"Option+Shift+Left", win:"Alt+Shift+Left"},{
        action:()=>{
            var frame = window.parent.document.getElementById("rightSideFrame");
            var src = frame.getAttribute('src');
            var map = self.getUrlMap();
            if(map[src]){
                ProportionAction.resize(map[src]);
            }else
                ProportionAction.resize(30);
        }
    });
    
    
    Shortcut.bindEvent("top right side",{mac:"Option+Shift+Up", win:"Alt+Shift+Up"},{
        action:()=>{
            var frame = window.parent.document.getElementById("rightSideFrame");
            frame.setAttribute('src',stack[current]);
            var map = self.getUrlMap();
            var src = stack[current];
            if(map[src])
                ProportionAction.resize(map[src]);
           if(current <= 0 ) current = stack.length - 1;
           else current--;
        }
    });
    Shortcut.bindEvent("bottom right side",{mac:"Option+Shift+Down", win:"Alt+Shift+Down"},{
        action:()=>{
           var frame = window.parent.document.getElementById("rightSideFrame");
            frame.setAttribute('src',stack[current]);
            var map = self.getUrlMap();
            var src = stack[current];
            
            if(map[src])
                ProportionAction.resize(map[src]);
           current = (current + 1) % stack.length;
           console.log(current);
        }
    });
    
    return self;
})();