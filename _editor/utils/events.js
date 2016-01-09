var Events = (() => {
    var self = {}
    var listeners = {}
     
    self.when = (event,callback) => {
        if(typeof(listeners[event]) === "object" && typeof(callback)==="function")
            listeners[event].push(callback)    
    }
    
    self.fire = (event,data) => {
        if(typeof(listeners[event]) === "object"){
            listeners[event].each((callback,idx) => {
                console.log(typeof(callback))
                callback(data)
            })
        }
    }
    
    self.register = (event) => listeners[event] = []
    
    return self
})()