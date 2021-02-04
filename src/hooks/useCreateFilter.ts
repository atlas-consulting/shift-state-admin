import React from 'react';

export const useCreateFilter = (initialClauses = {}) => {
    const [from, setFrom] = React.useState("");
    const [forward, setForward] = React.useState("");
    const [subject, setSubject] = React.useState("");
    const clauseId = React.useRef(0);
    const [clauses, setClause] = React.useState<{ [k: number]: unknown }>(initialClauses);
    const addOrClause = () => {
        let newClauseId = clauseId.current++;
        setClause({
            ...clauses,
            [newClauseId]: { type: "OR", value: "", id: newClauseId }
        });
    };
    const addAndClause = () => {
        let newClauseId = clauseId.current++;
        setClause({
            ...clauses,
            [newClauseId]: { type: "AND", value: "", id: newClauseId }
        });
    };
    const updateClause = (id: number) => (e: HTMLInputElement) => {
        setClause({
            ...clauses,
            [id]: {
                ...(clauses[id] as object),
                value: e.target.value
            }
        });
    };
    const removeClaus = (id: number) => {
        const { [id]: _val, ...rest } = clauses;
        return setClause(rest);
    };
    const updateFrom = (e: HTMLInputElement) => setFrom(e.target.value);
    const updateForward = (e: HTMLInputElement) => setForward(e.target.value);
    const updateSubject = (e: HTMLInputElement) => setSubject(e.target.value);
    return {
        from,
        forward,
        subject,
        updateFrom,
        updateSubject,
        updateForward,
        clauses,
        addOrClause,
        addAndClause,
        updateClause,
        removeClaus
    };
};