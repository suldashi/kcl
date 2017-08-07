# kcl

## A promise-based client for the Kurento Media Server, for the browser or node.js

### Building

kcl uses _gulp_ as the task manager, and building kcl requires a global gulp installation. First, install gulp using `npm install -g gulp`, then install the npm packages using `npm install`.

To build kcl, run `gulp browser` for the browser version and `gulp server` for the Node.js version. The browser version will be located in the _/browser_ directory, and this can be added to any project and included in HTML by using `<script>` tags.

### Usage

To connect to a running KMS instance, run the following code:  
`var client = new KCL("ws://kmsserver.domain:8080/")`  
and replace kmsserver.domain with the hostname or IP of the KMS instance and 8080 with the IP of the KMS server.

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
    "id": 1,
    "result": {
        "value": "pong"
    },
    "jsonrpc": "2.0"
}
```

The existence of this response indicates a proper connection to the KMS.


License: MIT

[Copyright 2016 Ermir Suldashi](https://suldashi.com)