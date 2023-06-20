import { Filter, FilterTemplate, FilterTemplateNested, FilterTemplateConditional } from 'api/filter';

export const normalizeFilters = (filters: (Filter | FilterTemplate)[]): Filter[] =>
	filters.flatMap((filter) => {
		const { filters, condition } = filter as FilterTemplateConditional;
		if (filters !== undefined && condition !== undefined) {
			return condition ? normalizeFilters(filters) : []
		}

		const [field, value] = Object.entries(filter as FilterTemplateNested)[0];
		if (field === '$or' || field === '$and' || field === '$not') {
			return [{ [field]: normalizeFilters(value) } as Filter];
		}

		return [filter as Filter];
	});
