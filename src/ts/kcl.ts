import {MessageFactory} from "./message/messagefactory";
import {ResponseAdapter} from "./message/responseadapter";
import {WSChannel} from "./ws/wschannel";
import {MediaPipeline} from "./mediaelement/mediapipeline";
import {MediaElement} from "./mediaelement/mediaelement";
import {WebRTCEndpoint} from "./mediaelement/webrtcendpoint";
import {PlayerEndpoint} from "./mediaelement/playerendpoint";

export class KCL {
	private messageFactory:MessageFactory;
	private ws:WSChannel;
	private responseAdapter:ResponseAdapter;
	
	constructor(wsAddress:string) {
		this.messageFactory = new MessageFactory();
	    this.ws = new WSChannel(wsAddress);
	    this.responseAdapter = new ResponseAdapter();
	}

	public async ping() {
		var message = this.messageFactory.createPing();
		return this.ws.send(message);
	}

	
	public async createPipeline() {
		var message = this.messageFactory.createPipeline();
		let result = await this.ws.send(message)
		var pipelineId = this.responseAdapter.createPipelineSuccess(result);
		return new MediaPipeline(pipelineId,this);
	}

	public async releaseElement(element) {
		var message = this.messageFactory.releaseElement(element.id);
		let result = await this.ws.send(message);
		return true;
	}

	public async connectSourceToSink(source:MediaElement,sink:MediaElement) {
		var message = this.messageFactory.connectSourceToSink(source.id,sink.id);
		let result = await this.ws.send(message);
		var connectSourceToSinkMessageResult = this.responseAdapter.connectSourceToSink(result);
		if(connectSourceToSinkMessageResult.success) {
			return true;
		}
		else {
			throw connectSourceToSinkMessageResult.result;
		}
	}

	public async createPlayerEndpoint(mediaPipeline:MediaPipeline,filePath) {
		var message = this.messageFactory.createPlayerEndpoint(mediaPipeline.id,filePath);
		let result = this.ws.send(message)
		var playerEndpointId = this.responseAdapter.createPlayerEndpointSuccess(result);
		return new PlayerEndpoint(playerEndpointId,this);
	}

	public async createWebRTCEndpoint(mediaPipeline:MediaPipeline) {
		var message = this.messageFactory.createWebRTCEndpoint(mediaPipeline.id);
		let result = await this.ws.send(message)
		var webRTCEndpointId = this.responseAdapter.createWebRTCEndpointSuccess(result);
		return new WebRTCEndpoint(webRTCEndpointId,this);
	}

	public async processOfferWebRTCEndpoint(offer:string,endpoint:WebRTCEndpoint) {
		var message = this.messageFactory.processOfferWebRTCEndpoint(offer,endpoint.id);
		let result = await this.ws.send(message);
		var processOfferMessageResult = this.responseAdapter.processOfferWebRTCEndpoint(result);
		if(processOfferMessageResult.success) {
			var processOfferSuccess = this.responseAdapter.processOfferSuccess(result);
			return processOfferSuccess;
		}
		else {
			throw processOfferMessageResult.result;
		}
	}

	public async playPlayerEndpoint(player:PlayerEndpoint) {
		var message = this.messageFactory.playPlayerEndpoint(player.id);
		let result = this.ws.send(message)
		var playMessageResult = this.responseAdapter.playPlayerEndpoint(result);
		if(playMessageResult.success) {
			return true;
		}
		else {
			throw playMessageResult.result;
		}
	}

	public async addIceCandidate(webRTCEndpoint,iceCandidate) {
		var message = this.messageFactory.addIceCandidate(webRTCEndpoint.id,iceCandidate);
		let result = await this.ws.send(message)
		return true;
	}

	public async gatherIceCandidates(webRTCEndpoint) {
		var message = this.messageFactory.gatherIceCandidates(webRTCEndpoint.id);
		let result = await this.ws.send(message);
		return true;
	}

	public async registerIceCandidateFound(webRTCEndpoint,callback) {
		var message = this.messageFactory.registerIceCandidateFound(webRTCEndpoint.id);
		this.ws.on(webRTCEndpoint.id,"IceCandidateFound",callback);
		let result = await this.ws.send(message);
		return true;
	}

	
}
declare var module;
if(typeof window !== "undefined") {
	window['KCL'] = KCL;	
}
else {
	module.exports = KCL;
}