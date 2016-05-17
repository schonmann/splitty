function ItemNode(){
  this.label = "";
  this.itemNodes = [];
  this.type = "";
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
      while(parent.parentNode !== null){parent = parent.parentNode;}
      return parent;
  };
    
  this.renderTreeView = function(){
      var root = this.root();
      root.div.innerHTML = "";
      root.div.appendChild(root.render());
  };
    
  this.addOnOpenListener = function(callback){
      this.callback = callback;
  };
  this.addOnClickListener = function(callback){
      this.clickListener = callback;
  };
    
  this.onClick = function(callback){
      if(typeof(this.clickListener)=== "function")
        this.clickListener(this);
  };
  this.clearChilds = function(){
      this.itemNodes = [];
  };
  this.isDirectory = function(){
      return this.type === "directory";
  };
  this.isExecutable = function(){
      return this.type === "exec";
  };
  this.isDataFile = function(){
      return this.type === "data";
  };
  this.render = function(){      
      var icon = "";
      var exec = "";
      var ul = document.createElement("ul");
      ul.setAttribute("style","margin:12px;");      
      var firstLi = document.createElement("li");
      var rootSpan = document.createElement("span");
      var spanLabel = document.createElement("span");
      spanLabel.setAttribute("style","cursor:pointer;");
      if(this.label.indexOf("/") >= 0){
        this.type = "directory";
        var span = document.createElement("span");
        span.setAttribute("style","margin-right:3px;cursor:pointer;display:inline-table;");
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
          this.label = this.label.replace("*","");
          this.type = "exec";
          spanLabel.addEventListener("click",this.onClick.bind(this));
      }else{
          this.type = "data";
          spanLabel.addEventListener("click",this.onClick.bind(this));
      }
      
      
      
      if(this.userLabel !== null){
        spanLabel.innerHTML = this.userLabel;    
      }else{
          spanLabel.innerHTML = this.label;
      }
      
      rootSpan.appendChild(spanLabel);
      
      firstLi.appendChild(rootSpan);
      if(this.userLabel !== "/")
      {
        addActionButtons(this,rootSpan);
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
function addActionButtons(node,label){
    var actionDiv = document.createElement("span");
    actionDiv.style.display = "none";
    appendActionButtons(node,actionDiv);
    label.appendChild(actionDiv);
    label.onmouseenter = function(){
      actionDiv.style.display = "inline-table";  
    };
    label.onmouseleave = function(){
      actionDiv.style.display = "none";  
    };
}

function appendActionButtons(node,actionDiv){
    if(node.isDirectory()){
        actionDiv.appendChild(createAddFileFolderButton(node));
    }
    actionDiv.appendChild(createDeleteFileFolderButton(node));
    actionDiv.appendChild(createRenameButton(node));
}
function createActionButton(node,title,icon){
  var actionButton = document.createElement("i");
  actionButton.setAttribute("class",icon);
  actionButton.style.marginLeft = '8px';
  actionButton.title=title;
  actionButton.style.fontSize = "17px";
  actionButton.directory = node.toPath();
  actionButton.node = node;
  return actionButton;
}
function createDeleteFileFolderButton(node){
  var deleteFile = createActionButton(node,"delete file","ion-trash-b");
  deleteFile.onclick = function(){
      Modal.show({
          title:"Delete",
          body:'Are you sure to delete ' + this.directory + '?',
          buttons:["Yes","No"],
          callback:function(buttonID){
              var fileName = deleteFile.directory;
              try{
                  switch (buttonID) {
                      case 0:
                          if(deleteFile.node.isDirectory()){
                              FileAction.deleteRecursive(fileName,()=> FileTree.appendChilds(deleteFile.node.parentNode));
                          }else{
                              FileAction.delete(fileName,()=> FileTree.appendChilds(deleteFile.node.parentNode));
                          }
                          break;
                      default:
                          // code
                  }
              }catch(e){
                  alert(e);
                  return -1;
              }
          }
      });
      
  };
  return deleteFile;
}

function createAddFileFolderButton(node){
  var createFile = createActionButton(node,"new","ion-plus");
  createFile.onclick = function(){
      Modal.show({
          title:"Create File or Folder",
          body:getHTMLFromCreateFilePopUp(this.directory),
          icons:[{icon:"ion-document-text",label:"new file"},
                 {icon:"ion-folder",label:"new folder"},
                 {icon:"ion-close-circled",style:"color:red;",label:"cancel"}],
          onload:function(){
              document.getElementById('txtCreateNewFile').focus(); 
          },
          callback:function(buttonID){
              var name = document.getElementById('txtCreateNewFile').value;
              var fileName = createFile.directory+name;
              function _callback(){
                 FileAction.openSelectedFile(fileName); 
                 FileTree.appendChilds(createFile.node);
              }
              try{
                  switch (buttonID) {
                      case 0:
                          assertFileNameNotEmpty(name);
                          FileAction.createFile(fileName,_callback);
                          break;
                      case 1:
                          assertFileNameNotEmpty(name);
                          FileAction.mkdir(fileName,_callback);
                          break;
                      default:
                          // code
                  }
              }catch(e){
                  alert(e);
                  return -1;
              }
          }
      });
      
  };
  return createFile;
}
function createRenameButton(node){
  var renameFile = createActionButton(node,"rename","ion-edit");
  function getFileName(){
      var parts = renameFile.directory.split("/");
      if(node.isDirectory()){
          parts.pop();
      }
      return parts.last();
  }
  renameFile.onclick = function(){
      Modal.show({
          title:"Rename File or Folder",
          body:"<input type='text' class='splitty-input-text' id='txtRenameFile' placeholder='Name' />",
          icons:[{icon:"ion-edit",label:"rename"},
                 {icon:"ion-close-circled",style:"color:red;",label:"cancel"}],
          onload:function(){
              var textInput = document.getElementById('txtRenameFile');
              textInput.focus();
              var fileName = getFileName();
              textInput.value = fileName;
          },
          callback:function(buttonID){
              var name = document.getElementById('txtRenameFile').value;
              var fileName = renameFile.directory.replace(getFileName(),"") + name;
              try{
                  switch (buttonID) {
                      case 0:
                          assertFileNameNotEmpty(name);
                          FileAction.renameFile(fileName,renameFile.directory,()=>FileTree.appendChilds(renameFile.node.parentNode));
                          break;
                      default:
                          // code
                  }
              }catch(e){
                  alert(e);
                  return -1;
              }
          }
      });
      
  };
  return renameFile;
}
function assertFileNameNotEmpty(fileName){
    if(fileName === "") throw "File name cannot be empty";
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
