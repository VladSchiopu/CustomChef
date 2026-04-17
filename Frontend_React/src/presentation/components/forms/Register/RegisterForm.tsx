import { Button, CircularProgress, FormControl, FormHelperText, FormLabel, Stack, OutlinedInput } from "@mui/material";
import { useIntl } from "react-intl";
import { useRegisterFormController } from "./RegisterForm.controller";
import { ContentCard } from "@presentation/components/ui/ContentCard";
import { isEmpty, isUndefined } from "lodash";

export const RegisterForm = () => {
    const { formatMessage } = useIntl();
    const { state, actions, computed } = useRegisterFormController();

    return <form className="min-w-[400px]" onSubmit={actions.handleSubmit(actions.submit)}>
        <Stack spacing={4} style={{ width: "100%" }}>
            <ContentCard title="Register">
                <div className="grid grid-cols-2 gap-y-5 gap-x-5">
                    
                    <div className="col-span-2">
                        <FormControl fullWidth error={!isUndefined(state.errors.name)}>
                            <FormLabel required>Nume</FormLabel>
                            <OutlinedInput {...actions.register("name")} placeholder="Introdu numele" />
                            <FormHelperText hidden={isUndefined(state.errors.name)}>{state.errors.name?.message}</FormHelperText>
                        </FormControl>
                    </div>

                    <div className="col-span-2">
                        <FormControl fullWidth error={!isUndefined(state.errors.email)}>
                            <FormLabel required>Email</FormLabel>
                            <OutlinedInput {...actions.register("email")} placeholder="Introdu emailul" autoComplete="username" />
                            <FormHelperText hidden={isUndefined(state.errors.email)}>{state.errors.email?.message}</FormHelperText>
                        </FormControl>
                    </div>

                    <div className="col-span-2">
                        <FormControl fullWidth error={!isUndefined(state.errors.password)}>
                            <FormLabel required>Parolă</FormLabel>
                            <OutlinedInput type="password" {...actions.register("password")} placeholder="Introdu parola" autoComplete="new-password" />
                            <FormHelperText hidden={isUndefined(state.errors.password)}>{state.errors.password?.message}</FormHelperText>
                        </FormControl>
                    </div>

                    <div className="col-span-2">
                        <FormControl fullWidth error={!isUndefined(state.errors.confirmPassword)}>
                            <FormLabel required>Confirmă Parola</FormLabel>
                            <OutlinedInput type="password" {...actions.register("confirmPassword")} placeholder="Confirmă parola" />
                            <FormHelperText hidden={isUndefined(state.errors.confirmPassword)}>{state.errors.confirmPassword?.message}</FormHelperText>
                        </FormControl>
                    </div>

                    <Button className="-col-end-1 col-span-1" type="submit" disabled={!isEmpty(state.errors) || computed.isSubmitting} variant="contained">
                        {!computed.isSubmitting && "Înregistrare"}
                        {computed.isSubmitting && <CircularProgress size={24} />}
                    </Button>
                </div>
            </ContentCard>
        </Stack>
    </form>
};