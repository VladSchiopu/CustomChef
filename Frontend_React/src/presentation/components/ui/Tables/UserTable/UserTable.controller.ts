import { useTableController } from "../Table.controller";
import { useGetUsers } from "@infrastructure/apis/api-management";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { usePaginationController } from "../Pagination.controller";

/**
 * This is controller hook manages the table state including the pagination and data retrieval from the backend.
 */
export const useUserTableController = () => {
    const queryClient = useQueryClient(); // Get the query client.
    const { page, pageSize, setPagination } = usePaginationController(); // Get the pagination state.
    const { data, isError, isLoading, queryKey } = useGetUsers(page, pageSize); // Retrieve the table page from the backend via the query hook.

    const tryReload = useCallback(
        () => queryClient.invalidateQueries({ queryKey: [queryKey] }),
        [queryClient, queryKey]); // Create a callback to try reloading the data for the table via query invalidation.

    const tableController = useTableController(setPagination, data?.size); // Adapt the pagination for the table.

    return { // Return the controller state and actions.
        ...tableController,
        tryReload,
        pagedData: data ? data : undefined,
        isError,
        isLoading
    };
}