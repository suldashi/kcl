import {MediaElement} from "./mediaelement";
import {ClientElementMediator} from "./clientelementmediator";
export class WebRTCEndpoint extends MediaElement {
	constructor(id:string,mediator:ClientElementMediator) {
	    super(id,mediator);
	}

	/*
	The offer must be a string. In browser JS, the string can be obtained from
	the RTCPeerConnection createOffer method and getting the sdp property from the result. Simplified example:

	var pc = new RTCPeerConnection();
	var offer = await pc.createOffer();
	var offerString = offer.sdp;

	offerString is what this method expects as input.
	This method returns the answer SDP string that should be sent to the client
	*/
	public processOffer(offer:string) {
		return this.mediator.processOfferWebRTCEndpoint(offer,this);
	}

	/*
	The candidate is an object with three properties:
	-candidate
	-sdpMid
	-sdpMLineIndex

	In browser JS, this object can be obtained from the onicecandidate event that the RTCPeerConnection object throws. Simplified example:

	var pc = new RTCPeerConnection();
	pc.onicecandidate = (e) => {
		client.sendIceCandidate(e.candidate);
	};

	In this example, the client object manages the connection to the server, and the sendIceCandidate method sends the candidate here.
	The e.candidate object is what this method expects as input.

	*/
	public addIceCandidate(candidate) {
		return this.mediator.addIceCandidate(this,candidate);
	}

	/*

	This method should be called and a callback registered to capture all ice candidates produced by the endpoint.
	It's a good idea to register the callback as soon as the endpoint is created to ensure none are missed.
	These candidates should be sent to the client counterpart using whatever channel is appropriate (WebSocket usually).

	*/
	public registerIceCandidateFound(callback) {
		return this.mediator.registerIceCandidateFound(this,callback);
	}

	/*

	This method starts producing the ice candidates from the endpoint. These candidates should be sent to the client counterpart.

	*/
	public gatherIceCandidates() {
		return this.mediator.gatherIceCandidates(this);
	}

	public release() {
		return this.mediator.releaseElement(this);
	}
}