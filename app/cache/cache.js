var mod = (()=>{
  var self = {}
  var map = {} 
  self.put = (key,value) => {
      map[key] = value
  }
  self.get = (key) => map[key]
  
  self.hasKey = (key) => typeof(map[key]) !== "undefined"
  return self;
})();
module.exports = mod
