#! /usr/bin/env node
var fs           = require("fs");
var sys          = require('sys');
require('shelljs/global');
//var path =pwd()+"/app/index/tree.txt";
var path="tree.txt"
var indexed_document = {};
var lines = [];
var root = null;
fs.readFile(path, "utf-8", (err, data) => {
    //hashDocuments(data);
    root = prefixTree(data);
    //root.print();
    console.log("pronto");
});





var stdin = process.openStdin();

stdin.addListener("data", function(d) {
    // note:  d is an object, and when converted to a string it will
    // end with a linefeed.  so we (rather crudely) account for that  
    // with toString() and then trim() 
    var term =  d.toString().trim();
    console.log("you entered: [" + 
        term+ "]");
    
    console.log(find(term,root));
    //console.log(getLines(term));
});

function find(str, root){
    //console.log("buscando: " + str);
    //console.log(root.word())
    if(str === "") {
      //console.log("ACHOU"); 
      console.log(root.char);
      //console.log(root.parent);    
      return [root.data];  
    } 
    var r = [];
    for(var i = 0; i < root.childs.length; i++){
        var child = root.childs[i];
       // console.log(child.char + "  == " + str[0]);        
        if(child.char == str[0]){
            //console.log("Bateu o caracter: " + str[0] + "  " + child.char);
            //console.log(child);
            //console.log(child.word());
           r = r.concat(find(str.substr(1),child));
           
        }
    }
    console.log(r);
    return r;
}


function prefixTree(data){
    var root = new Node("","","");
    var current = root;
    lines = data.split("\n");
    var folder = "";
    for(var i = 0; i < lines.length; i = i + 1){
        var line = lines[i];
        current = root;
        //console.log(line);
        //current.print(" ");       
        if(line.endsWith(":")){
            folder = line.replace(":","");
        }
        for(var y=0; y < line.length; y++){
            var char = line.charAt(y);
             var beforeLast = null;
            if(y > 0){
               beforeLast = line.charAt(y-1);
            }           
            //console.log("y = " + y + "   " + char + " " + beforeLast + "  " + line);
            var node = new Node(char,beforeLast,folder+"/"+line);            
            current = current.addChild(node);
            
        }
    }
    return root;
};

function hashDocuments(data){
    lines = data.split("\n");
    for(var i = 0; i < lines.length; i = i + 1){
        var parts = lines[i].split("/");
        if(parts === null) parts = [lines[i]];
        for(var y=0; y < parts.length; y++){
            var index = parts[y];
            if(typeof(indexed_document[index]) === "undefined"){
                indexed_document[index] = [];
            }
            indexed_document[index].push(i)
        }        
    }
}




function getLines(term){    
    var found = indexed_document[term];
    var result = [];
    found.forEach(function(elem){
        result.push(lines[elem]);
    });
    return result;
}

function getLocation(term){    
    var found = indexed_document[term];    
    return found;
}

function innerArray(a,b){
    var map = {};   
    if(typeof(a)==="array")
    a.forEach(function(elem){
        map[elem] = 1
    });
    
    b.forEach(function(elem){
        if(map[elem]){
            map[elem] = 2
        }
    })
    var inner =[]
   // console.log(map);
    for(key in map){
        if(map[key] == 2){
            inner.push(key)
        }
    }
    return inner;
}



function Node(_char, _charParent, _data){
    this.char = _char;
    this.parent = null;
    this.charParent = _charParent;
    this.childs = [];
    this.data = _data
    
    this.word = function(){
        if(this.parent == null) return this.char;       
        return this.parent.word() + this.char;
    }
    
    this.addChild = function(_child){
        var hasParent = false;
        var parent = this;
        for(var i = 0; i < this.childs.length; i = i + 1){
            var child = this.childs[i];
            if(child.char === _child.char){
                //console.log("ja existe um filho q e pai dessa cara")
                //_child.parent = child;
                //child.childs.push(_child);
                hasParent = true;                
                parent = child;
                return parent;
            }
        }
       
        if(!hasParent){
            _child.parent = this;
            this.childs.push(_child);           
        }
        return parent;
    }
    
    this.print = function(space){
       
       
        if(this.childs.length > 0){
            this.childs.forEach((child)=>{ 
               // console.log(space + "=======================================");
                child.print(space+" ");
             //    console.log(space + "=======================================")
            })    
        }
        //console.log(space + "" +this.word());
        console.log(this.word() + "    ||||||||||||||    " + this.data);
        
    }
    
};