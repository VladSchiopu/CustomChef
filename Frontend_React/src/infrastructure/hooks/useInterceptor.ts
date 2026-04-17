type InterceptorPros = {
    onRequest?: (args: [input: RequestInfo | URL, init?: RequestInit | undefined]) => [input: RequestInfo | URL, init?: RequestInit | undefined];
    onResponse?: (response: Response) => Response | Promise<Response>;
    onResponseError?: (error: any) => any;
};

const { fetch: originalFetch } = window;

/**
 * This hook sets the fetch interceptor to intercept HTTP requests and do some additional actions on it.
 */
export const useInterceptor = (props: InterceptorPros) => {
    if (window.fetch === originalFetch) {
        window.fetch = async (...args) => {
            const [resource, config] = props.onRequest ? props.onRequest(args) : args;

            try {
                const response = await originalFetch(resource, config);
                return props.onResponse ? props.onResponse(response) : response;
            } catch (error: any) {
                throw props.onResponseError ? props.onResponseError(error) : error;
            }
        };

        console.log("Fetch interceptor set!");
    }
};