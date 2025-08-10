import type { INodeTypeBaseDescription, IVersionedNodeType } from 'n8n-workflow';
import { VersionedNodeType } from 'n8n-workflow';

import { HtmlValidationV1 } from './v1/HtmlValidationV1.node';

export class HtmlValidation extends VersionedNodeType {
	constructor() {
		const baseDescription: INodeTypeBaseDescription = {
			displayName: 'HTML Validation',
			name: 'htmlValidation',
			icon: 'file:HtmlValidation.svg',
			group: ['transform'],
			subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
			description: 'Validates user-provided HTML content',
			defaultVersion: 1,
		};

		const nodeVersions: IVersionedNodeType['nodeVersions'] = {
			1: new HtmlValidationV1(baseDescription),
		};

		super(nodeVersions, baseDescription);
	}
}
