import { WSMessage } from "./wsmessage";
export declare class MessageFactory {
    createPing(): WSMessage;
    createPipeline(): WSMessage;
    releaseElement(elementId: any): WSMessage;
    addIceCandidate(webRTCEndpointId: any, candidate: any): WSMessage;
    createPlayerEndpoint(pipelineId: string, filePath: any): WSMessage;
    createWebRTCEndpoint(pipelineId: string): WSMessage;
    createComposite(pipelineId: string): WSMessage;
    createHubPort(pipelineId: string): WSMessage;
    playPlayerEndpoint(playerId: string): WSMessage;
    processOfferWebRTCEndpoint(offer: string, endpointId: string): WSMessage;
    processAnswerWebRTCEndpoint(answer: string, endpointId: string): WSMessage;
    generateOfferWebRTCEndpoint(endpointId: string): WSMessage;
    registerIceCandidateFound(webRTCEndpointId: any): WSMessage;
    registerConnectionStateChanged(webRTCEndpointId: any): WSMessage;
    gatherIceCandidates(webRTCEndpointId: any): WSMessage;
    connectSourceToSink(sourceId: string, sinkId: string): WSMessage;
    setMinVideoSendBandwidth(sourceId: string, bitrate: number): WSMessage;
    setMaxVideoSendBandwidth(sourceId: string, bitrate: number): WSMessage;
    setMinVideoRecvBandwidth(sourceId: string, bitrate: number): WSMessage;
    setMaxVideoRecvBandwidth(sourceId: string, bitrate: number): WSMessage;
    private newMessage(method);
}
