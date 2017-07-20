export class ResponseAdapter {
	public pingSuccess(response):string {
		return this.getValue(response);
	}

	public pingFailure(response:any):string {
		return response.toString();
	}

	public createPipelineSuccess(response):string {
		return this.getValue(response);
	}

	public createPlayerEndpointSuccess(response):string {
		return this.getValue(response);
	}

	public createWebRTCEndpointSuccess(response):string {
		return this.getValue(response);
	}

	public createDispatcherOTMSuccess(response):string {
		return this.getValue(response);
	}

	public playPlayerEndpoint(response) {
		return this.operationError(response);
	}

	public processOfferWebRTCEndpoint(response) {
		return this.operationError(response);
	}

	public processOfferSuccess(response) {
		return this.getValue(response);
	}

	public connectSourceToSink(response) {
		return this.operationError(response);
	}

	public playPlayerEndpointFailure(reason:any) {
		return reason.error.message;
	}

	private getValue(response) {
		return response.result.value;
	}

	private operationError(response) {
		if(typeof response.error === "undefined")  {
			return {"success":true,"result":response.result};
		}
		else {
			return {"success":false,"result":response};
		}
	}
}