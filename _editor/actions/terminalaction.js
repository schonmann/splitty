var TerminalAction = (()=>{
    var self = {}
    self.execute = (value) => {
        if (value.trim() === "") return 1
        if(value.startsWith("alias:")){
            self.defineAlias(value)
            document.getElementById('optionValue').value = ""
        }else if(self.hasAliasFromCommand(value)){
            self.exec(self.compile(value))
           
        }else{
            self.exec(value)
        }
        return 1
    }  
    
    self.escape = (html) => {
        return document.createElement('div')
            .appendChild(document.createTextNode(html))
            .parentNode
            .innerHTML
    }

    
    self.exec = (value) => {
        ctxout.innerHTML = ""
        Shell.exec(value, (stdout) => {
            var ctxout = document.getElementById('ctxout')
            ctxout.focus()
            ctxout.style.display = "block"
            ctxout.innerHTML = "<pre>"+self.escape(Shell.stdio())+"</pre>"
        })
        document.getElementById('optionValue').value = ""
    }
    self.compile = (command) => {
        /*This method compiles command and aliases indentifying alias params*/
        var tokens = self.tokenizeCommand(command)
        var alias = self.getAlias(tokens[0])
        for(var i = 1; i < tokens.length; i++){
            alias = alias.replace("$"+i,tokens[i])
        }
        return alias
    }
    
    self.hasAliasFromCommand = (command) => {
        var tokens = self.tokenizeCommand(command)
        return self.hasAlias(tokens[0])
    }
    
    self.tokenizeCommand = (command) => {
        var tokens = [];
        var currentToken = ""
        var index = 0;
        for(var c = 0; c < command.length; c++){
            if(command[c]=="\""){
                index = c + 1
                currentToken = "\""
                while(command[index] != "\"" && index < command.length){
                    currentToken += command[index]
                    index++
                }
                if(currentToken === "\"")continue
                if(currentToken !== "")
                    tokens.push(currentToken+"\"")
                currentToken = ""
                c = index
            }
            else if(command[c] !== " "){
                currentToken += command[c]
            }else if(command[c] === " " && currentToken !== ""){
                tokens.push(currentToken)
                currentToken = ""
            }
        }
        if(currentToken !== ""){
            tokens.push(currentToken)
        }
        return tokens
    }
    
    self.hasAlias = (alias) => NodeIT.hasGlobal("alias$$"+alias)
    self.getAlias = (alias) => NodeIT.global("alias$$"+alias)
    
    
    self.defineAlias = (value) => {
        var alias = value.replace("alias:","").trim().split("=")
        NodeIT.global("alias$$"+alias[0].trim(),alias[1].trim())
    }
    self.onkeyup = (value) => {}
    self.init = (txtBox) => {txtBox.value = ""}
    self.getLabelAction = () => "$"
        
    Shortcut.bindEvent("terminal",{win: "Ctrl+Shift-Z", mac: "Command+Shift-Z"},self)
    return self;
})();