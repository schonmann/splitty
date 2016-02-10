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
        self.root.label = NodeIT.config().host_path + "/";
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
        console.log(node);
        console.log("open: " + node.toPath());
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
