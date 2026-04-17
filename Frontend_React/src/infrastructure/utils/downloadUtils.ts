import { isEmpty, isUndefined } from "lodash";
import { toast } from "react-toastify";

/**
 * This function returns a Blob from the given BlobParts, on some browsers the Blob type may have different implementations to on error we may need to to build it differently.
 */
export const getBlob = (data: BlobPart, type?: string, onErrorMessage?: string): Blob | undefined => {
    try {
        return new Blob([data], { type });
    } catch (e: any) {
        if (e.name !== 'TypeError') {
            if (onErrorMessage) {
                toast.error(onErrorMessage);
            }

            return;
        }

        const anyWindow = window as any;
        const BlobBuilder = anyWindow.BlobBuilder ||
            anyWindow.WebKitBlobBuilder ||
            anyWindow.MozBlobBuilder ||
            anyWindow.MSBlobBuilder;

        if (BlobBuilder) {
            const bb = new BlobBuilder();
            bb.append(data);

            return bb.getBlob(type);
        }

        if (onErrorMessage) {
            toast.error(onErrorMessage);
        }
    }
}

/**
 * Use this function to open a document in another tab if the given content type is supported.
 */
export const openDocument = (data: BlobPart, contentType: string = "application/octet-stream", onErrorMessage?: string) => {
    const file = getBlob(data, contentType, onErrorMessage);

    if (!file) {
        return;
    }

    const fileURL = URL.createObjectURL(file);
    const pdfWindow = window.open();

    if (pdfWindow) {
        pdfWindow.location.href = fileURL;
    }
};

/**
 * Use this function to download a document.
 */
export const downloadDocument = (data: BlobPart, fileName?: string, onErrorMessage?: string) => {
    const file = getBlob(data, "application/octet-stream", onErrorMessage);

    if (!file) {
        return;
    }

    const fileURL = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = fileURL;
    link.setAttribute('download', !isUndefined(fileName) && !isEmpty(fileName) ? fileName : 'file.bin');
    document.body.appendChild(link);
    link.click();
};