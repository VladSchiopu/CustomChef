import {
    Button,
    CircularProgress,
    FormControl,
    FormHelperText,
    FormLabel,
    Stack,
    OutlinedInput,
    Select,
    MenuItem
} from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";
import { useUserAddFormController } from "./UserAddForm.controller";
import { isEmpty, isUndefined } from "lodash";

/**
 * Here we declare the user add form component.
 * This form may be used in modals so the onSubmit callback could close the modal on completion.
 */
export const UserAddForm = (props: { onSubmit?: () => void }) => {
    const { formatMessage } = useIntl();
    const { state, actions, computed } = useUserAddFormController(props.onSubmit); // Use the controller.

    return <form onSubmit={actions.handleSubmit(actions.submit)}> {/* Wrap your form into a form tag and use the handle submit callback to validate the form and call the data submission. */}
        <Stack spacing={4} style={{ width: "100%" }}>
            <div className="grid grid-cols-2 gap-y-5 gap-x-5">
                <div className="col-span-1">
                    <FormControl
                        fullWidth
                        error={!isUndefined(state.errors.name)}
                    > {/* Wrap the input into a form control and use the errors to show the input invalid if needed. */}
                        <FormLabel required>
                            <FormattedMessage id="globals.name" />
                        </FormLabel> {/* Add a form label to indicate what the input means. */}
                        <OutlinedInput
                            {...actions.register("name")} // Bind the form variable to the UI input.
                            placeholder={formatMessage(
                                { id: "globals.placeholders.textInput" },
                                {
                                    fieldName: formatMessage({
                                        id: "globals.name",
                                    }),
                                })}
                            autoComplete="none"
                        /> {/* Add a input like a textbox shown here. */}
                        <FormHelperText
                            hidden={isUndefined(state.errors.name)}
                        >
                            {state.errors.name?.message}
                        </FormHelperText> {/* Add a helper text that is shown then the input has a invalid value. */}
                    </FormControl>
                </div>
                <div className="col-span-1">
                    <FormControl
                        fullWidth
                        error={!isUndefined(state.errors.email)}
                    >
                        <FormLabel required>
                            <FormattedMessage id="globals.email" />
                        </FormLabel>
                        <OutlinedInput
                            {...actions.register("email")}
                            placeholder={formatMessage(
                                { id: "globals.placeholders.textInput" },
                                {
                                    fieldName: formatMessage({
                                        id: "globals.email",
                                    }),
                                })}
                            autoComplete="none"
                        />
                        <FormHelperText
                            hidden={isUndefined(state.errors.email)}
                        >
                            {state.errors.email?.message}
                        </FormHelperText>
                    </FormControl>
                </div>
                <div className="col-span-1">
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
                            autoComplete="none"
                        />
                        <FormHelperText
                            hidden={isUndefined(state.errors.password)}
                        >
                            {state.errors.password?.message}
                        </FormHelperText>
                    </FormControl>
                </div>
                <div className="col-span-1">
                    <FormControl
                        fullWidth
                        error={!isUndefined(state.errors.role)}
                    >
                        <FormLabel required>
                            <FormattedMessage id="globals.role" />
                        </FormLabel>
                        <Select
                            {...actions.register("role")}
                            value={actions.watch("role")}
                            onChange={actions.selectRole} // Selects may need a listener to for the variable change.
                            displayEmpty
                        >
                            <MenuItem value="" disabled> {/* Add the select options, the first here is used as a placeholder. */}
                                <span className="text-gray">
                                        {formatMessage({ id: "globals.placeholders.selectInput" }, {
                                            fieldName: formatMessage({
                                                id: "globals.role",
                                            }),
                                        })}
                                    </span>
                            </MenuItem>
                            <MenuItem value={"USER"}>
                                <FormattedMessage id="globals.client" />
                            </MenuItem>
                            <MenuItem value={"ADMIN"}>
                                <FormattedMessage id="globals.admin" />
                            </MenuItem>
                        </Select>
                        <FormHelperText
                            hidden={isUndefined(state.errors.role)}
                        >
                            {state.errors.role?.message}
                        </FormHelperText>
                    </FormControl>
                </div>
                <Button className="-col-end-1 col-span-1" type="submit" disabled={!isEmpty(state.errors) || computed.isSubmitting}> {/* Add a button with type submit to call the submission callback if the button is a descended of the form element. */}
                    {!computed.isSubmitting && <FormattedMessage id="globals.submit" />}
                    {computed.isSubmitting && <CircularProgress />}
                </Button>
            </div>
        </Stack>
    </form>
};