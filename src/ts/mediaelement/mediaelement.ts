import {ClientElementMediator} from "./clientelementmediator";
export class MediaElement {
	readonly id:string;
	protected mediator:ClientElementMediator;
	public source:MediaElement;
	public sink:MediaElement;
	constructor(id:string,mediator:ClientElementMediator) {
	    this.id = id;
	    this.mediator = mediator;
	}


	public connectToSink(target:MediaElement) {
		var t = this;
		return this.mediator.connectSourceToSink(this,target).then((result) => {
			t.sink = target;
			return t;
		});
	}
}