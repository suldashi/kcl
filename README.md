# kcl

## A promise-based client for the Kurento Media Server, for the browser or Node.js

### Building

kcl uses _gulp_ as the task manager, and building kcl requires a global gulp installation.

1. (If not alreaady installed) Install gulp globally by running `npm install -g gulp`
2. Install the npm packages running `npm install`
3. Run `gulp browser` to build the browser version
4. Run `gulp server` to build the server version

### Installation

* Node.js: run `npm install --save kcl` to install from NPM.
* Browser: copy the `kcl.browser.js` script from the _/browser_ directory into a public directory, and link to it from your HTML file by using the `<script>` tag.

### Usage

In node, you can include KCL by using this statement: `const KCL = require("kcl");`

To connect to a running KMS instance, run the following code:
`var client = new KCL("ws://kmsserver.domain:8888/kurento")`  
and replace kmsserver.domain with the hostname or IP of the KMS instance and 8888 with the IP of the KMS server. The `/kurento` path is the default path that KMS listens to, if you have modified the settings and changed this path, change it here to match as well.

### Methods

**ping**  
Used to check the connectivity status with the server.  

Example usage:  
```
client.ping().then((response) => {
	console.log(response);
});
```

or if you want to use async syntax:

```
let response = await client.ping();
console.log(response);
```

The expected response should be a JSONRPC 2.0 object with a structure similar to this one:
```
{
    "id": "cf8a653d-e912-1404-9a84-bef9d191b8eb",
    "result": {
        "value": "pong"
    },
    "jsonrpc": "2.0"
}
```

The existence of this response indicates a proper connection to the KMS.


License: MIT

[Copyright 2016 Ermir Suldashi](https://suldashi.com)