import { LabelDisplayedRowsArgs } from "@mui/material";
import { ChangeEvent, MouseEvent, useCallback } from "react";
import { useIntl } from "react-intl";

/**
 * This is the pagination controller hook that can be used to manage the state of a table.
 */
export const useTableController = (onPaginationChange: (page: number, pageSize: number) => void, defaultPageSize?: number) => {
    const { formatMessage } = useIntl();
    const handleChangePage = useCallback(( // Create a callback to listen on changes of the table page.
        _event: MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        console.log(newPage);
        onPaginationChange(newPage++, defaultPageSize ?? 10);
    }, [onPaginationChange, defaultPageSize]);

    const handleChangePageSize = useCallback(( // Create a callback to listen on changes of the table page size.
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        onPaginationChange(0, parseInt(event.target.value, 10)); // Reset the current page to 1 on page size change to avoid overflow.
    }, [onPaginationChange]);

    const labelDisplay = useCallback(({ to, from, count, page }: LabelDisplayedRowsArgs) => { // Create a callback to display the paging labels with translations.
        return count !== -1 ?
            formatMessage({ id: "labels.paginationLabelNormal" }, { to, from, count, page }) :
            formatMessage({ id: "labels.paginationLabelOverflow" }, { to, from, page });
    }, [formatMessage]);

    return {
        labelDisplay,
        handleChangePage,
        handleChangePageSize
    };
}