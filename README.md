## DNA

**DNA is a human-readable data format, inspired by XML, JSON and Properties files and similar to YAML and Jade, with improved readability.**

You can use this package to parse and stringify DNA format in JavaScript or Node.js or convert DNA to JSON from command line.

##### Node.js

###### Usage
```js
var object = DNA.parse(string);

var string = DNA.stringify(object);
```

###### Install
```
npm install dna-js --save
```

##### Command Line

###### Usage

```bash
dna json file.dna > file.json
```

###### Install
```
npm install dna-js -g
```

#### Example
An [example](./test/basic.dna) DNA file with JSON [conversion](./test/basic.json) are available in [/test](./test) directory.

#### License
Copyright (c) 2015 Ali Shakiba  
Available under the MIT license
