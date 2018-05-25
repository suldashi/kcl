declare var require;
import * as uuidPackage from "uuid";
const uuid = uuidPackage.v4;
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

	public createComposite(pipelineId:string) {
		var message =this.newMessage("create");
		message.params = {
			type:"Composite",
			constructorParams: {
				mediaPipeline:pipelineId,
			}
		}
		return message;
	}

	public createHubPort(pipelineId:string) {
		var message =this.newMessage("create");
		message.params = {
			type:"HubPort",
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

	public processAnswerWebRTCEndpoint(answer:string,endpointId:string) {
		var message =this.newMessage("invoke");
		message.params = {
			operation:"processAnswer",
			object:endpointId,
			operationParams: {
				"answer":answer
			}
		}
		return message;
	}


	public generateOfferWebRTCEndpoint(endpointId:string) {
		var message =this.newMessage("invoke");
		message.params = {
			operation:"generateOffer",
			object:endpointId
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

	public registerConnectionStateChanged(webRTCEndpointId) {
		var message =this.newMessage("subscribe");
		message.params = {
			type:"ConnectionStateChanged",
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

	public setMinVideoSendBandwidth(sourceId:string,bitrate:number) {
		var message =this.newMessage("invoke");
		message.params = {
			operation:"setMinVideoSendBandwidth",
			object:sourceId,
			operationParams: {
				"minVideoSendBandwidth":bitrate
			}
		}
		return message;
	}

	public setMaxVideoSendBandwidth(sourceId:string,bitrate:number) {
		var message =this.newMessage("invoke");
		message.params = {
			operation:"setMaxVideoSendBandwidth",
			object:sourceId,
			operationParams: {
				"maxVideoSendBandwidth":bitrate
			}
		}
		return message;
	}

	public setMinVideoRecvBandwidth(sourceId:string,bitrate:number) {
		var message =this.newMessage("invoke");
		message.params = {
			operation:"setMinVideoRecvBandwidth",
			object:sourceId,
			operationParams: {
				"minVideoRecvBandwidth":bitrate
			}
		}
		return message;
	}

	public setMaxVideoRecvBandwidth(sourceId:string,bitrate:number) {
		var message =this.newMessage("invoke");
		message.params = {
			operation:"setMaxVideoRecvBandwidth",
			object:sourceId,
			operationParams: {
				"maxVideoRecvBandwidth":bitrate
			}
		}
		return message;
	}

	private newMessage(method:string):WSMessage {
		var message = new WSMessage();
		message.method = method;
		message.id=uuid();
		return message;
	}
}