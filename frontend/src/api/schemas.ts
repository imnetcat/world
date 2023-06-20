export type SchemaValue =
	| {
			type: string;
			[k: string]: unknown;
	  }
	| { fields: SchemaValue };

export type Schema = { fields: Record<string, SchemaValue> };
