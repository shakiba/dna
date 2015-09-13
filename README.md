## DNA

DNA is human readable data file format, it is inspired by XML, JSON, YAML, Jade and Properties file formats.

You can use this package to read DNA files in JavaScript or Node.js or convert DNA to JSON from command line.

Command line:
```bash
dna json file.dna
```

JavaScript:
```js
var object = DNA.parse(string);
```

Install:
```
npm install -g dna-js
```

You can find a sample [DNA file](./test/basic.dna) and its [JSON convertion](./test/basic.json) in `/test` directory.
