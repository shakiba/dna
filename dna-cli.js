#!/usr/bin/env node

var path = require('path');
var fs = require('fs');
var dna = require('./dna');

if (process.argv.length >= 3) {
  var content = fs.readFileSync(process.argv[2], 'utf8');
  content = dna.parse(content);
  content = JSON.stringify(content, null, ' ');
  console.log(content);
  
} else {
  console.log('Invalid arguments!');
}
