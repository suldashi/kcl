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
		return this.client.createPlayerEndpoint(this,filePath);
	}

	public async createWebRTCEndpoint() {
		return this.client.createWebRTCEndpoint(this);
	}

	public release() {
		return this.client.releaseElement(this);
	}
}