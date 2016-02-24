What is splitty?
====================
Splitty is a simple static file server with a embedded text editor based on ACE. Splitty is focused to speed up the web development allowing the programmer to use de ACE editor on the left side and see the result on the right side of the same browser tab.

Requirements
====================
1. Node JS 4+
2. NPM


Installing from Source
====================
Download or clone the code of nodeit and then execute the follow steps:
        $ git clone https://github.com/shortty/splitty.git
        $ cd SPLITTY_PATH_DOWNLOAD
        $ npm install
        $ npm link

Installing from NPM
====================
        $ npm install [-g] splitty


Using
====================
Serve static files

        $ splitty [port=8000] [key=passphrase_AES_security]
            Put this key in the splitty editor...
            key: 9c4d43c0-c780-cba3-48ec-156e5d5417fd

            
Copy the key string and put on the prompt of the splitty editor
After start all the files in directory can be 
accessed in the browser
For example, if you have a file index.html at the root you 
can access http://localhost:8000/index.html


Open Splitty Editor

        $ splitty
Open browser at http://localhost:8000/_editor

