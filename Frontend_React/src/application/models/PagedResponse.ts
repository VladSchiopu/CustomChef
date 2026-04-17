/**
 * PagedResponse is a generic interface to check types that conform to this interface mostly paged responses from the API.
 */
export interface PagedResponse<T> {
    page?: number,
    pageSize?: number,
    totalCount?: number,
    data?: T[] | null
};