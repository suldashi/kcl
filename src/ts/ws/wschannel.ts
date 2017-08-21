import {WSMessage} from "../message/wsmessage";
import * as MiniMQ from "minimq";
import {WS,wsOpts} from "./websocket";
declare var console;
export class WSChannel {
	private ws;
	private messageListeners;
	private eventListeners;
	private queue;
	constructor(wsAddress) {
		this.messageListeners = {};
	    this.eventListeners = {};

		this.queue = new MiniMQ();
		this.queue.handlerFunction = (el,prm,resolve,reject) => {
			try {
				this.ws.send(JSON.stringify(el));
				this.messageListeners[el.id] = {resolve:resolve,reject:reject};
			}
			catch(e) {
				reject(e);
			}
			setTimeout(()=>{
				reject("timeoutError");
				delete this.messageListeners[el.id];
			},10000);
		}

	    this.ws = new WS(wsAddress,undefined,wsOpts);
	    this.ws.onopen = () => {
	    	this.queue.openQueue();
	    };
	    this.ws.onclose = () => {
	    	this.queue.closeQueue();
	    }
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
					this.eventListeners[index][i](data.params.value);
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
		return this.queue.addElement(data);
	}
}