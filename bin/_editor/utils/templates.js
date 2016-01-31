var Template = (()=>{
    var self = {};
    self.render = (context,templateId,destinyId) => {
        var source   = document.getElementById(templateId).innerHTML
        var template = Handlebars.compile(source);
        document.getElementById(destinyId).innerHTML = template(context)        
    }
    
    Handlebars.registerHelper("inc", (value, options)=> parseInt(value) + 1)
    return self;
})()