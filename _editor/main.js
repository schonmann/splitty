function startupEditor(){
        ace.require("ace/ext/language_tools");
        window.editor = ace.edit("editor");
        window.editor.setTheme("ace/theme/monokai");
        window.editor.getSession().setMode("ace/mode/text");
        window.editor.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: false,
            showPrintMargin:false
        });
        window.socket = io();
        document.addEventListener("DOMContentLoaded", function(event) { 
            window.socket.emit("config")
            window.socket.on("config",(crypt_config)=>{
                var config = Splitty.decrypt(crypt_config);
                Splitty.setConfig(config);
                Splitty.startup();
                Toolbar.render();
            });           
        });

        FileUtils.setup(window.editor,window.socket);        
        Shell.setup(window.editor,window.socket);
        Shortcut.setup(window.editor);
        window.editor.$blockScrolling = Infinity

        document.getElementById("optionValue").addEventListener("keyup",(event) =>{
            if(event.keyCode === 13) EditorUI.onEnterOption(document.getElementById("optionValue").value)
            else if(event.keyCode === 27) EditorUI.onEscape(document.getElementById("optionValue").value)
            else EditorUI.onkeyup(document.getElementById("optionValue").value)
        });

        document.getElementById("optionValue").addEventListener("change",(event) =>{
            EditorUI.onChange(document.getElementById("optionValue").value)
        });


        window.editor.on("focus", function() { 
            setTimeout(EditorUI.closeInputBox,100)
        });

if (window.top.document.getElementById('rightSideFrame').getAttribute('src') == "")
    window.editor.focus()    
}
function genKey(baseKey){
        return CryptoJS.MD5(CryptoJS.MD5(baseKey).toString()).toString()
    }
    
    var _key = Splitty.params()["key"];
    if(typeof(_key)!== "undefined"){
        Splitty.setKey(genKey(_key));
    }else{
        var key = prompt("Please enter with access key");
        if (key != null && key != "") {
            Splitty.setKey(genKey(key));
        }
    }
startupEditor();