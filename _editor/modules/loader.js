var Loader = (()=>{
    var self = {};
    var cache = {};
    self.load = (partialName) => {
        if(typeof(cache[partialName]) !== "undefined") return self;
        
        var fileref=document.createElement('script');
            fileref.setAttribute("type","text/javascript");
            fileref.async = false;
            fileref.setAttribute("src", "modules/" + partialName + "/" + partialName + ".js");
         if (typeof fileref!="undefined")
                document.getElementsByTagName("head")[0].appendChild(fileref);
            fileref=document.createElement("link");
            fileref.setAttribute("rel", "stylesheet");
            fileref.setAttribute("type", "text/css");
            fileref.setAttribute("href","modules/"+ partialName + "/" + partialName + ".css");
         if (typeof fileref!="undefined")
                document.getElementsByTagName("head")[0].appendChild(fileref);
                
         var xhttp = new XMLHttpRequest();
         xhttp.open("GET", "modules/"+ partialName + "/" + partialName + ".tmpl", true);
         xhttp.send();
         xhttp.onreadystatechange = function() {
              if (xhttp.readyState == 4 && xhttp.status == 200) {
                  var template=document.createElement('script');
                  template.setAttribute("type","text/handlebars");
                  template.setAttribute("id",partialName);
                  template.innerHTML = xhttp.responseText;
                document.getElementsByTagName("body")[0].appendChild(template);
                cache[partialName] = true;
              }
         };
         return self;
    };
    
    self.exec = (entrypoint) => {
        var partialName = entrypoint.split(".")[0].toLowerCase();
        if(typeof(cache[partialName]) === "undefined") {
            var interval = setInterval(()=>{
               if(typeof(cache[partialName]) !== "undefined"){
                   clearInterval(interval);
                   eval(entrypoint);
               }
            },150);
        }else{
            eval(entrypoint);    
        }
        
    };
    
    return self;
})();