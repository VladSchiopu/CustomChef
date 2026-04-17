import { CircularProgress, Container, Typography } from "@mui/material";
import { useIntl } from 'react-intl';

/**
 * This component is used in the DataLoadingContainer to show a circular progress when a query to the backend is executing.
 */
export const DataLoading = () => {
    const { formatMessage } = useIntl();

    return <Container>
        <CircularProgress />
        <Typography>{formatMessage({ id: "globals.loading" })}</Typography>
    </Container>
}