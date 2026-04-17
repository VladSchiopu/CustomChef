import { PropsWithChildren } from "react";

export type DataLoadingProps = { isLoading?: boolean, isError?: boolean, tryReload?: () => void };
export type DataLoadingPropsWithChildren = PropsWithChildren<DataLoadingProps>;