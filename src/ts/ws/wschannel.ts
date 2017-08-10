import {WSMessage} from "../message/wsmessage";
import {WS} from "./websocket";
declare var console;
export class WSChannel {
	private wsUrl:String = "192.168.56.101:8888";
	private ws;
	private messageListeners;
	private eventListeners;
	constructor(wsAddress) {
	    this.ws = new WS(wsAddress);
	    var t = this;
	    this.messageListeners = {};
	    this.eventListeners = {};
	    this.ws.onmessage = function(result) {
	    	var data = JSON.parse(result.data);	    	
	    	//normal responses
	    	if(data.method!="onEvent" && typeof data.error === "undefined") {
	    		var id = data.id;
		    	t.messageListeners[id]["resolve"](data);
		    	delete t.messageListeners[id];	
	    	}
	    	//errors
	    	else if(typeof data.error !== "undefined") {
	    		var id = data.id;
	    		t.messageListeners[id]["reject"](data);
	    		delete t.messageListeners[id];
	    	}
	    	//events
	    	else {
	    		var index = data.params.value.object + "|" + data.params.value.type;
	    		for(var i in t.eventListeners[index]) {
					t.eventListeners[index][i](data.params.value.data.candidate);
				}
	    	}
	    }
	}

	public on(objectId,methodName,callback) {
		var index = objectId+"|"+methodName;
		if(typeof this.eventListeners[index] === "undefined") {
			this.eventListeners[index] = [];
		}
		this.eventListeners[index].push(callback);
	}

	public send(data:WSMessage):Promise<any> {
		var id = data.id;
		var t = this;
		return new Promise((resolve,reject) => {
			try {
				t.ws.send(JSON.stringify(data));
				t.messageListeners[id] = {resolve:resolve,reject:reject};
			}
			catch(e) {
				reject(e);
			}
			setTimeout(()=>{
				reject("timeoutError");
				delete t.messageListeners[id];
			},10000);
		});
	}
}