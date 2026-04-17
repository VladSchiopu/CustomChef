import { useIntl } from "react-intl";
import { isUndefined } from "lodash";
import { TablePagination } from "@mui/material";
import { DataLoadingContainer } from "../../LoadingDisplay";
import { useUserTableController } from "./UserTable.controller";
import { UserDto } from "@infrastructure/apis/client";
import { UserAddDialog } from "../../Dialogs/UserAddDialog";
import {DataTable} from "@presentation/components/ui/Tables/DataTable";

/**
 * This hook returns a header for the table with translated columns.
 */
const useHeader = (): { key: keyof UserDto, name: string, order: number }[] => {
    const { formatMessage } = useIntl();

    return [
        { key: "username", name: formatMessage({ id: "globals.name" }), order: 1 },
        { key: "email", name: formatMessage({ id: "globals.email" }), order: 2 },
        { key: "roles", name: formatMessage({ id: "globals.role" }), order: 3 }
    ]
};

/**
 * Creates the user table.
 */
export const UserTable = () => {
    const { formatMessage } = useIntl();
    const header = useHeader();
    const { handleChangePage, handleChangePageSize, pagedData, isError, isLoading, tryReload, labelDisplay } = useUserTableController(); // Use the controller hook.

    return <DataLoadingContainer isError={isError} isLoading={isLoading} tryReload={tryReload}> {/* Wrap the table into the loading container because data will be fetched from the backend and is not immediately available.*/}
        <UserAddDialog /> {/* Add the button to open the user add modal. */}
        {!isUndefined(pagedData) && !isUndefined(pagedData?.totalElements) && !isUndefined(pagedData?.number) && !isUndefined(pagedData?.size) &&
            <TablePagination // Use the table pagination to add the navigation between the table pages.
                component="div"
                count={pagedData.totalElements} // Set the entry count returned from the backend.
                page={pagedData.totalPages !== 0 ? pagedData.number ?? 0 : 0} // Set the current page you are on.
                onPageChange={handleChangePage} // Set the callback to change the current page.
                rowsPerPage={pagedData.size} // Set the current page size.
                onRowsPerPageChange={handleChangePageSize} // Set the callback to change the current page size. 
                labelRowsPerPage={formatMessage({ id: "labels.itemsPerPage" })}
                labelDisplayedRows={labelDisplay}
                showFirstButton
                showLastButton
            />}

        <DataTable data={pagedData?.content ?? []}
                   header={header}
        />
    </DataLoadingContainer >
}