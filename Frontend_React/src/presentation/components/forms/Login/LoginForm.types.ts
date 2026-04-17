import { FormController } from "../FormController";
import {
    UseFormHandleSubmit,
    UseFormRegister,
    FieldErrorsImpl,
    DeepRequired
} from "react-hook-form";

export type LoginFormModel = {
    email: string;
    password: string;
};

export type LoginFormState = {
    errors: FieldErrorsImpl<DeepRequired<LoginFormModel>>;
};

export type LoginFormActions = {
    register: UseFormRegister<LoginFormModel>;
    handleSubmit: UseFormHandleSubmit<LoginFormModel>;
    submit: (body: LoginFormModel) => void;
};
export type LoginFormComputed = {
    defaultValues: LoginFormModel,
    isSubmitting: boolean
};

export type LoginFormController = FormController<LoginFormState, LoginFormActions, LoginFormComputed>;