import { useCallback, useState } from "react";

/**
 * This hook represent the generic logic to work with the material UI dialog.
 */
export const useDialogController = () => {
    const [isOpen, setIsOpen] = useState(false); // It uses a state to manage the open status of the dialog.

    const open = useCallback(() => { // Create a callback to open the dialog.
        setIsOpen(true);
    }, [setIsOpen]);

    const close = useCallback(() => { // Create a callback to close the dialog.
        setIsOpen(false);
    }, [setIsOpen]);

    return { // Return the callbacks and the current state.
        isOpen,
        close,
        open
    }
}