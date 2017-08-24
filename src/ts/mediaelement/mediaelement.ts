import {KCL} from "../kcl";
export class MediaElement {
	readonly id:string;
	protected client:KCL;
	public source:MediaElement;
	public sink:MediaElement;
	constructor(id:string,client:KCL) {
	    this.id = id;
	    this.client = client;
	}


	public async connectToSink(target:MediaElement) {
		let result = await this.client.connectSourceToSink(this,target)
		this.sink = target;
		return this;
	}

	public release() {
		return this.client.releaseElement(this);
	}
}