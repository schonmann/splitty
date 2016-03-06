What is splitty?
====================
Splitty is a simple static file server with an embedded text editor based on ACE. Splitty aims to speed up the web development allowing the programmer to use de ACE editor on the left side and see the result on the right side of the same browser tab.

Requirements
====================
1. Node JS 4+
2. NPM


Installing from Source
====================
Download or clone the code of splitty and then execute the following steps:

        $ git clone https://github.com/shortty/splitty.git
        $ cd SPLITTY_PATH_DOWNLOAD
        $ npm install
        $ npm link

Installing from NPM
====================
        $ npm install [-g] splitty


Using
====================
Serving static files

        $ splitty [port=8000] [key=passphrase_AES_security]
            Put this key in the splitty editor...
            key: 9c4d43c0-c780-cba3-48ec-156e5d5417fd
            To open splitty editor go to
            http://localhost:8000/_editor?key=9c4d43c0-c780-cba3-48ec-156e5d5417fd&proportion=0

After run splitty your default web browser will be open at splitty editor url
After splitty is running, all the files in directory can be accessed in the browser
For example, if you have a file index.html at the root you can access http://localhost:8000/index.html


Open Splitty Editor

        $ splitty
Wait until splitty open your browser at splitty editor page


