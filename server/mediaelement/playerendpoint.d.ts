import { MediaElement } from "./mediaelement";
import { KCL } from "../kcl";
export declare class PlayerEndpoint extends MediaElement {
    constructor(id: string, client: KCL);
    play(): Promise<boolean>;
}
