import { UserAddFormController, UserAddFormModel, RoleName } from "./UserAddForm.types";
import { yupResolver } from "@hookform/resolvers/yup";
import { useIntl } from "react-intl";
import * as yup from "yup";
import { isUndefined } from "lodash";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { useAddUser } from "@infrastructure/apis/api-management";
import { useCallback } from "react";
import { Role } from "@infrastructure/apis/client";
import { SelectChangeEvent } from "@mui/material";

/**
 * Use a function to return the default values of the form and the validation schema.
 * You can add other values as the default, for example when populating the form with data to update an entity in the backend.
 */
const getDefaultValues = (initialData?: UserAddFormModel) => {
    const defaultValues = {
        email: "",
        name: "",
        password: "",
        role: "USER" as RoleName
    };

    if (!isUndefined(initialData)) {
        return {
            ...defaultValues,
            ...initialData,
        };
    }

    return defaultValues;
};

/**
 * Create a hook to get the validation schema.
 */
const useInitUserAddForm = () => {
    const { formatMessage } = useIntl();
    const defaultValues = getDefaultValues();

    const schema = yup.object().shape({
        name: yup.string()
            .required(formatMessage(
                { id: "globals.validations.requiredField" },
                {
                    fieldName: formatMessage({
                        id: "globals.name",
                    }),
                }))
            .default(defaultValues.name),
        email: yup.string()
            .required(formatMessage(
                { id: "globals.validations.requiredField" },
                {
                    fieldName: formatMessage({
                        id: "globals.email",
                    }),
                }))
            .email()
            .default(defaultValues.email),
        password: yup.string()
            .required(formatMessage(
                { id: "globals.validations.requiredField" },
                {
                    fieldName: formatMessage({
                        id: "globals.password",
                    }),
                })),
        role: yup.mixed<RoleName>()
            .oneOf([ // The select input should have one of these values.
                "ADMIN",
                "PERSONNEL",
                "CLIENT",
                "USER"
            ])
            .required(formatMessage(
                { id: "globals.validations.requiredField" },
                {
                    fieldName: formatMessage({
                        id: "globals.role",
                    }),
                }))
            .default(defaultValues.role)
    });

    const resolver = yupResolver(schema);

    return { defaultValues, resolver };
}

/**
 * Create a controller hook for the form and return any data that is necessary for the form.
 */
export const useUserAddFormController = (onSubmit?: () => void): UserAddFormController => {
    const { defaultValues, resolver } = useInitUserAddForm();
    const { mutateAsync: add, status } = useAddUser();
    const queryClient = useQueryClient();
    const submit = useCallback((data: UserAddFormModel) => { // Create a submit callback to send the form data to the backend.
        const payload = {
            ...data,
            username: data.name,
            role: {
                id: 2,
                name: data.role
            } as Role
        };

        return add(payload).then(() => {
            if (onSubmit) onSubmit();
        })}, [add, queryClient]);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors }
    } = useForm<UserAddFormModel>({ // Use the useForm hook to get callbacks and variables to work with the form.
        defaultValues, // Initialize the form with the default values.
        resolver // Add the validation resolver.
    });

    const selectRole = useCallback((event: SelectChangeEvent<string>) => { // Select inputs are tricky and may need their on callbacks to set the values.
        setValue("role", event.target.value as RoleName, {
            shouldValidate: true,
        });
    }, [setValue]);

    return {
        actions: { // Return any callbacks needed to interact with the form.
            handleSubmit, // Add the form submit handle.
            submit, // Add the submit handle that needs to be passed to the submit handle.
            register, // Add the variable register to bind the form fields in the UI with the form variables.
            watch, // Add a watch on the variables, this function can be used to watch changes on variables if it is needed in some locations.
            selectRole
        },
        computed: {
            defaultValues,
            isSubmitting: status === "pending" // Return if the form is still submitting or nit.
        },
        state: {
            errors // Return what errors have occurred when validating the form input.
        }
    }
}