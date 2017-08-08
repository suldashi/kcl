import {MediaElement} from "./mediaelement";
import {PlayerEndpoint} from "./playerendpoint";
import {WebRTCEndpoint} from "./webrtcendpoint";
import {KCL} from "../kcl";

export class MediaPipeline {
	readonly id:string;
	public mediaElements:Array<MediaElement>;
	private client:KCL;
	constructor(id:string, client:KCL) {
	    this.id = id;
	    this.client = client;
	    this.mediaElements = new Array<MediaElement>();
	}

	public async createPlayerEndpoint(filePath:string) {
		var result = await this.client.createPlayerEndpoint(this,filePath);
		var playerEndpoint = new PlayerEndpoint(result,this.client);
		this.mediaElements.push(playerEndpoint);
		return playerEndpoint;
	}

	public async createWebRTCEndpoint() {
		var result = await this.client.createWebRTCEndpoint(this);
		var webRtcEndpoint = new WebRTCEndpoint(result,this.client);
		this.mediaElements.push(webRtcEndpoint);
		return webRtcEndpoint;
	}

	public release() {
		return this.client.releaseElement(this);
	}
}