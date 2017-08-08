import {MediaElement} from "./mediaelement";
import {KCL} from "../kcl";
export class PlayerEndpoint extends MediaElement {
	constructor(id:string,client:KCL) {
	    super(id,client);
	}

	public play() {
		return this.client.playPlayerEndpoint(this);
	}
}