## DNA

**DNA is a human readable data file format, it is inspired by XML, JSON, YAML, Jade and Properties file formats.**

You can use this package to convert DNA to JSON from command line or read DNA files in JavaScript or Node.js.

Command line:
```bash
dna json file.dna > file.json
```

JavaScript:
```js
var object = DNA.parse(string);
```

Install:
```
npm install -g dna-js
```

An example [DNA file](./test/basic.dna) and its [JSON convertion](./test/basic.json) are available in [/test](./test) directory.
