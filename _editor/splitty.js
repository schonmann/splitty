const Splitty = (()=>{
        var actions = [];
        var self = {};
        var configuration = null;
        var aes_key = "";
        var _socket = null;
        var _editor = null;
        self.setKey = (key) => aes_key = key;
        self.register =  (module) => actions.push(module)
        self.startup  = () => {
            executeActions();
            openUserDefinedFiles();
            setupUserDefinedAliases();
            setupAceEditorOptions();
        }
        function setupAceEditorOptions(){
            if(configuration["editor"] && configuration["editor"]["ace"] && configuration["editor"]["ace"]["editorOptions"]){
                _editor.setOptions(configuration["editor"]["ace"]["editorOptions"]);
            }
        }
        function executeActions(){
            actions.each((module)=>{
                if(typeof module["startup"] === "function"){
                    module.startup()
                }
            });
        };
        function setupUserDefinedAliases(){
            if(configuration["editor"] && configuration["editor"]["aliases"]){
                for(var alias in configuration["editor"]["aliases"]){
                    if(!self.hasAlias(alias)){
                        self.addAlias(alias,configuration["editor"]["aliases"][alias]);
                    }
                };
            }
        }
        function openUserDefinedFiles(){
            if(!_socket)throw "Socket not defined to Splitty Class, please configure socket object by using setSocket method from Splitty class.";
            if(configuration["files"] && configuration["files"]["toOpen"]){
                configuration["files"]["toOpen"].each((fileName) =>{
                    FileAction.touch(fileName, ()=>{
                        FileAction.openSelectedFile(fileName);    
                    })
                });
                self.emit("deleteConfigSections",["files"]);
            }
        }
        
        
        
        const  transformToAssocArray = ( prmstr ) => {
            var params = {}
            var prmarr = prmstr.split("&")
            for ( var i = 0; i < prmarr.length; i++) {
                var tmparr = prmarr[i].split("=")
                params[tmparr[0]] = tmparr[1]
            }
            return params
        }
        self.params = () => {
            var prmstr = window.parent.location.search.substr(1)
            return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {}
        };
        self.prop = (prop,value) => {
            if(typeof(value) !== "undefined"){
                localStorage["$$splitty$$"+configuration.host_path+"$$"+prop] = value;
            }else return localStorage["$$splitty$$"+configuration.host_path+"$$"+prop];
            
        };
        self.global = (prop,value) => {
            if(typeof(value) !== "undefined"){
                localStorage["$$splitty$$"+prop] = value;
            }else return localStorage["$$splitty$$"+prop];
            
        };
        self.hasProp = (prop) => typeof(localStorage["$$splitty$$"+configuration.host_path+"$$"+prop]) !== "undefined";
        self.hasGlobal = (prop) => typeof(localStorage["$$splitty$$"+prop]) !== "undefined";
        
        self.setConfig = (config) => configuration = config;
        self.config = () => configuration;
        
        self.encrypt = (message) => {
            if(typeof(message) !== "string"){
                message = JSON.stringify(message);   
            }
            return CryptoJS.AES.encrypt(message, aes_key).toString();
        };
        self.decrypt = (message) => {
            var bytes  = CryptoJS.AES.decrypt(message, aes_key);
            var plaintext = bytes.toString(CryptoJS.enc.Utf8);
            try{
                return JSON.parse(plaintext);
            }catch (e){
                return plaintext;
            }
        };
        self.setSocket = (socket) => _socket = socket;
        self.setEditor = (editor) => _editor = editor;
        self.setup = ()=>{
            var params = self.params();
            self.setKey(params["key"]);
        };
        self.isWindows = ()=>{
        	return configuration.platform.startsWith("win");
        };
        self.emit = (channel,data) => {
            _socket.emit(channel,self.encrypt(data));
        };
        self.receive = (channel,callback) => {
            _socket.on(channel,(data)=>{
               var plainData = self.decrypt(data); 
               callback(plainData);
            });
        };
        self.addAlias = (alias, command) => {
            self.global("alias$$"+alias,command);
        };
        self.getAlias = (alias) => {
            return self.global("alias$$"+alias);
        };
        self.hasAlias = (alias) => {
            return self.hasGlobal("alias$$"+alias)
        };
        self.isUnix = ()=>{
        	return !self.isWindows();
        }
        
        return self;
    })();
