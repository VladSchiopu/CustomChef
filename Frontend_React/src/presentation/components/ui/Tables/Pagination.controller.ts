import { useCallback, useState } from "react";

/**
 * This is the pagination controller hook that can be used to manage the state for paged entries.
 */
export const usePaginationController = () => {
    const [page, setPage] = useState(0); // Create a state for the current page.
    const [pageSize, setPageSize] = useState(10); // Create a state for the current page size.
    const setPagination = useCallback((newPage: number, newPageSize: number) => { // Create a callback to set both the current page and page size.
        setPage(newPage);
        setPageSize(newPageSize);
    }, [setPage, setPageSize]);

    return { // Return the state and its mutations.
        page,
        pageSize,
        setPage,
        setPageSize,
        setPagination
    }
}