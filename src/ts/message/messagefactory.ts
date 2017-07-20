declare var require;
var guid = require("guid");
import {WSMessage} from "./wsmessage";

export class MessageFactory {

	public createPing() {
		var message = this.newMessage("ping");
		message.params = {
			interval:1000
		}
		return message;
	}

	public createPipeline() {
		var message = this.newMessage("create");
		message.params = {
			type:"MediaPipeline",
			constructorParams:{}
		};
		return message;
	}

	public createDispatcherOTM(pipelineId:string) {
		var message = this.newMessage("create");
		message.params = {
			type:"DispatcherOneToMany",
			constructorParams: {
				mediaPipeline:pipelineId,
			}
		};
		return message;
	}

	public releaseElement(elementId) {
		var message = this.newMessage("release");
		message.params = {
			object:elementId
		};
		return message;
	}

	public addIceCandidate(webRTCEndpointId,candidate) {
		var message = this.newMessage("invoke");
		message.params = {
			operation:"addIceCandidate",
			object:webRTCEndpointId,
			operationParams:{
				"candidate":candidate
			}
		};
		return message;
	}

	public createPlayerEndpoint(pipelineId:string,filePath) {
		var message =this.newMessage("create");
		message.params = {
			type:"PlayerEndpoint",
			constructorParams: {
				mediaPipeline:pipelineId,
				uri:filePath
			}
		}
		return message;
	}

	public createWebRTCEndpoint(pipelineId:string) {
		var message =this.newMessage("create");
		message.params = {
			type:"WebRtcEndpoint",
			constructorParams: {
				mediaPipeline:pipelineId,
			}
		}
		return message;
	}

	public playPlayerEndpoint(playerId:string) {
		var message =this.newMessage("invoke");
		message.params = {
			operation:"play",
			object:playerId,
			constructorParams: {}
		}
		return message;
	}

	public processOfferWebRTCEndpoint(offer:string,endpointId:string) {
		var message =this.newMessage("invoke");
		message.params = {
			operation:"processOffer",
			object:endpointId,
			operationParams: {
				"offer":offer
			}
		}
		return message;
	}

	public registerIceCandidateFound(webRTCEndpointId) {
		var message =this.newMessage("subscribe");
		message.params = {
			type:"IceCandidateFound",
			object:webRTCEndpointId,
		}
		return message;
	}

	public gatherIceCandidates(webRTCEndpointId) {
		var message =this.newMessage("invoke");
		message.params = {
			operation:"gatherCandidates",
			object:webRTCEndpointId,
		}
		return message;
	}

	public connectSourceToSink(sourceId:string,sinkId:string) {
		var message =this.newMessage("invoke");
		message.params = {
			operation:"connect",
			object:sourceId,
			operationParams: {
				"sink":sinkId
			}
		}
		return message;
	}

	private newMessage(method:string):WSMessage {
		var message = new WSMessage();
		message.method = method;
		message.id=guid.create().value;
		return message;
	}
}