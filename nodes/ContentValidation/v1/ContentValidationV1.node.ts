import {
	//IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	//NodeConnectionType,
	IExecuteFunctions,
	//IHttpRequestOptions,
	INodeTypeBaseDescription
} from 'n8n-workflow';

import { versionDescription } from './actions/versionDescription';

export class ContentValidationV1 implements INodeType {

	description: INodeTypeDescription;

  constructor(baseDescription: INodeTypeBaseDescription) {
		this.description = {
			...baseDescription,
			...versionDescription
			//usableAsTool: true,
		};
	}

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		// Handle data coming from previous nodes
		const items = this.getInputData();
		const returnData = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		// Process each item
		for (let i = 0; i < items.length; i++) {
		  returnData.push({ json: {
				i,
				resource,
				operation,
			} });
		}
		// Map data to n8n data structure
		return [this.helpers.returnJsonArray(returnData)];
	}
}
