import { RegisterFormController, RegisterFormModel } from "./RegisterForm.types";
import { yupResolver } from "@hookform/resolvers/yup";
import { useIntl } from "react-intl";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useRegister } from "@infrastructure/apis/api-management";
import { useCallback } from "react";
import { useAppRouter } from "@infrastructure/hooks/useAppRouter";
import { toast } from "react-toastify";
import { AppRoute } from "routes";

const getDefaultValues = () => ({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
});

const useInitRegisterForm = () => {
    const { formatMessage } = useIntl();
    const defaultValues = getDefaultValues();

    const schema = yup.object().shape({
        name: yup.string().required(formatMessage({ id: "globals.validations.requiredField" }, { fieldName: "Name" })),
        email: yup.string().required(formatMessage({ id: "globals.validations.requiredField" }, { fieldName: "Email" })).email(),
        password: yup.string().required(formatMessage({ id: "globals.validations.requiredField" }, { fieldName: "Password" })).min(6),
        confirmPassword: yup.string()
            .required("Please confirm password")
            .oneOf([yup.ref('password')], "Passwords don't match")
    });

    const resolver = yupResolver(schema);
    return { defaultValues, resolver };
}

export const useRegisterFormController = (): RegisterFormController => {
    const { formatMessage } = useIntl();
    const { defaultValues, resolver } = useInitRegisterForm();
    
    const { navigate } = useAppRouter(); 
    const { mutateAsync: registerUser, status } = useRegister();

    const submit = useCallback((data: RegisterFormModel) => 
        registerUser({ email: data.email, password: data.password, username: data.name }).then(() => {
            toast.success("Cont creat cu succes! Te poți loga acum.");
            
            navigate(AppRoute.Login); 
        }).catch(() => {
            toast.error("Eroare la crearea contului!");
        }), [registerUser, navigate]);

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormModel>({
        defaultValues,
        resolver
    });

    return {
        actions: { handleSubmit, submit, register },
        computed: { defaultValues, isSubmitting: status === "pending" },
        state: { errors }
    }
}