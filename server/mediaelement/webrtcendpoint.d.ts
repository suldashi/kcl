import { MediaElement } from "./mediaelement";
import { KCL } from "../kcl";
export declare class WebRTCEndpoint extends MediaElement {
    constructor(id: string, client: KCL);
    processOffer(offer: string): Promise<any>;
    processAnswer(answer: string): Promise<any>;
    generateOffer(offer: string): Promise<any>;
    addIceCandidate(candidate: any): Promise<boolean>;
    registerIceCandidateFound(callback: any): Promise<boolean>;
    registerConnectionStateChanged(callback: any): Promise<boolean>;
    gatherIceCandidates(): Promise<boolean>;
    setMinVideoSendBandwidth(bitrate: any): Promise<any>;
    setMaxVideoSendBandwidth(bitrate: any): Promise<any>;
    setMinVideoRecvBandwidth(bitrate: any): Promise<any>;
    setMaxVideoRecvBandwidth(bitrate: any): Promise<any>;
}
