export declare class ResponseAdapter {
    pingSuccess(response: any): string;
    pingFailure(response: any): string;
    createPipelineSuccess(response: any): string;
    createPlayerEndpointSuccess(response: any): string;
    createWebRTCEndpointSuccess(response: any): string;
    createCompositeSuccess(response: any): string;
    createHubPortSuccess(response: any): string;
    playPlayerEndpoint(response: any): {
        "success": boolean;
        "result": any;
    };
    processOfferWebRTCEndpoint(response: any): {
        "success": boolean;
        "result": any;
    };
    processAnswerWebRTCEndpoint(response: any): {
        "success": boolean;
        "result": any;
    };
    generateOfferWebRTCEndpoint(response: any): {
        "success": boolean;
        "result": any;
    };
    processOfferSuccess(response: any): any;
    processAnswerSuccess(response: any): any;
    generateOfferSuccess(response: any): any;
    connectSourceToSink(response: any): {
        "success": boolean;
        "result": any;
    };
    playPlayerEndpointFailure(reason: any): any;
    private getValue(response);
    private operationError(response);
}
