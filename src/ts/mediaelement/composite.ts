import {MediaElement} from "./mediaelement";
import {KCL} from "../kcl";
export class Composite extends MediaElement {
	constructor(id:string,client:KCL) {
	    super(id,client);
	}
}