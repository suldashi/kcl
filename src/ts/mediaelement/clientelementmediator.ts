import {KCL} from "../kcl";
import {MediaPipeline} from "./mediapipeline";
import {MediaElement} from "./mediaelement";
import {PlayerEndpoint} from "./playerendpoint";
import {WebRTCEndpoint} from "./webrtcendpoint";
export class ClientElementMediator {
	private client:KCL;
	constructor(client:KCL) {
	    this.client = client;
	}

	public createPlayerEndpoint(pipeline:MediaPipeline,filePath:string):Promise<any> {
		return this.client.createPlayerEndpoint(pipeline,filePath);
	}

	public createWebRTCEndpoint(pipeline:MediaPipeline):Promise<any> {
		return this.client.createWebRTCEndpoint(pipeline);
	}

	public playPlayerEndpoint(player:PlayerEndpoint):Promise<any> {
		return this.client.playPlayerEndpoint(player);
	}

	public processOfferWebRTCEndpoint(offer:string,endpoint:WebRTCEndpoint) {
		return this.client.processOfferWebRTCEndpoint(offer,endpoint);
	}

	public connectSourceToSink(source:MediaElement,sink:MediaElement) {
		return this.client.connectSourceToSink(source,sink);
	}

	public addIceCandidate(webRTCEndpoint,candidate) {
		return this.client.addIceCandidate(webRTCEndpoint,candidate);
	}

	public registerIceCandidateFound(webRTCEndpoint,callback) {
		return this.client.registerIceCandidateFound(webRTCEndpoint,callback);
	}

	public gatherIceCandidates(webRtcEndpoint) {
		return this.client.gatherIceCandidates(webRtcEndpoint);
	}

	public releaseElement(element) {
		return this.client.releaseElement(element);
	}
	
}