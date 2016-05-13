Module.new("Modal",function(){
   return (function(){
        var self = {};
        var modalStack = [];
        self.show = (options) => {
            var context = options;
            if(!context) context = self.defaultOptions();
            else{
                if(!context.buttons && !context.icons){
                    context.buttons = ["Ok"];
                }
                else if(context.buttons && context.buttons.empty() && context.icons && context.icons.empty()){
                    context.buttons = ["Ok"];
                }
                
            }
            stackModal(context);
        };
        
        function stackModal(options) {
            var body = document.body;
            var div = document.createElement("div");
            var idx = modalStack.length;
            div.setAttribute("id","modal-module"+idx);
            div.setAttribute("class","modal-overlay");
            modalStack.push(div);
            body.appendChild(div);
            div.modalContext = options;
            Template.render(options,"modal","modal-module"+idx);
        };
        
        self.hide = () =>{
            var div = modalStack.pop();
            document.body.removeChild(document.getElementById('modal-module'+modalStack.length));
        };
        self.hideAll = () => {
            while(modalStack.any()){
                self.hide();
            }
        };
        self.defaultOptions = ()=>{
          return {
              title:"",
              body:"",
              buttons:["Ok"]
          };  
        };
        self.processClick = (idx) =>{
            var div = modalStack.last();
            if(typeof(div.modalContext.callback) === "function"){
                var r = div.modalContext.callback(idx);
                if(r >= 0 || typeof(r) === "undefined"){
                    self.hide();
                }
            }else{
                self.hide();
            }
            
        }
        return self;   
   })(); 
});