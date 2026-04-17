import {
    Button,
    CircularProgress,
    FormControl,
    FormHelperText,
    FormLabel,
    Stack,
    OutlinedInput
} from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";
import { useLoginFormController } from "./LoginForm.controller";
import { ContentCard } from "@presentation/components/ui/ContentCard";
import { isEmpty, isUndefined } from "lodash";
import { useAppRouter } from "@infrastructure/hooks/useAppRouter";
import { AppRoute } from "routes";

/**
 * Here we declare the login form component.
 */
export const LoginForm = () => {
    const { formatMessage } = useIntl();
    const { state, actions, computed } = useLoginFormController();
    const { navigate } = useAppRouter();

    const orangeButtonStyle = {
        bgcolor: '#FF7034',
        color: 'white',
        '&:hover': {
            bgcolor: '#e65f2b',
        },
        fontWeight: 'bold',
        textTransform: 'none'
    };

    return <form className="min-w-[400px]" onSubmit={actions.handleSubmit(actions.submit)}> {/* Wrap your form into a form tag and use the handle submit callback to validate the form and call the data submission. */}
        <Stack spacing={4} style={{ width: "100%" }}>
            <ContentCard title={formatMessage({ id: "globals.login" })}>
                <div className="grid grid-cols-2 gap-y-5 gap-x-5">
                    <div className="col-span-2">
                        <FormControl 
                            fullWidth
                            error={!isUndefined(state.errors.email)}
                        > {/* Wrap the input into a form control and use the errors to show the input invalid if needed. */}
                            <FormLabel required>
                                <FormattedMessage id="globals.email" />
                            </FormLabel> {/* Add a form label to indicate what the input means. */}
                            <OutlinedInput
                                {...actions.register("email")} // Bind the form variable to the UI input.
                                placeholder={formatMessage(
                                    { id: "globals.placeholders.textInput" },
                                    {
                                        fieldName: formatMessage({
                                            id: "globals.email",
                                        }),
                                    })}
                                autoComplete="username"
                            /> {/* Add a input like a textbox shown here. */}
                            <FormHelperText
                                hidden={isUndefined(state.errors.email)}
                            >
                                {state.errors.email?.message}
                            </FormHelperText> {/* Add a helper text that is shown then the input has a invalid value. */}
                        </FormControl>
                    </div>
                    <div className="col-span-2">
                        <FormControl
                            fullWidth
                            error={!isUndefined(state.errors.password)}
                        >
                            <FormLabel required>
                                <FormattedMessage id="globals.password" />
                            </FormLabel>
                            <OutlinedInput
                                type="password"
                                {...actions.register("password")}
                                placeholder={formatMessage(
                                    { id: "globals.placeholders.textInput" },
                                    {
                                        fieldName: formatMessage({
                                            id: "globals.password",
                                        }),
                                    })}
                                autoComplete="current-password"
                            />
                            <FormHelperText
                                hidden={isUndefined(state.errors.password)}
                            >
                                {state.errors.password?.message}
                            </FormHelperText>
                        </FormControl>
                    </div>
                   <div className="col-span-2 flex justify-between mt-2 gap-4">
                        <Button 
                            variant="contained" 
                            sx={orangeButtonStyle}
                            onClick={() => navigate(AppRoute.Register)}
                        >
                            {formatMessage({ id: "globals.create_account"})}
                        </Button>

                        <Button 
                            type="submit" 
                            variant="contained"
                            sx={orangeButtonStyle}
                            disabled={!isEmpty(state.errors) || computed.isSubmitting}
                        > 
                            {!computed.isSubmitting && <FormattedMessage id="globals.submit" />}
                            {computed.isSubmitting && <CircularProgress size={24} color="inherit" />}
                        </Button>
                    </div>
                </div>
            </ContentCard>
        </Stack>
    </form>
};