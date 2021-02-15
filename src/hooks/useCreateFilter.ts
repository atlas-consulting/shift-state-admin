import React, { ChangeEvent } from 'react';
import { FilterClause } from '../state/modules/filters/types';

export const useCreateFilter = (initialClauses = {}) => {
    const [description, setDescription] = React.useState("");
    const [from, setFrom] = React.useState("");
    const [forward, setForward] = React.useState("");
    const [subject, setSubject] = React.useState("");
    const clauseId = React.useRef(0);
    const [clauses, setClause] = React.useState<{ [k: number]: FilterClause }>(initialClauses);
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
    const updateClause = (id: number) => (e: ChangeEvent<HTMLInputElement>) => {
        setClause({
            ...clauses,
            [id]: {
                ...(clauses[id] as FilterClause),
                value: e.target.value
            }
        });
    };
    const removeClaus = (id: number) => {
        const { [id]: _val, ...rest } = clauses;
        return setClause(rest);
    };
    const updateDescription = (e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value);
    const updateFrom = (e: ChangeEvent<HTMLInputElement>) => setFrom(e.target.value);
    const updateForward = (e: ChangeEvent<HTMLInputElement>) => setForward(e.target.value);
    const updateSubject = (e: ChangeEvent<HTMLInputElement>) => setSubject(e.target.value);
    return {
        description,
        from,
        forward,
        subject,
        updateDescription,
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