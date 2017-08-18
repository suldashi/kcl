import { MediaElement } from "./mediaelement";
import { PlayerEndpoint } from "./playerendpoint";
import { WebRTCEndpoint } from "./webrtcendpoint";
import { KCL } from "../kcl";
export declare class MediaPipeline {
    readonly id: string;
    mediaElements: Array<MediaElement>;
    private client;
    constructor(id: string, client: KCL);
    createPlayerEndpoint(filePath: string): Promise<PlayerEndpoint>;
    createWebRTCEndpoint(): Promise<WebRTCEndpoint>;
    release(): Promise<boolean>;
}
