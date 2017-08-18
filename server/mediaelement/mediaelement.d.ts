import { KCL } from "../kcl";
export declare class MediaElement {
    readonly id: string;
    protected client: KCL;
    source: MediaElement;
    sink: MediaElement;
    constructor(id: string, client: KCL);
    connectToSink(target: MediaElement): Promise<this>;
}
