import { WSMessage } from "../message/wsmessage";
export declare class WSChannel {
    private ws;
    private messageListeners;
    private eventListeners;
    private queue;
    private debug;
    constructor(wsAddress: any, debug: any);
    on(objectId: any, methodName: any, callback: any): void;
    send(data: WSMessage): Promise<any>;
}
