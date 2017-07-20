import {MediaElement} from "./mediaelement";
import {PlayerEndpoint} from "./playerendpoint";
import {WebRTCEndpoint} from "./webrtcendpoint";
import {ClientElementMediator} from "./clientelementmediator";

export class MediaPipeline {
	readonly id:string;
	public mediaElements:Array<MediaElement>;
	private mediator:ClientElementMediator;
	constructor(id:string, mediator:ClientElementMediator) {
	    this.id = id;
	    this.mediator = mediator;
	    this.mediaElements = new Array<MediaElement>();
	}

	public createPlayerEndpoint(filePath:string) {
		var p = this.mediator.createPlayerEndpoint(this,filePath);
		var mediator = this.mediator;
		return p.then((result) => {
			var playerEndpoint = new PlayerEndpoint(result,mediator);
			this.mediaElements.push(playerEndpoint);
			return playerEndpoint;
		});
	}

	public createWebRTCEndpoint() {
		var p = this.mediator.createWebRTCEndpoint(this);
		var mediator = this.mediator;
		return p.then((result) => {
			var webRtcEndpoint = new WebRTCEndpoint(result,mediator);
			this.mediaElements.push(webRtcEndpoint);
			return webRtcEndpoint;
		});
	}

	public release() {
		return this.mediator.releaseElement(this);
	}
}