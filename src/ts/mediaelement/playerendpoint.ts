import {MediaElement} from "./mediaelement";
import {ClientElementMediator} from "./clientelementmediator";
export class PlayerEndpoint extends MediaElement {
	constructor(id:string,mediator:ClientElementMediator) {
	    super(id,mediator);
	}

	public play() {
		return this.mediator.playPlayerEndpoint(this);
	}
}