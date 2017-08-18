import { WSMessage } from "../message/wsmessage";
export declare class WSChannel {
    private ws;
    private messageListeners;
    private eventListeners;
    private queue;
    constructor(wsAddress: any);
    on(objectId: any, methodName: any, callback: any): void;
    send(data: WSMessage): Promise<any>;
}
