function ItemNode(){
  this.label = "";
  this.itemNodes = [];
  this.opened = true;
  this.parentNode = null;
  this.div = null;
  this.userLabel = null;
  this.isRoot = function(){
      return this.itemNodes.length > 0;
  };
  this.addChild = function(child){
      if(ItemNode.prototype.isPrototypeOf(child)){
          child.parentNode = this;
          child.opened = false;
          child.div = this.div;
          this.itemNodes.push(child);
      }
  };
  this.removeChild = function(label){
      for(var i = 0; i< this.itemNodes.length; i++){
          var node = this.itemNodes[i];
          if(node.label === label){
              this.itemNodes.splice(i,1);
              return;
          }
      }
  };
  
  this.toPath = function(){
      if(this.parentNode !== null)
        return this.parentNode.toPath() + this.label;
      else
        return this.label;
  };
  this.onOpen = function(callback){
      this.opened = !this.opened;    
      if(typeof(this.callback) === "function")
        this.callback(this);
  };
  
  this.root = function(){
      var parent = this;
      while(parent.parentNode != null){parent = parent.parentNode;}
      return parent;
  };
    
  this.renderTreeView = function(){
      var root = this.root();
      root.div.innerHTML = "";
      root.div.appendChild(root.render())
  };
    
  this.addOnOpenListener = function(callback){
      this.callback = callback;
  };
  this.addOnClickListener = function(callback){
      this.clickListener = callback;
  };
    
  this.onClick = function(callback){
      if(typeof(this.clickListener)=== "function")
        this.clickListener(this)
  };
  this.clearChilds = function(){
      this.itemNodes = [];
  };
  this.render = function(){      
      var icon = "";
      var exec = "";
      var ul = document.createElement("ul");
      ul.setAttribute("style","margin:12px;");      
      var firstLi = document.createElement("li");
      if(this.label.indexOf("/") > 0){
        //directory  
        var span = document.createElement("span")
        span.setAttribute("style","margin-right:3px;cursor:pointer;display:inline-table;")
        var elI = document.createElement("i");
        if(!this.opened){
            elI.setAttribute("class","ion-arrow-right-b");    
        }else{
            elI.setAttribute("class","ion-arrow-down-b");
        }  
        
        span.appendChild(elI);
        span.addEventListener("click",this.onOpen.bind(this));
        firstLi.appendChild(span);
      }
      else if(this.label.endsWith("*")){
          //exec file          
          this.label = this.label.replace("*","");
          firstLi.addEventListener("click",this.onClick.bind(this));
      }else{
          //normal file
          firstLi.addEventListener("click",this.onClick.bind(this));
      }
      
      
      var spanLabel = document.createElement("span");
      if(this.userLabel != null){
        spanLabel.innerHTML = this.userLabel;    
      }else{
          spanLabel.innerHTML = this.label;
      }
      spanLabel.setAttribute("style","cursor:pointer;")
      
      firstLi.appendChild(spanLabel);
      ul.appendChild(firstLi);
      if(!this.opened) return ul;
     
      var childLi = document.createElement("li");      
      for(var i = 0; i< this.itemNodes.length; i++){
          var node = this.itemNodes[i];
          childLi.appendChild(node.render());
      } 
      ul.appendChild(childLi);
      return ul;
  };
}