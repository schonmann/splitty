#! /usr/bin/env node
require('shelljs/global');
rm('-rf','bin/nodeit')
//cp('-Rf', '_editor/*', 'bin/_editor');
cp('-Rf','index.js','bin/nodeit')
