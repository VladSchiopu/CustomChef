import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {DataTableProps} from "./DataTable.types";

export function DataTable<T>(props: DataTableProps<T>) {
    const {header, extraHeader, data} = props;

    return <TableContainer component={Paper}>
        <Table>
            <TableHead>
                <TableRow>
                    {
                        header.map(e => {
                            return {
                                order: e.order,
                                key: String(e.key),
                                name: e.name
                            }
                        }).concat((extraHeader ?? []).map(e => {
                            return {
                                order: e.order,
                                key: e.key,
                                name: e.name
                            }
                        }))
                            .sort((a, b) => a.order - b.order)
                            .map(e => <TableCell key={`header_${String(e.key)}`}>{e.name}</TableCell>)
                    }
                </TableRow>
            </TableHead>
            <TableBody>
                {
                    data.map((entry, rowIndex) => <TableRow key={`row_${rowIndex + 1}`}>
                        {header.map(e => {
                            return {
                                order: e.order,
                                key: String(e.key),
                                element: (() => {
                                    const value = entry[e.key];

                                    if (e.render) {
                                    return e.render(value, entry);
                                    }

                                    if (Array.isArray(value)) {
                                    return value
                                        .map(v => typeof v === "object" ? (v as any).name ?? JSON.stringify(v) : v)
                                        .join(", ");
                                    }

                                    if (typeof value === "object" && value !== null) {
                                    return JSON.stringify(value);
                                    }

                                    return value?.toString();
                                })()
                                };
                            
                        }).concat((extraHeader ?? []).map(e => {
                            return {
                                order: e.order,
                                key: e.key,
                                element: e.render(entry)
                            }
                        }))
                            .sort((a, b) => a.order - b.order)
                            .map((keyValue) => <TableCell key={`cell_${rowIndex + 1}_${String(keyValue.key)}`}>{
                                keyValue.element
                            }</TableCell>)}
                    </TableRow>)
                }
            </TableBody>
        </Table>
    </TableContainer>
}