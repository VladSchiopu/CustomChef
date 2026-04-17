/**
 * This interface can be used as a template for form controller hooks.
 */
export interface FormController<TState, TActions, TComputed> {
    state: TState;
    actions: TActions;
    computed: TComputed;
};
