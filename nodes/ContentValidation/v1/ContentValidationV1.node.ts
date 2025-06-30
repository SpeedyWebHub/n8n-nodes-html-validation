import {
	//IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	//NodeConnectionType,
	IExecuteFunctions,
	//IHttpRequestOptions,
	INodeTypeBaseDescription,
	NodeOperationError,
} from 'n8n-workflow';

import { versionDescription } from './actions/versionDescription';

// TODO move to actions (like in Mattermost node: https://github.com/n8n-io/n8n/blob/master/packages/nodes-base/nodes/Mattermost/v1/actions/user/index.ts)
import { HtmlValidate } from "html-validate";
const htmlvalidate = new HtmlValidate();

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
			let itemData: any = {};
			switch (resource) {
				case 'validator':
					switch (operation) {
						case 'Validate HTML': {
							const html = this.getNodeParameter('html', i) as string;
							// Validate HTML
							const validationReport = await htmlvalidate.validateString(html);
							itemData = {
								report: validationReport
							};
							break;
						}
						case 'Validate spoken language': {
							const text = this.getNodeParameter('text', i) as string;
							// Placeholder for spoken language validation logic
							// For now, we just return the text as is
							//TODO replace with actual spoken language validation logic
							itemData = { valid: true, text };
							break;
						}
						default: {
							throw new NodeOperationError(this.getNode(), `Operation "${operation}" is not supported for resource "${resource}"!`);
						}
					}
					break;
				default: {
					throw new NodeOperationError(this.getNode(), `Resource "${resource}" is not supported!`);
				}
			}
		  returnData.push({ json: {
				itemIndex: i,
				...itemData
			} });
		}
		// Map data to n8n data structure
		return [this.helpers.returnJsonArray(returnData)];
	}
}
