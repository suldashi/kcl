export class WSMessage {
	public id:number;
	public method:string;
	public jsonrpc:string = "2.0";
	public params:Object;
}