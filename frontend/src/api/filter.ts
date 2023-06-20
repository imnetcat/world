type CommonValue = string | number | boolean | Date | undefined;
type CommonValueArray = Array<string> | Array<number> | Array<boolean> | Array<Date>;

export type Filter = {
	$not: Filter[];
} | {
	$or: Filter[];
} | {
	$and: Filter[];
} | Record<
	string,
	{
		'=': CommonValue;
	} | {
		'!=': CommonValue;
	} | {
		'<=': CommonValue;
	} | {
		'>=': CommonValue;
	} | {
		'<': CommonValue;
	} | {
		'>': CommonValue;
	} | {
		$like: string;
	} | {
		$ilike: string;
	} | {
		$between: [(number | Date), (number | Date)];
	} | {
		$jsonilike: [Array<string>, string];
	} | {
		$contains: Array<string>;
	} | {
		$in: CommonValueArray;
	}
>

export type FilterTemplateNested = Omit<Filter, '$not' | '$or' | '$and'> & (
	{
		$not: (FilterTemplate | Filter)[];
	} | {
		$or: (FilterTemplate | Filter)[];
	} | {
		$and: (FilterTemplate | Filter)[];
	}
);

export type FilterTemplateConditional = {
	filters: (FilterTemplate | Filter)[];
	condition: boolean;
}

export type FilterTemplate = FilterTemplateNested | FilterTemplateConditional;
