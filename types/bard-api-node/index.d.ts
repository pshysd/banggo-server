declare module 'bard-api-node' {
	declare class BardAPI {
		timeout: number;
		proxies: null | any;
		conversation_id: string;
		response_id: string;
		choice_id: string;
		session: any; // You might need to import the axios types for a more precise type definition
		params: {
			bl: string;
			_reqid: string;
			rt: string;
		};
		data: {
			'f.req': string;
			at: string;
		};
		post_url: string;

		setSession(key?: string, apiKey?: string): Promise<void>;

		setParamsAndData(req_id: string, input_text_struct: any): void;

		getBardResponse(input_text: string): Promise<any>;

		setSnim0e(): Promise<void>;
	}

	export = BardAPI;
}
