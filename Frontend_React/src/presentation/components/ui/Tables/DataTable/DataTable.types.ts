import Element = React.JSX.Element;

export type DataTableHeader<T> = {
    [TKey in keyof T]: {
        key: TKey;
        render?: (value: T[TKey], entry?: T) => Element;
        name: string;
        order: number
    };
}[keyof T][];

export type DataTableExtraHeader<T> = {
    key: string;
    render: (entry: T) => Element;
    name: string;
    order: number
}[];

export type DataTableProps<T> = {
    header: DataTableHeader<T>,
    extraHeader?: DataTableExtraHeader<T>,
    data: T[]
}