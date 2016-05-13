function ItemNode(){
  this.label = "";
  this.itemNodes = [];
  this.opened = true;
  this.parentNode = null;
  this.div = null;
  this.editNode = false;
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
      if(this.label.indexOf("/") > 0){
          //add create file icon button
          var createFile = document.createElement("i");
          createFile.setAttribute("class","ion-plus-circled");
          createFile.style.marginLeft = '10px';
          createFile.style.display = "none";
          createFile.directory = this.toPath();
          createFile.nodeTree = this;
          createFile.onclick = function(){
              Modal.show({
                  title:"Create File or Folder",
                  body:getHTMLFromCreateFilePopUp(this.directory),
                  icons:[{icon:"ion-document-text",label:"new file"},
                         {icon:"ion-folder",label:"new folder"},
                         {icon:"ion-close-circled",style:"color:red;",label:"cancel"}],
                  callback:function(buttonID){
                      var name = document.getElementById('txtCreateNewFile').value;
                      
                      switch (buttonID) {
                          case 0:
                              if(name === ""){
                                  alert("Name cannot be empty");
                                  return -1;
                              }
                              var fileName = createFile.directory+name;
                              CreateFileAction.createFile(fileName,(e)=>{
                                 console.log(fileName); 
                                 FileAction.openSelectedFile(fileName); 
                              });
                              break;
                          case 1:
                              if(name === ""){
                                  alert("Name cannot be empty");
                                  return -1;
                              }
                              var fileName = createFile.directory+name;
                              CreateFileAction.mkdir(fileName,()=>{
                                  console.log(fileName);
                                 FileAction.openSelectedFile(fileName); 
                              });
                              break;
                          default:
                              // code
                      }
                  }
              });
              
          };
          
          firstLi.appendChild(createFile);
          firstLi.onmouseenter = function(){
            createFile.style.display = "";  
          };
          firstLi.onmouseleave = function(){
            createFile.style.display = "none";  
          };
          
      }
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
function getHTMLFromCreateFilePopUp(rootDirectory){
    var html = "";
    html +="<input type='text' class='splitty-input-text' id='txtCreateNewFile' placeholder='Name' />";
    html += "<label style='color: #555555;line-height: 3;font-size: 0.8em;font-family: sans-serif;font-weight: 400;'";
    html +=" for='txtCreateNewFile'>Path: "+rootDirectory+"</label>";
    return html;
}
var FileTree = (()=>{
    var self = {};
    var body = document.getElementsByTagName('body')[0];
    self.root = null;
    self.separator = "\n";
    self.open = () => {
        var div = document.createElement("div");
        div.setAttribute("id","filetree-module");
        div.setAttribute("class","filetree-window");
        body.appendChild(div);
        self.root = new ItemNode();
        self.root.label = Splitty.config().host_path + "/";
        self.root.userLabel =  "/";
        self.root.opened = true;
        Shell.exec("ls -F",(stdout) => {
            Template.render(null,"filetree","filetree-module");
            var tree = document.getElementById('treeview');
            self.root.div = tree;
            self.compileTree(self.root,stdout.split(self.separator)).renderTreeView();
        });
    };
    
    self.renderTree = () =>{
        Template.render(null,"filetree","filetree-module");
        var tree = document.getElementById('treeview');
        tree.appendChild(self.root.render());
    };
    
    self.appendChilds = (node) => {
        var command = "ls -F " + node.toPath();
           Shell.exec(command,(stdout) => {
               if(typeof(stdout) === "string"){
                  node.clearChilds();
                  node = self.compileTree(node,stdout.split(self.separator));
                  node.renderTreeView()    
               }
        });
    };
    
    self.openFile = (node) => {
        FileUtils.open(node.toPath());
    };
    
    self.compileTree = (root,files) => {          
        root.addOnOpenListener(self.appendChilds)        
        root.addOnClickListener(self.openFile);
        files.map((file) => {
            var child = new ItemNode();
            child.label = file;
            child.addOnClickListener(self.openFile);
            child.addOnOpenListener(self.appendChilds);
            return child;
        }).each((node)=>root.addChild(node));
        return root;
    };
    
    self.close = () => {
        var el = document.getElementById( 'filetree-module' );
        el.parentNode.removeChild( el );
    };
    
    self.minimize = ()=>{
        var el = document.getElementsByClassName('filetree-window')[0];
        if(el.style.height === "15px"){
            el.style.height = "630px"    
        }else{
            el.style.height = "15px"
        }
        
    };
    return self;
})();
