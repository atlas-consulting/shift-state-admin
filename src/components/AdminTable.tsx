import React from "react";
import { Input, Table, Button, ButtonGroup } from "reactstrap";

type Unpacked<T> = T extends (infer U)[] ? U : T

interface AdminTableprops<D = Record<string, unknown>> {
    data: D[],
    filterProp: keyof D,
    idProp: keyof D,
    withSelected: <T>(selected: T) => unknown
}

export const AdminTable: React.FC<AdminTableprops> = ({ data = [], children, filterProp, idProp, withSelected }) => {
    const [filterText, setFilterText] = React.useState("");
    const [selectedElements, setSelected] = React.useState<{ isSelected?: boolean } & Unpacked<AdminTableprops['data']>>({});
    const toggleDataElement = (id: string) => {
        if (!!selectedElements[id]) {
            setSelected({ ...selectedElements, [id]: false });
        } else {
            setSelected({ ...selectedElements, [id]: true });
        }
    };
    const renderedList = React.useMemo(() => {
        return data
            .map((d) => ({ ...d, isSelected: !!selectedElements[d.id as string] }))
            // @ts-ignore
            .filter((d) => d[filterProp].includes(filterText));
    }, [selectedElements, data, filterText, filterProp]);
    const selectAll = () => {
        setSelected(data.reduce((acc, { [idProp]: id }) => ({ ...acc, [id as string]: true }), {}));
    };
    const deSelect = () => {
        setSelected(data.reduce((acc, { id }) => ({ ...acc, [id as string]: false }), {}));
    };
    const clearFilter = () => setFilterText("");
    return (
        <div className="p-4">
            <section>
                <Input
                    className="mb-2"
                    placeholder={`Search by ${filterProp}`}
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                />
                <Button className="mr-4" disabled={!Object.values(selectedElements).length} onClick={() => withSelected(Object.keys(selectedElements).map(parseFloat))}>Apply Filters</Button>
                <Button
                    style={{ marginRight: 16 }}
                    disabled={!filterText.trim()}
                    onClick={clearFilter}
                >
                    Clear Search
                </Button>
                <ButtonGroup>
                    <Button onClick={selectAll}>Select All</Button>
                    <Button onClick={deSelect}>Unselect All</Button>
                </ButtonGroup>
            </section>
            <Table className="table-hover">
                {/* @ts-ignore */}
                {children({
                    data: renderedList,
                    clearFilter,
                    toggleDataElement
                })}
            </Table>
        </div>
    );
};
