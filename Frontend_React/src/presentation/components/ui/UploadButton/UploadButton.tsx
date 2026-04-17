import { Button, CircularProgress } from "@mui/material";
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import { useCallback } from "react";
import { UploadButtonProps } from "./UploadButton.types";

/**
 * This component is a button to upload a file and call the given callback when it is selected.
 */
export const UploadButton = (props: UploadButtonProps) => {
    const onUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || !event.target.files[0]) {
            return;
        }

        props.onUpload(event.target.files[0]);
    }, [props.onUpload]);

    return <div>
        <Button color="primary" variant="contained" component="label" disabled={props.disabled}>
            <CloudUploadOutlinedIcon fontSize="small" style={{ margin: "0.25rem" }} />
            {props.isLoading && <CircularProgress />}
            {props.text}
            <input hidden accept={props.acceptFileType} type="file" onChange={onUpload} />
        </Button>
    </div>;
};