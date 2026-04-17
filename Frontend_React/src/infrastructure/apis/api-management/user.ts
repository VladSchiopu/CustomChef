import { useAppSelector } from "@application/store";
import {Configuration, UserAddDto, UserControllerApi} from "../client";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {isEmpty} from "lodash";

/**
 * Use constants to identify mutations and queries.
 */
const getUsersQueryKey = "getUsersQuery";
const getUserQueryKey = "getUserQuery";
const addUserMutationKey = "addUserMutation";

const getFactory = (token: string | null) => new UserControllerApi(new Configuration({accessToken: token ?? ""}));

export const useGetUsers = (page: number, pageSize: number) => {
    const {token} = useAppSelector(x => x.profileReducer); // You can use the data form the Redux storage.

    return {
        ...useQuery({
            queryKey: [getUsersQueryKey, token, page, pageSize],
            queryFn: async () => await getFactory(token).getUsers({pageNo: page, pageSize}),
            refetchInterval: Infinity, // User information may not be frequently updated so refetching the data periodically is not necessary.
            refetchOnWindowFocus: false // This disables fetching the user information from the backend when focusing on the current window.
        }),
        queryKey: getUsersQueryKey
    };
}

export const useGetUser = (email: string | null) => {
    const { token } = useAppSelector(x => x.profileReducer); // You can use the data form the Redux storage.

    return {
        ...useQuery({
            queryKey: [getUserQueryKey, token, email],
            queryFn: async () => await getFactory(token).getUserByEmail({email: email ?? ""}),
            refetchInterval: Infinity, // User information may not be frequently updated so refetching the data periodically is not necessary.
            refetchOnWindowFocus: false, // This disables fetching the user information from the backend when focusing on the current window.
            enabled: !isEmpty(email)
        }),
        queryKey: getUserQueryKey
    };
}

export const useAddUser = () => {
    const { token } = useAppSelector(x => x.profileReducer); // You can use the data form the Redux storage.
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: [addUserMutationKey, token],
        mutationFn: async (userAddDto: UserAddDto) => {
            const result = await getFactory(token).addUser({ userAddDto });
            await queryClient.invalidateQueries({queryKey: [getUsersQueryKey]});  // If the form submission succeeds then some other queries need to be refresh so invalidate them to do a refresh.
            await queryClient.invalidateQueries({queryKey: [getUserQueryKey]});

            return result;
        }
    })
}