import {WSMessage} from "../message/wsmessage";
import * as WS from "reconnecting-websocket";
declare var console;
export class WSChannel {
	private ws;
	private messageListeners;
	private eventListeners;
	constructor(wsAddress) {
	    this.ws = new WS(wsAddress);
	    this.ws.debug = true;
		this.ws.timeoutInterval = 5400;
	    this.messageListeners = {};
	    this.eventListeners = {};
	    this.ws.onmessage = (result) =>{
	    	var data = JSON.parse(result.data);	    	
	    	//normal responses
	    	if(data.method!="onEvent" && typeof data.error === "undefined") {
	    		var id = data.id;
		    	this.messageListeners[id]["resolve"](data);
		    	delete this.messageListeners[id];	
	    	}
	    	//errors
	    	else if(typeof data.error !== "undefined") {
	    		var id = data.id;
	    		this.messageListeners[id]["reject"](data);
	    		delete this.messageListeners[id];
	    	}
	    	//events
	    	else {
	    		var index = data.params.value.object + "|" + data.params.value.type;
	    		for(var i in this.eventListeners[index]) {
					this.eventListeners[index][i](data.params.value.data.candidate);
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