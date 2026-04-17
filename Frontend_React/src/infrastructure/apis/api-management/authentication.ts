import { LoginDto } from "../client/models";
import { RegisterDto } from "../client/models";
import { AuthControllerApi } from "../client/apis";
import {useMutation} from "@tanstack/react-query";

/**
 * Use constants to identify mutations and queries.
 */
const loginMutationKey = "loginMutation";

/**
 * Returns the object with the callbacks that can be used for the React Query API, in this case just to log in the user.
 */
export const useLogin = () => {
    return useMutation({ // Return the mutation object.
        mutationKey: [loginMutationKey], // Add the key to identify the mutation.
        mutationFn: (loginDto: LoginDto) => new AuthControllerApi().login({ loginDto }) // Add the mutation callback by using the generated client code and adapt it.
    })
}

const registerMutationKey = "registerMutation";

export const useRegister = () => {
    return useMutation({
        mutationKey: [registerMutationKey],
        mutationFn: (registerDto: RegisterDto) => new AuthControllerApi().register({ registerDto })
    })
}