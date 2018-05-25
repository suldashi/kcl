import {MediaElement} from "./mediaelement";
import {KCL} from "../kcl";
export class HubPort extends MediaElement {
	constructor(id:string,client:KCL) {
	    super(id,client);
	}
}