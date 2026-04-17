import { SupportedLanguage } from "presentation/assets/lang";
import {
  createContext,
  useContext,
  PropsWithChildren,
  useMemo,
  useReducer,
} from "react";
import { languageContextReducer } from "./language.reducer";
import { LanguageAPI, LanguageState } from "./LanguageContextProvider.types";

const LanguageDataContext = createContext<LanguageState>({} as LanguageState);
const LanguageAPIContext = createContext<LanguageAPI>({} as LanguageAPI);

/**
 * This is the language provider that should wrap the page content to have access to the internationalization.
 */
export const LanguageContextProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(languageContextReducer, {
    selectedLanguage: SupportedLanguage.RO,
  });

  const api: LanguageAPI = useMemo(() => {
    const setRomanian = () => {
      dispatch({ type: "setRomanianLanguage" });
    };

    const setEnglish = () => {
      dispatch({ type: "setEnglishLanguage" });
    };

    return { setRomanian, setEnglish };
  }, []);

  return (
    <LanguageAPIContext.Provider value={api}>
      <LanguageDataContext.Provider value={state}>
        {children}
      </LanguageDataContext.Provider>
    </LanguageAPIContext.Provider>
  );
};

export const useLanguageState = () => useContext(LanguageDataContext);
export const useLanguageAPI = () => useContext(LanguageAPIContext);
