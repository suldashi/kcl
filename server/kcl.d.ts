import { MediaPipeline } from "./mediaelement/mediapipeline";
import { MediaElement } from "./mediaelement/mediaelement";
import { WebRTCEndpoint } from "./mediaelement/webrtcendpoint";
import { PlayerEndpoint } from "./mediaelement/playerendpoint";
export declare class KCL {
    private messageFactory;
    private ws;
    private responseAdapter;
    constructor(wsAddress: string);
    ping(): Promise<any>;
    createPipeline(): Promise<MediaPipeline>;
    releaseElement(element: any): Promise<boolean>;
    connectSourceToSink(source: MediaElement, sink: MediaElement): Promise<boolean>;
    createPlayerEndpoint(mediaPipeline: MediaPipeline, filePath: any): Promise<PlayerEndpoint>;
    createWebRTCEndpoint(mediaPipeline: MediaPipeline): Promise<WebRTCEndpoint>;
    processOfferWebRTCEndpoint(offer: string, endpoint: WebRTCEndpoint): Promise<any>;
    processAnswerWebRTCEndpoint(answer: string, endpoint: WebRTCEndpoint): Promise<any>;
    generateOfferWebRTCEndpoint(endpoint: WebRTCEndpoint): Promise<any>;
    playPlayerEndpoint(player: PlayerEndpoint): Promise<boolean>;
    addIceCandidate(webRTCEndpoint: any, iceCandidate: any): Promise<boolean>;
    gatherIceCandidates(webRTCEndpoint: any): Promise<boolean>;
    registerIceCandidateFound(webRTCEndpoint: any, callback: any): Promise<boolean>;
}
