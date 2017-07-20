import {MessageFactory} from "./message/messagefactory";
import {ResponseAdapter} from "./message/responseadapter";
import {WSChannel} from "./ws/wschannel";
import {ClientElementMediator} from "./mediaelement/clientelementmediator";
import {MediaPipeline} from "./mediaelement/mediapipeline";
import {MediaElement} from "./mediaelement/mediaelement";
import {WebRTCEndpoint} from "./mediaelement/webrtcendpoint";
import {PlayerEndpoint} from "./mediaelement/playerendpoint";
import {DispatcherOTM} from "./mediaelement/dispatcherotm";

export class KCL {
	private messageFactory:MessageFactory;
	private commChannel:WSChannel;
	private mediator:ClientElementMediator;
	private responseAdapter:ResponseAdapter;
	
	constructor(wsAddress:string) {
		this.messageFactory = new MessageFactory();
	    this.commChannel = new WSChannel(wsAddress);
	    this.mediator = new ClientElementMediator(this);
	    this.responseAdapter = new ResponseAdapter();
	}

	public ping() {
		var message = this.messageFactory.createPing();
		return this.commChannel.send(message).then(function(result){
			return result;
		}).catch(function(reason){
			throw reason;
		});
	}

	
	public createPipeline() {
		var message = this.messageFactory.createPipeline();
		return this.commChannel.send(message).then((result) => {
			var pipelineId = this.responseAdapter.createPipelineSuccess(result);
			var pipeline = new MediaPipeline(pipelineId,this.mediator);
			return pipeline;
		}).catch((reason) => {
			throw reason;
		});
	}

	public createDispatcherOTM(mediaPipeline:MediaPipeline) {
		var message = this.messageFactory.createDispatcherOTM(mediaPipeline.id);
		return this.commChannel.send(message).then((result) => {
			var dispatcherOTMId = this.responseAdapter.createDispatcherOTMSuccess(result);
			var dispatcherOTM = new DispatcherOTM(dispatcherOTMId,this.mediator);
			return dispatcherOTM;
		}).catch((reason) => {
			throw reason;
		});
	}

	public releaseElement(element) {
		var message = this.messageFactory.releaseElement(element.id);
		return this.commChannel.send(message).then((result) => {
			return true;
		}).catch((reason) => {
			throw reason;	
		});
	}

	public connectSourceToSink(source:MediaElement,sink:MediaElement) {
		var message = this.messageFactory.connectSourceToSink(source.id,sink.id);
		return this.commChannel.send(message).then((result) => {
			var connectSourceToSinkMessageResult = this.responseAdapter.connectSourceToSink(result);
			if(connectSourceToSinkMessageResult.success) {
				return source;
			}
			else {
				throw connectSourceToSinkMessageResult.result;
			}
		}).catch((reason) => {
			throw reason;
		});
	}

	public createPlayerEndpoint(mediaPipeline:MediaPipeline,filePath) {
		var message = this.messageFactory.createPlayerEndpoint(mediaPipeline.id,filePath);
		return this.commChannel.send(message).then((result) => {
			var playerEndpointId = this.responseAdapter.createPlayerEndpointSuccess(result);
			return playerEndpointId;
		}).catch((reason)=>{
			throw reason;
		});
	}

	public createWebRTCEndpoint(mediaPipeline:MediaPipeline) {
		var message = this.messageFactory.createWebRTCEndpoint(mediaPipeline.id);
		return this.commChannel.send(message).then((result) => {
			var webRTCEndpointId = this.responseAdapter.createWebRTCEndpointSuccess(result);
			return webRTCEndpointId;
		}).catch((reason)=>{
			throw reason;
		});
	}

	public processOfferWebRTCEndpoint(offer:string,endpoint:WebRTCEndpoint) {
		var message = this.messageFactory.processOfferWebRTCEndpoint(offer,endpoint.id);
		return this.commChannel.send(message).then((result) => {
			var processOfferMessageResult = this.responseAdapter.processOfferWebRTCEndpoint(result);
			if(processOfferMessageResult.success) {
				var processOfferSuccess = this.responseAdapter.processOfferSuccess(result);
				return processOfferSuccess;
			}
			else {
				throw processOfferMessageResult.result;
			}
		}).catch((reason)=>{
			throw reason;
		});
	}

	public playPlayerEndpoint(player:PlayerEndpoint) {
		var message = this.messageFactory.playPlayerEndpoint(player.id);
		return this.commChannel.send(message).then((result) => {
			var playMessageResult = this.responseAdapter.playPlayerEndpoint(result);
			if(playMessageResult.success) {

				return player.id;
			}
			else {
				throw playMessageResult.result;
			}
		}).catch((reason) => {
			var parsedReason = this.responseAdapter.playPlayerEndpointFailure(reason);
			throw parsedReason;
		});
	}

	public addIceCandidate(webRTCEndpoint,iceCandidate) {
		var message = this.messageFactory.addIceCandidate(webRTCEndpoint.id,iceCandidate);
		return this.commChannel.send(message).then((result) => {
			return webRTCEndpoint;
		}).catch((reason) => {
			throw reason;
		});
	}

	public gatherIceCandidates(webRTCEndpoint) {
		var message = this.messageFactory.gatherIceCandidates(webRTCEndpoint.id);
		return this.commChannel.send(message).then((result) => {
			return webRTCEndpoint;
		}).catch((reason) => {
			throw reason;
		});
	}

	public registerIceCandidateFound(webRTCEndpoint,callback) {
		var message = this.messageFactory.registerIceCandidateFound(webRTCEndpoint.id);
		this.commChannel.on(webRTCEndpoint.id,"IceCandidateFound",callback);
		return this.commChannel.send(message).then((result) => {
			return webRTCEndpoint;
		}).catch((reason) => {
			throw reason;
		});
	}

	
}
if(typeof window !== "undefined") {
	window['KCL'] = KCL;	
}