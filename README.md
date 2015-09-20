## DNA

DNA is a plain text, easy-to-read and write data format.

DNA format consists of a list of indented key-value pairs.
Objects (maps) are created by indenting key-values and lists (arrays) are created by repeating a key.
Multiline strings are supported as values.

DNA format was initially created to store static websites data, which is the DNA of a static website.
DNA is inspired by XML, JSON, Properties files and Markdown and is similar to YAML and Jade.

#### JavaScript

DNA JavaScript library provides `parse` and `stringify` functions (similar to JSON) to read and write DNA format.

```js
var object = DNA.parse(string);

var string = DNA.stringify(object);
```

##### Node.js (NPM)
DNA is available on NPM as `dna-js`.

###### Install
```
npm install dna-js --save
```

###### Usage
```js
var DNA = require('dna-js');
```

#### Command Line

DNA CLI can be used to convert DNA format to JSON.

###### Install
```
npm install dna-js -g
```

###### Usage
Run `dna` from command to see usage instructions.

#### License

Copyright (c) 2015 Ali Shakiba  
Available under the MIT license
