const Splitty = (()=>{
        var actions = [];
        var self = {};
        var configuration = null;
        var aes_key = "2c6a999e72cacf2b76c4b555787001c6";
        self.setKey = (key) => aes_key = key;
        self.register =  (module) => actions.push(module)
        self.startup  = () => {
            actions.each((module)=>{
                if(typeof module["startup"] === "function"){
                    module.startup()
                }
            })
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
        }
        self.prop = (prop,value) => {
            if(typeof(value) !== "undefined"){
                localStorage["$$splitty$$"+configuration.host_path+"$$"+prop] = value;
            }else return localStorage["$$splitty$$"+configuration.host_path+"$$"+prop];
            
        }
        self.global = (prop,value) => {
            if(typeof(value) !== "undefined"){
                localStorage["$$splitty$$"+prop] = value    
            }else return localStorage["$$splitty$$"+prop]
            
        }
        self.hasProp = (prop) => typeof(localStorage["$$splitty$$"+configuration.host_path+"$$"+prop]) !== "undefined"
        self.hasGlobal = (prop) => typeof(localStorage["$$splitty$$"+prop]) !== "undefined"
        
        self.setConfig = (config) => configuration = config
        self.config = () => configuration
        
        self.encrypt = (message) => {
            if(typeof(message) !== "string"){
                message = JSON.stringify(message);   
            }
            return CryptoJS.AES.encrypt(message, aes_key).toString();
        }
        self.decrypt = (message) => {
            var bytes  = CryptoJS.AES.decrypt(message, aes_key);
            var plaintext = bytes.toString(CryptoJS.enc.Utf8);
            return JSON.parse(plaintext);
        }
        
        
        self.isWindows = ()=>{
        	return configuration.platform.startsWith("win");
        }
        self.isUnix = ()=>{
        	return !self.isWindows();
        }
        
        return self;
    })();