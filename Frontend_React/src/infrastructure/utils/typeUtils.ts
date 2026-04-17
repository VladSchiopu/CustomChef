/**
 * This function may be used as a generic type guard to verify on runtime if the object instance conforms to a given type.
 */
export function is<T>(obj: any): obj is T {
    if (obj as T) {
        return true;
    }

    return false;
}
