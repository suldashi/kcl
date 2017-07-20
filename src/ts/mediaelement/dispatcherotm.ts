import {MediaElement} from "./mediaelement";
import {ClientElementMediator} from "./clientelementmediator";
export class DispatcherOTM extends MediaElement {
	constructor(id:string,mediator:ClientElementMediator) {
	    super(id,mediator);
	}
}