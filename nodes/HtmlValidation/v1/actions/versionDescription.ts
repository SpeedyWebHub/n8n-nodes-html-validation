/* eslint-disable n8n-nodes-base/node-filename-against-convention */
import { NodeConnectionType, type INodeTypeDescription } from 'n8n-workflow';

export const versionDescription: INodeTypeDescription = {
	properties: [
		{
			displayName: 'Resource',
			name: 'resource',
			type: 'options',
			options: [
				{
					name: 'Validator',
					value: 'validator',
				},
			],
			default: 'validator',
			noDataExpression: true,
			required: true,
			description: 'Use validator to perform validation of data',
		},
		{
			displayName: 'Operation',
			name: 'operation',
			type: 'options',
			displayOptions: {
				show: {
					resource: [
						'validator',
					],
				},
			},
			options: [
				{
					name: 'Validate HTML',
					value: 'Validate HTML',
					description: 'Perform a HTML validation',
					action: 'Obtain result of a HTML validation',
				}
			],
			default: 'Validate HTML',
			noDataExpression: true,
		},
		{
			displayName: 'Html',
			name: 'html',
			type: 'string',
			required: true,
			displayOptions: {
				show: {
					operation: [
						'Validate HTML',
					],
					resource: [
						'validator',
					],
				},
			},
			default:'',
			placeholder: '<p>Hello world!</p>',
			description:'HTML content for validation',
		},
		{
			displayName: 'Additional Fields',
			name: 'additionalFields',
			type: 'collection',
			placeholder: 'Add Field',
			default: {},
			displayOptions: {
				show: {
					resource: [
						'validator',
					],
					operation: [
						'Validate HTML',
					],
				},
			},
			options: [
				{
					displayName: 'Reject Empty String',
					name: 'rejectEmptyString',
					type: 'boolean',
					default: false,
				},
				{
					displayName: 'Require At Least One Tag',
					name: 'requireAtLeastOneTag',
					type: 'boolean',
					default: false,
				},
			],
		},
	],
	displayName: 'HTML Validation',
	name: 'html-validation',
	icon: 'file:HtmlValidation.svg',
	group: ['transform'],
	version: 1,
	description: 'Validate user-provided HTML content',
	defaults: {
		name: 'HTML Validation',
	},
	inputs: [NodeConnectionType.Main],
	outputs: [NodeConnectionType.Main],
	credentials: [],
};
