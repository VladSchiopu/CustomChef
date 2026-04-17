export type UploadButtonProps = { 
    acceptFileType: string,
    text: string, 
    onUpload: (file: File) => Promise<void> | void,
    isLoading: boolean,
    disabled?: boolean
};

export type SpecificUploadButtonProps = Omit<UploadButtonProps, "acceptFileType">;