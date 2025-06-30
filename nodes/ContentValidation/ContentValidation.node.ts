import type { INodeTypeBaseDescription, IVersionedNodeType } from 'n8n-workflow';
import { VersionedNodeType } from 'n8n-workflow';

import { ContentValidationV1 } from './v1/ContentValidationV1.node';

export class ContentValidation extends VersionedNodeType {
	constructor() {
		const baseDescription: INodeTypeBaseDescription = {
			displayName: 'Content Validation',
			name: 'contentValidation',
			icon: 'file:ContentValidation.svg',
			group: ['transform'],
			subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
			description: 'Validates user-provided content: HTML syntax, spoken language, and more',
			defaultVersion: 1,
		};

		const nodeVersions: IVersionedNodeType['nodeVersions'] = {
			1: new ContentValidationV1(baseDescription),
		};

		super(nodeVersions, baseDescription);
	}
}
