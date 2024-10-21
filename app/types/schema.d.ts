export interface Schema {
	name: string;
	type: string;
	label: string;
	help?: string;
	options?: {
		value: string;
		label: string;
	}[];
	required?: boolean;
	unique?: boolean;
	pattern?: string;
	groupBy?: string[];
	ignores?: string[];
	placeholder?: string;
	row?: number;
	readOnly?: boolean;
	message?: string;
	accept?: string;
	preview?: boolean;
	schema?: Schema;
}