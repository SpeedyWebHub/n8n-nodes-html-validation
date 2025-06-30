import {
	IDataObject,
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

// TODO make sure there are no runtime dependencies (n8n community node guidelines)
// TODO isn't .htmlvalidate.json read from filesystem, which would violate n8n's community node guidelines?
// TODO fullfill/verify other n8n community node guidelines requirements

// TODO move to actions (like in Mattermost node: https://github.com/n8n-io/n8n/blob/master/packages/nodes-base/nodes/Mattermost/v1/actions/user/index.ts)
import { HtmlValidate } from "html-validate";
const htmlvalidate = new HtmlValidate();

import LanguageDetect from 'languagedetect';
const spokenLanguageDetector = new LanguageDetect();

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
							if (html === undefined || html === null) {
								throw new NodeOperationError(this.getNode(), 'HTML content is required for validation!', {
									itemIndex: i,
								});
							}
							const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
							//const rejectEmptyString = this.getNodeParameter('rejectEmptyString', i, false) as boolean;
							//const requireAtLeastOneTag = this.getNodeParameter('requireAtLeastOneTag', i, false) as boolean;
							const rejectEmptyString = additionalFields.rejectEmptyString as boolean ?? false;
							const requireAtLeastOneTag = additionalFields.requireAtLeastOneTag as boolean ?? false;
							if (rejectEmptyString && html.trim() === '') {
								itemData = {
									ok: false,
									error: 'HTML content cannot be an empty string or consist only of spaces!',
								};
							} else if (requireAtLeastOneTag && !/<[^>]+>/.test(html)) {
								itemData = {
									ok: false,
									error: 'HTML content must contain at least one tag!',
								};
							} else {
								// Validate HTML
								const validationReport = await htmlvalidate.validateString(html);
								itemData = {
									ok: validationReport.valid === true,
									rejectEmptyString,
									report: validationReport,
								};
							}
							break;
						}
						case 'Validate spoken language': {
							const text = this.getNodeParameter('Probe Text', i) as string;
							const targetLanguage = this.getNodeParameter('Target Language', i) as string;
							const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
							//const allowEmpty = this.getNodeParameter('allowEmpty', i, false) as boolean;
							const allowEmpty = additionalFields.allowEmpty as boolean ?? true;
							if (text === undefined || text === null) {
								throw new NodeOperationError(this.getNode(), 'Text content is required for spoken language validation!', {
									itemIndex: i,
								});
							}
							if (!allowEmpty && text.trim() === '') {
								itemData = {
									text,
									ok: false,
									error: 'Text content cannot be an empty string or consist only of spaces!',
								};
							} else {
								const result = spokenLanguageDetector.detect(text);
								const isOk = Array.isArray(result) && result[0] && Array.isArray(result[0]) ? result[0][0] === targetLanguage : false;
								//itemData = { valid: true, text };
								itemData = {
									text,
									ok: isOk,
									result
								}
							}
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
