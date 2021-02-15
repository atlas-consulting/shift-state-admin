import { FilterClause } from "./state/modules/filters/types";

export interface FilterDefinition {
    from: string;
    subject: string;
    clauses: Record<string, FilterClause>
}

export function formatFilterConfiguration(filterDef: FilterDefinition) {
    return `from:(${filterDef.from}) ${filterDef.subject} ${Object.values(filterDef.clauses).reduce<string>((acc, clause) => acc + ` ${clause.type} ${clause.value}`, '')}`
}